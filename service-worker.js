// Service worker Buku Kas Harian.
// Strategi: "network-first" untuk halaman utama (index.html/navigasi), supaya
// perubahan kode SELALU terlihat begitu online, dan baru jatuh ke cache kalau
// benar-benar offline. Aset statis (ikon, manifest) tetap cache-first karena
// jarang berubah. Data transaksi TIDAK disimpan di sini (ada di Firestore).
const CACHE_NAME = "kas-harian-cache-v2";
const CORE_ASSETS = ["./manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const isNavigation =
    event.request.mode === "navigate" ||
    event.request.destination === "document";

  if (isNavigation) {
    // Network-first: selalu coba ambil versi terbaru dulu.
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Aset lain: cache-first (cepat), fallback ke network.
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return res;
        })
        .catch(() => cached);
    })
  );
});
