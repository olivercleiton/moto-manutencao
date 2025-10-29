const CACHE_NAME = 'moto-manutencao-v2-' + new Date().getTime(); 
const urlsToCache = [
  '/',
  '/styles.css', 
  '/script.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Intercepta fetch
self.addEventListener('fetch', event => {
  // Se for requisição para API, deixa passar sem usar cache
  if (event.request.url.includes('/api/')) {
    return; // não faz cache de chamadas à API
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

// Limpar caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
