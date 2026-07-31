#!/usr/bin/env node
/**
 * build.js — genera la grilla y los modales de index.html, y la lista de
 * precache de sw.js, a partir de herramientas.json.
 *
 * Node puro, sin dependencias. Uso:
 *
 *   node build.js            regenera index.html y sw.js
 *   node build.js --check    no escribe; sale 1 si algo quedó desactualizado
 *   node build.js --stats    conteos por categoría y logos huérfanos en disco
 *   node build.js --nombres  tabla de renombres, para leer los informes de GA4
 *
 * Solo toca las regiones entre marcadores BEGIN/END. Todo lo demás de
 * index.html —el <head>, el tracking de GA4, el footer— queda fuera de su
 * alcance por construcción: nunca escribe por debajo de END:MODALES.
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const DIR = __dirname;
const DATOS = path.join(DIR, "herramientas.json");
const INDEX = path.join(DIR, "index.html");
const SW = path.join(DIR, "sw.js");

// Assets que se precachean siempre, más allá de los logos del JSON.
const ASSETS_FIJOS = [
  "./",
  "./index.html",
  "./cual.html",
  "./styles.css",
  "./scripts.js",
  "./manifest.json",
  "./favicon.ico",
  "./icon-192.png",
  "./icon-512.png",
  "./herramientas-ia.jpg",
];

// Etiquetas HTML que tienen sentido dentro de una descripción de modal.
const ETIQUETAS_PERMITIDAS = ["br", "em", "strong", "b", "i", "a", "ul", "ol", "li", "code"];

// --- escapado: la regla es por contexto, no por campo ------------------------

const escAttr = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const escText = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// --- validación --------------------------------------------------------------

function validar(datos) {
  const fallos = [];
  const avisos = [];
  const vistos = new Map();
  const nombres = new Map();

  if (!Array.isArray(datos.categorias) || !datos.categorias.length) {
    fallos.push("herramientas.json no tiene categorías");
    return { fallos, avisos };
  }

  const idsCategoria = new Set();
  for (const c of datos.categorias) {
    if (!c.id || !c.titulo) fallos.push(`Categoría sin id o sin titulo: ${JSON.stringify(c)}`);
    if (idsCategoria.has(c.id)) fallos.push(`Categoría duplicada: ${c.id}`);
    idsCategoria.add(c.id);

    for (const h of c.herramientas || []) {
      const donde = `[${c.id}] ${h.id || h.nombre || "?"}`;

      if (!h.id || !/^[a-z0-9]+$/.test(h.id)) fallos.push(`${donde}: id inválido (solo a-z y 0-9)`);
      if (vistos.has(h.id)) fallos.push(`${donde}: id repetido (ya está en ${vistos.get(h.id)})`);
      vistos.set(h.id, c.id);

      if (!h.nombre || h.nombre !== h.nombre.trim()) fallos.push(`${donde}: nombre vacío o con espacios sobrantes`);
      if (nombres.has(h.nombre)) fallos.push(`${donde}: nombre repetido con ${nombres.get(h.nombre)}`);
      nombres.set(h.nombre, h.id);

      // Las pendientes son solo un recordatorio: no se renderizan.
      if (h.pendiente) continue;

      if (!/^https:\/\//.test(h.url || "")) fallos.push(`${donde}: url debe empezar por https://`);
      if (h.tutorial !== null && !/^https:\/\//.test(h.tutorial || "")) {
        fallos.push(`${donde}: tutorial debe ser una URL https:// o null`);
      }

      if (!h.logo) fallos.push(`${donde}: falta logo`);
      else if (/^https?:\/\//i.test(h.logo)) fallos.push(`${donde}: los logos no se hotlinkean, guardalo local`);
      else if (!fs.existsSync(path.join(DIR, h.logo))) fallos.push(`${donde}: no existe el archivo ${h.logo}`);

      const d = h.descripcionHtml;
      if (!d || !d.trim()) fallos.push(`${donde}: descripcionHtml vacía`);
      else if (d.includes("<!--") || d.includes("-->")) {
        // Rompería la búsqueda de marcadores al escribir la región.
        fallos.push(`${donde}: descripcionHtml no puede contener comentarios HTML`);
      } else {
        for (const et of [...d.matchAll(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b/g)]) {
          if (!ETIQUETAS_PERMITIDAS.includes(et[1].toLowerCase())) {
            avisos.push(`${donde}: <${et[1]}> en la descripción no es una etiqueta habitual`);
          }
        }
      }

      for (const k of Object.keys(h.enlaces || {})) {
        if (k !== "en" && k !== "es") fallos.push(`${donde}: enlaces solo admite "en" y "es", no "${k}"`);
        else if (!/^https?:\/\//.test(h.enlaces[k])) fallos.push(`${donde}: enlaces.${k} no es una URL`);
      }
    }
  }

  return { fallos, avisos };
}

/**
 * Detecta renombres comparando contra el index.html que todavía no se regeneró.
 * No hace falta archivo de estado: el artefacto anterior es el estado.
 */
