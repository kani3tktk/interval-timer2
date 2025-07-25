const CACHE_NAME = 'interval-timer-v2';
const urlsToCache = [
  './',
  './index.html',
  './PPPP.mp3',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './offline.html' // ← 事前に offline.html を用意しておく
];

// キャッシュ登録
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// 古いキャッシュの削除
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
});

// fetch イベント処理（キャッシュ優先、オフライン時フォールバック）
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request).then(res => res || caches.match('./offline.html'))
    )
  );
});

// バックグラウンド同期（例：sync-form タグ）
self.addEventListener('sync', event => {
  if (event.tag === 'sync-form') {
    event.waitUntil(
      // デモ処理：実際にはIndexedDBから取り出して送信など
      fetch('/submit', {
        method: 'POST',
        body: JSON.stringify({ offlineData: true }),
        headers: { 'Content-Type': 'application/json' }
      })
    );
  }
});

