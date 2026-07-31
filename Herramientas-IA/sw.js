// sw.js — Service Worker de Herramientas IA
//
// Las regiones entre marcadores las genera build.js desde herramientas.json.
// NO EDITAR A MANO: se pisan en el próximo build.
//
// CACHE_NAME lleva un hash del contenido, así que cualquier cambio en los datos
// o en el código produce un caché nuevo y el activate borra el anterior. La
// invalidación deja de ser un paso manual que se olvida.

// BEGIN:CACHE
const CACHE_NAME = "herramientas-ia-b0388ebb";
// END:CACHE

// BEGIN:ASSETS
const ASSETS = [
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
  "./logo_gemini.png",
  "./logo_chatgpt.png",
  "./logo_microsoft_copilot.png",
  "./logo_claude.png",
  "./logo_grok.png",
  "./logo_deepseek.png",
  "./logo_qwen.png",
  "./logo_mistral.png",
  "./logo_kimi.png",
  "./logo_chat_z.png",
  "./logo_perplexity.png",
  "./logo_consensus.png",
  "./logo_atlas_research.png",
  "./logo_minimax.png",
  "./logo_genspark.png",
  "./logo_manus.png",
  "./logo_notebooklm.png",
  "./logo_notion.png",
  "./logo_make.png",
  "./logo_n8n.png",
  "./logo_firebase_studio.png",
  "./logo_ia_studio.png",
  "./logo_lovable.png",
  "./logo_replit.png",
  "./logo_antigravity.png",
  "./logo_runway.png",
];
// END:ASSETS

self.addEventListener("install", (event) => {
  // Ojo: cache.addAll es atómico, un solo 404 deja el service worker muerto.
  // Por eso build.js verifica que cada asset exista antes de escribir la lista.
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((claves) => Promise.all(claves.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  // El CDN de Bootstrap, gtag y YouTube se dejan pasar sin tocar: cachear
  // respuestas opacas no aporta nada y puede interferir con el tracking.
  if (new URL(req.url).origin !== self.location.origin) return;

  const esHTML = req.mode === "navigate" || (req.headers.get("accept") || "").includes("text/html");

  if (esHTML) {
    // Red primero: una herramienta nueva tiene que verse en la siguiente carga,
    // no cuando cambie el service worker. Sin red, cae al caché.
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copia = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copia));
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match("./index.html")))
    );
    return;
  }

  // Estáticos: caché primero. El hash de CACHE_NAME los invalida en cada deploy.
  event.respondWith(
    caches.match(req).then(
      (res) =>
        res ||
        fetch(req).then((neta) => {
          if (neta && neta.ok && neta.type === "basic") {
            const copia = neta.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, copia));
          }
          return neta;
        })
    )
  );
});
