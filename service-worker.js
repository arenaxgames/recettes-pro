const CACHE = 'recettes-pro-v2';
const FILES = ['/recettes-pro/', '/recettes-pro/index.html', '/recettes-pro/manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.url.includes('supabase.co')) return e.respondWith(fetch(e.request));
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
