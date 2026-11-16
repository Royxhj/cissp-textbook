// 자동 생성 파일(_build/build.py). 직접 고치지 마세요.
const CACHE = 'cissp-a1e210d90876';
const FILES = ["./", "./manifest.webmanifest", "./assets/app.js", "./assets/icon-192.png", "./assets/icon-512.png", "./assets/icon-maskable-512.png", "./assets/search-index.js", "./assets/style.css", "./assets/units.js", "./units/D1.1.html", "./units/D1.10.html", "./units/D1.11.html", "./units/D1.12.html", "./units/D1.2.html", "./units/D1.3.html", "./units/D1.4.html", "./units/D1.5.html", "./units/D1.6.html", "./units/D1.7.html", "./units/D1.8.html", "./units/D1.9.html", "./units/D2.1.html", "./units/D2.2.html", "./units/D2.3.html", "./units/D2.4.html", "./units/D2.5.html", "./units/D2.6.html", "./units/D3.1.html", "./units/D3.10.html", "./units/D3.2.html", "./units/D3.3.html", "./units/D3.4.html", "./units/D3.5.html", "./units/D3.6.html", "./units/D3.7.html", "./units/D3.8.html", "./units/D3.9.html", "./units/D4.1.html", "./units/D4.2.html", "./units/D4.3.html", "./units/D5.1.html", "./units/D5.2.html", "./units/D5.3.html", "./units/D5.4.html", "./units/D5.5.html", "./units/D5.6.html", "./units/D6.1.html", "./units/D6.2.html", "./units/D6.3.html", "./units/D6.4.html", "./units/D6.5.html", "./units/D7.1.html", "./units/D7.10.html", "./units/D7.11.html", "./units/D7.12.html", "./units/D7.13.html", "./units/D7.14.html", "./units/D7.15.html", "./units/D7.2.html", "./units/D7.3.html", "./units/D7.4.html", "./units/D7.5.html", "./units/D7.6.html", "./units/D7.7.html", "./units/D7.8.html", "./units/D7.9.html", "./units/D8.1.html", "./units/D8.2.html", "./units/D8.3.html", "./units/D8.4.html", "./units/D8.5.html", "./index.html"];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('cissp-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.match(e.request, {ignoreSearch: true}).then(r => r || fetch(e.request)));
});
