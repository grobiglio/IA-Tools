#!/usr/bin/env node
/**
 * extraer.js — migración ONE-SHOT de index.html a herramientas.json.
 *
 * Se ejecuta una sola vez y se borra. Transcribir 26 descripciones a mano es
 * justo donde nacen las erratas silenciosas, así que las lee el programa.
 *
 * Uso:  node tools/extraer.js > herramientas.json
 */

const fs = require("fs");

const CATEGORIAS = [
  ["chatbots", "Chatbots"],
  ["investigacion", "Investigación"],
  ["agentes", "Agentes"],
  ["productividad", "Productividad"],
  ["automatizacion", "Automatización"],
  ["vibecoding", "Vibe Coding"],
  ["videoimagen", "Video e Imagen"],
];

// Backlog: los comentarios HTML vacíos del index actual, preservados como datos.
const PENDIENTES = {
  automatizacion: [{ id: "opal", nombre: "OPAL", url: "https://opal.withgoogle.com/" }],
  vibecoding: [
    { id: "cursor", nombre: "Cursor", url: "https://cursor.com/" },
    { id: "claudecode", nombre: "Claude Code", url: "https://claude.com/product/claude-code" },
    { id: "codex", nombre: "Codex", url: "https://openai.com/codex/" },
  ],
  videoimagen: [
    { id: "midjourney", nombre: "Midjourney", url: "https://www.midjourney.com/" },
    { id: "flux", nombre: "Flux", url: "https://blackforestlabs.ai/" },
    { id: "ideogram", nombre: "Ideogram", url: "https://ideogram.ai/" },
    { id: "luma", nombre: "Luma", url: "https://lumalabs.ai/" },
    { id: "kling", nombre: "Kling", url: "https://klingai.com/" },
  ],
};

const decodificar = (s) =>
  String(s).replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");

const texto = (html) =>
  decodificar(String(html).replace(/<[^>]*>/g, "").replace(/\s+/g, " ")).trim();

const atributo = (etiqueta, nombre) => {
  const m = etiqueta.match(new RegExp(`\\b${nombre}\\s*=\\s*"([^"]*)"`));
  return m ? m[1] : null;
};

/**
 * Normaliza el cuerpo de un <p> de modal a una sola línea.
 * Los <br> explícitos sobreviven; los saltos de línea de sangría se colapsan.
 */
function normalizarDescripcion(crudo) {
  return crudo
    .split("\n")
    .map((l) => l.trim())
    .join(" ")
    .replace(/\s+/g, " ")
    .replace(/\s*<br\s*\/?>\s*/g, "<br>")
    .trim();
}

// --- lectura ----------------------------------------------------------------

const html = fs.readFileSync("index.html", "utf8");

// Filas de la grilla, por categoría
const filasPorCategoria = [];
for (const trozo of html.split(/<div class="category-container">/).slice(1)) {
  const cuerpo = trozo.split(/<section class="additional-links">/)[0];
  const titulo = texto(cuerpo.match(/<h2>([\s\S]*?)<\/h2>/)[1]);

  const filas = [];
  const rx = /<div class="ai-button-row">([\s\S]*?)<\/div>/g;
  let m;
  while ((m = rx.exec(cuerpo)) !== null) {
    const fila = m[1];
    // El href puede ir en la misma línea que <a o en la siguiente.
    const aBoton = fila.match(/<a\b[\s\S]*?class="ai-button"[\s\S]*?<\/a\s*>/)[0];
    const apertura = aBoton.match(/<a\b[^>]*>/)[0];
    const interior = aBoton.replace(/^<a\b[^>]*>/, "").replace(/<\/a\s*>$/, "");
    const img = fila.match(/<img\b[^>]*>/)[0];
    const yt = fila.match(/<a\b[^>]*class="youtube-button[^"]*"[^>]*>/)[0];

    filas.push({
      // El mismo trim() que hace el tracker de GA4: el valor queda garantizado
      // por construcción, no por transcripción.
      nombre: texto(interior),
      url: decodificar(atributo(apertura, "href")),
      logo: atributo(img, "src"),
      alt: decodificar(atributo(img, "alt") || ""),
      id: atributo(fila.match(/<button\b[^>]*class="info-button"[^>]*>/)[0], "data-modal").replace(/^modal-/, ""),
      tutorial: /\bsin-enlace\b/.test(yt) ? null : decodificar(atributo(yt, "href")),
    });
  }
  filasPorCategoria.push({ titulo, filas });
}

