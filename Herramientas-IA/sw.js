// sw.js - Service Worker Básico
const CACHE_NAME = 'herramientas-ia-v3';
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './scripts.js',
  './manifest.json'
];

self.addEventListener('install', event => {
  // Instalación: intentamos guardar en caché los archivos críticos
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Archivos en caché');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  // Estrategia básica: Cache primero, luego red (o solo red si prefieres)
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});