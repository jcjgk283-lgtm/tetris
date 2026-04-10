const CACHE_NAME = "tetris-v1";

self.addEventListener("install", e=>{
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache=>{
      return cache.addAll([
        "./",
        "./index.html",
        "./game.js",
        "./manifest.json",
        "./bgm.mp3",
        "./icon.png"
      ]);
    })
  );
});

self.addEventListener("fetch", e=>{
  e.respondWith(
    caches.match(e.request).then(res=>{
      return res || fetch(e.request);
    })
  );
});