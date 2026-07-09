// Service Worker — GPS Camping-Car
// Deux stratégies :
//  - coquille de l'appli (index + libs) : "network-first" puis cache (toujours à jour si en ligne)
//  - tuiles de carte : "cache-first" (les zones déjà consultées restent dispo hors-ligne)

const SHELL_CACHE = 'cc-shell-v1';
const TILE_CACHE  = 'cc-tiles-v1';

const SHELL_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js'
];

// Hôtes dont on met les tuiles en cache pour l'usage hors-ligne
const TILE_HOSTS = ['basemaps.cartocdn.com'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(SHELL_CACHE)
      .then((c) => Promise.allSettled(SHELL_ASSETS.map((u) => c.add(u))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((k) => k !== SHELL_CACHE && k !== TILE_CACHE).map((k) => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Tuiles de carte : cache-first (limité pour ne pas saturer le stockage)
  if (TILE_HOSTS.some((h) => url.hostname.endsWith(h))) {
    e.respondWith(
      caches.open(TILE_CACHE).then(async (cache) => {
        const hit = await cache.match(req);
        if (hit) return hit;
        try {
          const res = await fetch(req);
          if (res && res.status === 200) {
            cache.put(req, res.clone());
            trimCache(TILE_CACHE, 1200); // garde ~1200 tuiles récentes
          }
          return res;
        } catch (err) {
          return hit || Response.error();
        }
      })
    );
    return;
  }

  // Ne pas intercepter les API dynamiques (itinéraire, recherche, POI, trafic)
  const DYNAMIC = ['nominatim.openstreetmap.org','router.project-osrm.org','overpass-api.de','api.tomtom.com'];
  if (DYNAMIC.some((h) => url.hostname.endsWith(h))) return; // passe directement au réseau

  // Coquille de l'appli : network-first, repli sur le cache
  e.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(SHELL_CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(req).then((hit) => hit || caches.match('./index.html')))
  );
});

// Limite le nombre d'entrées d'un cache (FIFO simple)
async function trimCache(name, max) {
  const cache = await caches.open(name);
  const keys = await cache.keys();
  if (keys.length > max) {
    for (let i = 0; i < keys.length - max; i++) await cache.delete(keys[i]);
  }
}