function detectarRenombres(datos, htmlPrevio) {
  const previos = new Map();
  for (const fila of htmlPrevio.split(/<div class="ai-button-row">/).slice(1)) {
    const mId = fila.match(/data-modal="modal-([^"]+)"/);
    const mBoton = fila.match(/<a\b[\s\S]*?class="ai-button"[\s\S]*?<\/a\s*>/);
    if (!mId || !mBoton) continue;
    // El mismo textContent.trim() que lee el tracking de GA4.
    const nombre = mBoton[0]
      .replace(/^<a\b[^>]*>/, "")
      .replace(/<\/a\s*>$/, "")
      .replace(/<[^>]*>/g, "")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim();
    previos.set(mId[1], nombre);
  }

  const cambios = [];
  for (const c of datos.categorias) {
    for (const h of c.herramientas || []) {
      if (h.pendiente) continue;
      const antes = previos.get(h.id);
      if (antes && antes !== h.nombre) {
        cambios.push({ id: h.id, antes, ahora: h.nombre, documentado: (h.nombresPrevios || []).includes(antes) });
      }
    }
  }
  return cambios;
}

// --- generación --------------------------------------------------------------

function filaHTML(h) {
  if (h.pendiente) return `            <!-- PENDIENTE: ${h.nombre}${h.url ? ` (${h.url})` : ""} -->`;

  // Sin tutorial: se emite sin href ni target. Antes eran href="#" target="_blank",
  // así que un clic abría una pestaña en blanco. Sigue siendo un .youtube-button,
  // que es de lo que depende el evento click_tutorial de GA4.
  const yt = h.tutorial
    ? `<a href="${escAttr(h.tutorial)}" class="youtube-button" target="_blank" rel="noopener">▶</a>`
    : `<a class="youtube-button sin-enlace" role="link" aria-disabled="true" title="Tutorial próximamente">▶</a>`;

  return [
    `            <!-- ${h.nombre.toUpperCase()} -->`,
    `            <div class="ai-button-row">`,
    `              <a href="${escAttr(h.url)}" target="_blank" rel="noopener" class="ai-button">`,
    `                <img src="${escAttr(h.logo)}" alt="${escAttr(h.alt || h.nombre + " Logo")}" />`,
    // El .ai-button contiene un <img> sin texto y un único nodo de texto con el
    // nombre: es lo que hace que btn.textContent.trim() siga siendo el valor
    // exacto que el tracking de GA4 viene enviando.
    `                ${escText(h.nombre)}`,
    `              </a>`,
    `              <button class="info-button" data-modal="modal-${h.id}">?</button>`,
    `              ${yt}`,
    `            </div>`,
  ].join("\n");
}

function modalHTML(h, etiquetas) {
  const e = h.enlaces || {};
  const partes = [];
  if (e.en) partes.push(`            <a href="${escAttr(e.en)}" target="_blank" rel="noopener">${etiquetas.en}</a>`);
  if (e.es) partes.push(`            <a href="${escAttr(e.es)}" target="_blank" rel="noopener">${etiquetas.es}</a>`);

  const bloque = partes.length
    ? `\n          <div class="modal-links">\n${partes.join("\n")}\n          </div>`
    : "";

  return [
    `      <!-- MODAL ${h.nombre.toUpperCase()} -->`,
    `      <div id="modal-${h.id}" class="modal">`,
    `        <div class="modal-content">`,
    `          <span class="close-button">&times;</span>`,
    `          <h3>${escText(h.modalTitulo || h.nombre)}</h3>`,
    `          <p>${h.descripcionHtml}</p>` + bloque,
    `        </div>`,
    `      </div>`,
  ].join("\n");
}

