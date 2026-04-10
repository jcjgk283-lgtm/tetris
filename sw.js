const CACHE_NAME = "tetris-cache-v1";
const urlsToCache = [
  "./",
  "./index.html"
];

// 安装
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// 请求拦截（离线用）
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});