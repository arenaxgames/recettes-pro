const CACHE = 'recettes-pro-v1';
const FILES = [
  '/recettes-pro/',
  '/recettes-pro/index.html',
  '/recettes-pro/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Pour les requêtes Supabase, toujours aller sur le réseau
  if (e.request.url.includes('supabase.co')) {
    return e.respondWith(fetch(e.request));
  }
  // Pour le reste : cache en priorité, réseau en fallback
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