function generarGrilla(datos) {
  return datos.categorias
    .map((c) => {
      const filas = (c.herramientas || []).map(filaHTML).join("\n\n");
      return [
        `        <!-- ${c.titulo.toUpperCase()} -->`,
        `        <div class="category-container">`,
        `          <h2>${escText(c.titulo)}</h2>`,
        `          <div class="button-grid">`,
        ``,
        filas,
        ``,
        `          </div>`,
        `        </div>`,
      ].join("\n");
    })
    .join("\n\n");
}

function generarModales(datos) {
  const etiquetas = datos.etiquetasEnlaces || { en: "More info (EN)", es: "Más info (ES)" };
  return datos.categorias
    .flatMap((c) => (c.herramientas || []).filter((h) => !h.pendiente))
    .map((h) => modalHTML(h, etiquetas))
    .join("\n\n");
}

// --- reemplazo de regiones ---------------------------------------------------

function columnaDe(texto, indice) {
  const inicioLinea = texto.lastIndexOf("\n", indice - 1) + 1;
  return indice - inicioLinea;
}

function reemplazarRegion(contenido, nombre, cuerpo, comentario = "html") {
  const [ini, fin] =
    comentario === "html"
      ? [new RegExp(`<!--\\s*BEGIN:${nombre}\\b[^>]*-->`, "g"), new RegExp(`<!--\\s*END:${nombre}\\s*-->`, "g")]
      : [new RegExp(`//\\s*BEGIN:${nombre}\\b.*`, "g"), new RegExp(`//\\s*END:${nombre}\\s*$`, "gm")];

  const inis = [...contenido.matchAll(ini)];
  const fins = [...contenido.matchAll(fin)];
  if (inis.length !== 1) throw new Error(`Se esperaba 1 marcador BEGIN:${nombre}, hay ${inis.length}`);
  if (fins.length !== 1) throw new Error(`Se esperaba 1 marcador END:${nombre}, hay ${fins.length}`);

  const desde = inis[0].index + inis[0][0].length;
  const hasta = fins[0].index;
  if (hasta < desde) throw new Error(`END:${nombre} aparece antes que BEGIN:${nombre}`);

  const sangria = " ".repeat(columnaDe(contenido, hasta));
  return contenido.slice(0, desde) + "\n" + cuerpo + "\n" + sangria + contenido.slice(hasta);
}

// --- service worker ----------------------------------------------------------

