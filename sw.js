// 安装时立即激活
self.addEventListener('install', event => {
  self.skipWaiting();
});

// 激活
self.addEventListener('activate', event => {
  console.log('Service Worker 激活成功');
});

// 拦截请求（这里先不做缓存也可以）
self.addEventListener('fetch', event => {
  // 什么都不做也可以正常触发 PWA 安装
});