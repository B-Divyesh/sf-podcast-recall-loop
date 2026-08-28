const CACHE = 'recall-loop-shell-__BUILD_ID__';
const SHELL = __PRECACHE_MANIFEST__;

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(SHELL);
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(response => {
      const copy = response.clone();
      if (response.ok) caches.open(CACHE).then(cache => cache.put('/index.html', copy));
      return response;
    }).catch(async () => (await caches.match('/index.html')) || (await caches.match('/offline.html'))));
    return;
  }
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(url.pathname, { ignoreSearch: true });
    if (cached) return cached;
    const response = await fetch(request);
    if (response.ok) await cache.put(url.pathname, response.clone());
    return response;
  })());
});