// Modales
const modales = new Map();
const aperturas = [...html.matchAll(/<div id="modal-([^"]+)" class="modal">/g)];
aperturas.forEach((ap, i) => {
  const desde = ap.index + ap[0].length;
  const hasta = i + 1 < aperturas.length ? aperturas[i + 1].index : html.length;
  const cuerpo = html.slice(desde, hasta).split(/<section class="additional-links">/)[0];

  const crudoP = cuerpo.match(/<p>([\s\S]*?)<\/p>/)[1];
  // Los comentarios dentro del <p> (el párrafo extra de Antigravity) pasan a "nota".
  const comentarios = [...crudoP.matchAll(/<!--([\s\S]*?)-->/g)].map((c) => normalizarDescripcion(c[1]));

  const enlaces = {};
  const sinComentarios = cuerpo.replace(/<!--[\s\S]*?-->/g, "");
  const bloque = sinComentarios.split(/<div class="modal-links">/)[1];
  if (bloque !== undefined) {
    const rxA = /<a\b([^>]*)>([\s\S]*?)<\/a\s*>/g;
    let a;
    while ((a = rxA.exec(bloque)) !== null) {
      const href = decodificar(atributo("<a" + a[1] + ">", "href"));
      const etiqueta = texto(a[2]);
      if (/\(EN\)/i.test(etiqueta)) enlaces.en = href;
      else if (/\(ES\)/i.test(etiqueta)) enlaces.es = href;
      else throw new Error(`Etiqueta de enlace inesperada en modal-${ap[1]}: "${etiqueta}"`);
    }
  }

  modales.set(ap[1], {
    titulo: texto(cuerpo.match(/<h3>([\s\S]*?)<\/h3>/)[1]),
    descripcionHtml: normalizarDescripcion(crudoP.replace(/<!--[\s\S]*?-->/g, "")),
    enlaces,
    nota: comentarios.length ? comentarios.join(" ") : undefined,
  });
});

// --- fusión -----------------------------------------------------------------

const categorias = filasPorCategoria.map(({ titulo, filas }, i) => {
  const [id, tituloEsperado] = CATEGORIAS[i];
  if (titulo !== tituloEsperado) throw new Error(`Categoría ${i}: "${titulo}" ≠ "${tituloEsperado}"`);

  const herramientas = filas.map((f) => {
    const modal = modales.get(f.id);
    if (!modal) throw new Error(`La fila "${f.nombre}" apunta a modal-${f.id}, que no existe`);

    const h = { id: f.id, nombre: f.nombre, url: f.url, logo: f.logo };
    if (f.alt !== `${f.nombre} Logo`) h.alt = f.alt;
    if (modal.titulo !== f.nombre) h.modalTitulo = modal.titulo;
    h.descripcionHtml = modal.descripcionHtml;
    if (Object.keys(modal.enlaces).length) h.enlaces = modal.enlaces;
    h.tutorial = f.tutorial;
    if (modal.nota) h.nota = modal.nota;
    return h;
  });

  for (const p of PENDIENTES[id] || []) herramientas.push({ ...p, pendiente: true });
  return { id, titulo, herramientas };
});

// --- aserciones -------------------------------------------------------------

const activas = categorias.flatMap((c) => c.herramientas.filter((h) => !h.pendiente));
const todas = categorias.flatMap((c) => c.herramientas);
const fallos = [];

if (categorias.length !== 7) fallos.push(`categorías: ${categorias.length} ≠ 7`);
if (activas.length !== 26) fallos.push(`activas: ${activas.length} ≠ 26`);
if (modales.size !== 26) fallos.push(`modales: ${modales.size} ≠ 26`);
if (new Set(todas.map((h) => h.id)).size !== todas.length) fallos.push("ids repetidos");
if (new Set(activas.map((h) => h.nombre)).size !== 26) fallos.push("nombres repetidos");

const conTutorial = activas.filter((h) => h.tutorial).length;
if (conTutorial !== 13) fallos.push(`con tutorial: ${conTutorial} ≠ 13`);

const conEnlaces = activas.filter((h) => h.enlaces).length;
if (conEnlaces !== 12) fallos.push(`con enlaces: ${conEnlaces} ≠ 12`);

for (const h of activas) {
  if (!h.descripcionHtml || h.descripcionHtml.length < 40) fallos.push(`descripción corta: ${h.id}`);
  if (h.nombre !== h.nombre.trim() || /\s{2,}/.test(h.nombre)) fallos.push(`nombre con espacios: "${h.nombre}"`);
  if (!/^[a-z0-9]+$/.test(h.id)) fallos.push(`id inválido: ${h.id}`);
}

if (fallos.length) {
  console.error("✗ Extracción abortada:\n  " + fallos.join("\n  "));
  process.exit(1);
}

console.error(`✓ ${activas.length} herramientas activas + ${todas.length - activas.length} pendientes`);

console.log(
  JSON.stringify(
    {
      _comentario: "Fuente de verdad de la grilla y los modales. Editar aquí y ejecutar: node build.js",
      etiquetasEnlaces: { en: "More info (EN)", es: "Más info (ES)" },
      categorias,
    },
    null,
    2
  )
);
