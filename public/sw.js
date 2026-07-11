// Minimal offline-support service worker for Loci.
// Strategy: cache the app shell + static assets; network-first for
// navigations and API calls with a cache fallback so the app still opens
// (with slightly stale data) when offline.

const CACHE_NAME = "loci-v1";
const SHELL_ASSETS = ["/", "/manifest.json", "/icons/icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isNextStatic = isSameOrigin && url.pathname.startsWith("/_next/static");

  // Static build assets: cache-first (immutable, hashed filenames)
  if (isNextStatic) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(req);
        if (cached) return cached;
        const res = await fetch(req);
        cache.put(req, res.clone());
        return res;
      })
    );
    return;
  }

  // Everything else (pages, API routes, third-party APIs): network-first,
  // falling back to cache when offline.
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (isSameOrigin && res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
        }
        return res;
      })
      .catch(() => caches.match(req).then((cached) => cached || caches.match("/")))
  );
});