function listaAssets(datos) {
  const logos = datos.categorias
    .flatMap((c) => (c.herramientas || []).filter((h) => !h.pendiente))
    .map((h) => "./" + h.logo);

  const assets = [...ASSETS_FIJOS, ...new Set(logos)];

  // cache.addAll es atómico: un solo 404 deja el service worker muerto.
  const faltantes = assets
    .filter((a) => a !== "./")
    .filter((a) => !fs.existsSync(path.join(DIR, a.replace(/^\.\//, ""))));
  if (faltantes.length) throw new Error(`Assets inexistentes para el precache:\n  ${faltantes.join("\n  ")}`);

  return assets;
}

/**
 * CACHE_NAME derivado del contenido: cualquier cambio en los datos o en el
 * código produce un caché nuevo, así que la invalidación deja de ser un paso
 * manual que se olvida.
 */
function hashContenido(indexHtml) {
  const h = crypto.createHash("sha1");
  h.update(fs.readFileSync(DATOS));
  h.update(indexHtml);
  for (const f of ["styles.css", "scripts.js"]) {
    const p = path.join(DIR, f);
    if (fs.existsSync(p)) h.update(fs.readFileSync(p));
  }
  return h.digest("hex").slice(0, 8);
}

// --- CLI ---------------------------------------------------------------------

function main() {
  const args = process.argv.slice(2);
  const soloComprobar = args.includes("--check");
  const datos = JSON.parse(fs.readFileSync(DATOS, "utf8"));

  const activas = datos.categorias.flatMap((c) => (c.herramientas || []).filter((h) => !h.pendiente));
  const pendientes = datos.categorias.flatMap((c) => (c.herramientas || []).filter((h) => h.pendiente));

  if (args.includes("--nombres")) {
    const conHistorial = activas.filter((h) => (h.nombresPrevios || []).length);
    if (!conHistorial.length) {
      console.log("Ninguna herramienta cambió de nombre todavía.");
    } else {
      console.log("id".padEnd(14) + "nombre actual".padEnd(22) + "nombres previos");
      for (const h of conHistorial) {
        console.log(h.id.padEnd(14) + h.nombre.padEnd(22) + h.nombresPrevios.join(", "));
      }
      console.log("\nEn GA4 hay que sumar las etiquetas de cada fila para ver la serie completa.");
    }
    return;
  }

  const { fallos, avisos } = validar(datos);
  if (fallos.length) {
    console.error("✗ herramientas.json tiene errores:\n  " + fallos.join("\n  "));
    process.exit(1);
  }
  for (const a of avisos) console.warn("⚠ " + a);

  if (args.includes("--stats")) {
    console.log(`${activas.length} herramientas activas, ${pendientes.length} pendientes\n`);
    for (const c of datos.categorias) {
      const act = (c.herramientas || []).filter((h) => !h.pendiente);
      console.log(`  ${c.titulo.padEnd(18)} ${String(act.length).padStart(2)}`);
    }
    const usados = new Set(activas.map((h) => h.logo));
    const enDisco = fs.readdirSync(DIR).filter((f) => /^logo_.*\.png$/.test(f));
    const huerfanos = enDisco.filter((f) => !usados.has(f));
    console.log(`\n  logos en uso: ${usados.size} · en disco: ${enDisco.length}`);
    if (huerfanos.length) console.log(`  huérfanos (no referenciados): ${huerfanos.join(", ")}`);
    return;
  }

  const indexPrevio = fs.readFileSync(INDEX, "utf8");

  for (const r of detectarRenombres(datos, indexPrevio)) {
    console.warn(`⚠ "${r.antes}" → "${r.ahora}": la serie de GA4 se parte acá.`);
    if (!r.documentado) {
      console.warn(`  Agregá "nombresPrevios": ["${r.antes}"] en la herramienta "${r.id}" para dejarlo registrado.`);
    }
  }

  let indexNuevo = reemplazarRegion(indexPrevio, "GRID", generarGrilla(datos));
  indexNuevo = reemplazarRegion(indexNuevo, "MODALES", generarModales(datos));

  // El contrato botón ↔ modal, comprobado sobre lo que realmente se emitió.
  const referidos = [...indexNuevo.matchAll(/data-modal="([^"]+)"/g)].map((m) => m[1]).sort();
  const definidos = [...indexNuevo.matchAll(/<div id="(modal-[^"]+)" class="modal">/g)].map((m) => m[1]).sort();
  if (referidos.join("|") !== definidos.join("|")) {
    const huerfanos = referidos.filter((x) => !definidos.includes(x));
    const sueltos = definidos.filter((x) => !referidos.includes(x));
    console.error("✗ Los botones y los modales no se corresponden:");
    if (huerfanos.length) console.error(`  botones sin modal: ${huerfanos.join(", ")}`);
    if (sueltos.length) console.error(`  modales sin botón: ${sueltos.join(", ")}`);
    process.exit(1);
  }

  const assets = listaAssets(datos);
  const cacheName = `herramientas-ia-${hashContenido(indexNuevo)}`;
  let swNuevo = fs.readFileSync(SW, "utf8");
  swNuevo = reemplazarRegion(swNuevo, "CACHE", `const CACHE_NAME = "${cacheName}";`, "js");
  swNuevo = reemplazarRegion(
    swNuevo,
    "ASSETS",
    ["const ASSETS = [", ...assets.map((a) => `  "${a}",`), "];"].join("\n"),
    "js"
  );

  if (soloComprobar) {
    const desactualizados = [];
    if (indexNuevo !== indexPrevio) desactualizados.push("index.html");
    if (swNuevo !== fs.readFileSync(SW, "utf8")) desactualizados.push("sw.js");
    if (desactualizados.length) {
      console.error(`✗ Desactualizado: ${desactualizados.join(", ")}. Ejecutá: node build.js`);
      process.exit(1);
    }
    console.log("✓ index.html y sw.js están al día");
    return;
  }

  fs.writeFileSync(INDEX, indexNuevo);
  fs.writeFileSync(SW, swNuevo);

  const resumen = datos.categorias
    .map((c) => `${c.titulo} ${(c.herramientas || []).filter((h) => !h.pendiente).length}`)
    .join(" · ");
  console.log(`✓ ${activas.length} herramientas en ${datos.categorias.length} categorías (${pendientes.length} pendientes omitidas)`);
  console.log(`  ${resumen}`);
  console.log(`✓ index.html: GRID (${activas.length} filas) + MODALES (${activas.length} bloques)`);
  console.log(`✓ sw.js: ${assets.length} assets · CACHE_NAME ${cacheName}`);
}

try {
  main();
} catch (e) {
  console.error("✗ " + e.message);
  process.exit(1);
}
