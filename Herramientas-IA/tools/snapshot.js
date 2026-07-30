#!/usr/bin/env node
/**
 * snapshot.js — herramienta TEMPORAL de verificación (se borra al terminar el refactor).
 *
 * Extrae del HTML estático la misma estructura que el snippet de consola del plan
 * produce sobre el DOM real. Como index.html es 100% estático (nada se genera en
 * cliente), ambas lecturas son equivalentes.
 *
 * Uso:  node tools/snapshot.js index.html > antes.json
 */

const fs = require("fs");

// --- utilidades de normalización -------------------------------------------

// Replica lo que hace el navegador al leer la propiedad .href (decodifica entidades).
const decodificar = (s) =>
  String(s)
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

// Replica textContent.trim() de un elemento que solo contiene texto y <img>/<br>.
const texto = (html) =>
  decodificar(
    String(html)
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
  ).trim();

// Normalización de la descripción: igual que el snippet del plan.
const normalizarDesc = (html) =>
  String(html)
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

const atributo = (etiqueta, nombre) => {
  const m = etiqueta.match(new RegExp(`\\b${nombre}\\s*=\\s*"([^"]*)"`));
  return m ? m[1] : null;
};

// --- extracción -------------------------------------------------------------

function extraerFilas(fragmento) {
  const filas = [];
  const rx = /<div class="ai-button-row">([\s\S]*?)<\/div>/g;
  let m;
  while ((m = rx.exec(fragmento)) !== null) {
    const fila = m[1];

    const aBoton = fila.match(/<a\b[\s\S]*?class="ai-button"[\s\S]*?<\/a\s*>/);
    if (!aBoton) throw new Error("Fila sin .ai-button:\n" + fila);
    const aperturaBoton = aBoton[0].match(/<a\b[^>]*>/)[0];
    const interiorBoton = aBoton[0].replace(/^<a\b[^>]*>/, "").replace(/<\/a\s*>$/, "");

    const img = fila.match(/<img\b[^>]*>/);
    if (!img) throw new Error("Fila sin <img>:\n" + fila);

    const info = fila.match(/<button\b[^>]*class="info-button"[^>]*>/);
    if (!info) throw new Error("Fila sin .info-button:\n" + fila);

    const yt = fila.match(/<a\b[^>]*class="youtube-button[^"]*"[^>]*>/);
    if (!yt) throw new Error("Fila sin .youtube-button:\n" + fila);
    const sinEnlace = /\bsin-enlace\b/.test(yt[0]);

    filas.push({
      nombre: texto(interiorBoton), // ← EXACTAMENTE lo que ve GA4
      href: decodificar(atributo(aperturaBoton, "href")),
      img: atributo(img[0], "src"),
      alt: decodificar(atributo(img[0], "alt") || ""),
      modal: atributo(info[0], "data-modal"),
      tutorial: sinEnlace ? null : decodificar(atributo(yt[0], "href")),
    });
  }
  return filas;
}

function snapshot(html) {
  // Categorías
  const categorias = [];
  const trozos = html.split(/<div class="category-container">/).slice(1);
  for (const trozo of trozos) {
    const cuerpo = trozo.split(/<section class="additional-links">/)[0];
    const h2 = cuerpo.match(/<h2>([\s\S]*?)<\/h2>/);
    if (!h2) throw new Error("Categoría sin <h2>");
    categorias.push({ titulo: texto(h2[1]), herramientas: extraerFilas(cuerpo) });
  }

  // Modales. Se trocea por cada apertura y se toma hasta la siguiente (o hasta el
  // final de la zona de modales): un regex no greedy cortaría antes de .modal-links,
  // cuyo </div> queda pegado al de .modal-content.
  const modales = [];
  const aperturas = [...html.matchAll(/<div id="(modal-[^"]+)" class="modal">/g)];
  aperturas.forEach((ap, i) => {
    const desde = ap.index + ap[0].length;
    const hasta = i + 1 < aperturas.length ? aperturas[i + 1].index : html.length;
    // El último modal llega hasta el final del archivo: se recorta en la sección
    // de recursos para no absorber su enlace ni el del footer.
    const cuerpo = html.slice(desde, hasta).split(/<section class="additional-links">/)[0];
    const id = ap[1];

    const h3 = cuerpo.match(/<h3>([\s\S]*?)<\/h3>/);
    const p = cuerpo.match(/<p>([\s\S]*?)<\/p>/);
    if (!h3 || !p) throw new Error(`Modal ${id} sin <h3> o sin <p>`);

    // Los enlaces ES comentados (<!-- <a …> -->) no cuentan: se quitan primero.
    const enlaces = [];
    const bloque = cuerpo.replace(/<!--[\s\S]*?-->/g, "").split(/<div class="modal-links">/)[1];
    if (bloque !== undefined) {
      const rxA = /<a\b([^>]*)>([\s\S]*?)<\/a\s*>/g;
      let a;
      while ((a = rxA.exec(bloque)) !== null) {
        enlaces.push(decodificar(atributo("<a" + a[1] + ">", "href")) + " | " + texto(a[2]));
      }
    }

    modales.push({ id, titulo: texto(h3[1]), desc: normalizarDesc(p[1]), enlaces });
  });
  modales.sort((a, b) => a.id.localeCompare(b.id));

  // Huérfanos: data-modal que no tiene su <div id="modal-…">
  const ids = new Set(modales.map((x) => x.id));
  const referidos = [...html.matchAll(/data-modal="([^"]+)"/g)].map((x) => x[1]);
  const huerfanos = referidos.filter((x) => !ids.has(x));

  const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map((x) => atributo(x[0], "src") || "");

  return {
    categorias,
    modales,
    huerfanos,
    totales: {
      filas: (html.match(/<div class="ai-button-row">/g) || []).length,
      modales: modales.length,
      hotlinks: imgs.filter((s) => /^https?:/.test(s)).length,
    },
  };
}

const archivo = process.argv[2] || "index.html";
console.log(JSON.stringify(snapshot(fs.readFileSync(archivo, "utf8")), null, 1));
