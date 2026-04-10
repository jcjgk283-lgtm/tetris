const CACHE_NAME = "game-cache-v1";

self.addEventListener("install", function(e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll([
                "./",
                "./index.html",
                "./manifest.json",
                "./icon.png"
            ]);
        })
    );
});

self.addEventListener("fetch", function(e) {
    e.respondWith(
        caches.match(e.request).then(function(response) {
            return response || fetch(e.request);
        })
    );
});