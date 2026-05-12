// English Stars Service Worker - Offline-Cache
const VERSION = 'v3.14';
const CACHE = 'english-stars-' + VERSION;

// Diese Dateien werden bei der Installation gecacht
const PRECACHE = [
  './',
  './english_stars_v2.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './favicon.png',
  // Tesseract.js wird über CDN geladen - der erste Online-Aufruf cached das automatisch
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE).catch(()=>{}))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);

  // Network-first für die HTML (damit Updates ankommen) mit Cache-Fallback
  if (url.pathname.endsWith('.html') || url.pathname.endsWith('/')) {
    e.respondWith(
      fetch(e.request).then(r => {
        const clone = r.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone)).catch(()=>{});
        return r;
      }).catch(() => caches.match(e.request).then(r => r || caches.match('./english_stars_v2.html')))
    );
    return;
  }

  // Cache-first für alles andere (Icons, MP3s, Tesseract-CDN)
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(r => {
        // Nur erfolgreiche Responses cachen
        if (r.ok && r.status === 200) {
          const clone = r.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone)).catch(()=>{});
        }
        return r;
      }).catch(() => caches.match(e.request));
    })
  );
});
