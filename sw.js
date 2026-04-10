self.addEventListener('install', e=>{
    self.skipWaiting();
});

self.addEventListener('activate', e=>{
    console.log("SW ready");
});

self.addEventListener('fetch', e=>{});