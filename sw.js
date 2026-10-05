// Service Worker — GPS Camping-Car
// Deux stratégies :
//  - coquille de l'appli (index + libs) : "network-first" puis cache (toujours à jour si en ligne)
//  - tuiles, polices et pictogrammes de carte : "cache-first" (les zones déjà consultées restent dispo hors-ligne)

const SHELL_CACHE = 'cc-shell-v10';
const TILE_CACHE  = 'cc-tiles-v10';

const SHELL_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png',
  './apple-touch-icon.png',
  'https://unpkg.com/maplibre-gl@5.24.0/dist/maplibre-gl.css',
  'https://unpkg.com/maplibre-gl@5.24.0/dist/maplibre-gl.js',
  'https://unpkg.com/@protomaps/basemaps@5/dist/basemaps.js'
];

// Hôtes dont on met les ressources de carte en cache pour l'usage hors-ligne :
// tuiles vectorielles Protomaps, polices et pictogrammes du style Protomaps
// (sans eux, les noms de rues disparaissent hors réseau), et tuiles OpenStreetMap
// du fond de secours.
const TILE_HOSTS = ['api.protomaps.com', 'protomaps.github.io', 'tile.openstreetmap.org'];

// Services en ligne : jamais interceptés, jamais mis en cache.
// (api.tomtom.com contient la clé d'API dans l'URL : elle ne doit rien laisser sur le disque.)
const DYNAMIC = [
  'nominatim.openstreetmap.org',
  'router.project-osrm.org',
  'api.openrouteservice.org',
  'overpass-api.de',
  'overpass.kumi.systems',
  'overpass.private.coffee',
  'api.tomtom.com'
];

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

// Ne met en cache que ce qui vaut la peine de l'être : réponse complète, statut 200,
// même origine ou CORS explicite. Les 404 et les réponses opaques sont ignorés.
function cacheable(res) {
  return res && res.status === 200 && (res.type === 'basic' || res.type === 'cors');
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch (err) { return; }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  // Tuiles de carte : cache-first (limité pour ne pas saturer le stockage)
  if (TILE_HOSTS.some((h) => url.hostname.endsWith(h))) {
    e.respondWith(
      caches.open(TILE_CACHE).then(async (cache) => {
        const hit = await cache.match(req);
        if (hit) return hit;
        try {
          const res = await fetch(req);
          if (cacheable(res)) {
            await cache.put(req, res.clone());
            trimCache(TILE_CACHE, 2000); // garde ~2000 ressources récentes
          }
          return res;
        } catch (err) {
          return Response.error();
        }
      })
    );
    return;
  }

  // Itinéraire, recherche, POI, trafic : réseau direct, sans interception
  if (DYNAMIC.some((h) => url.hostname.endsWith(h))) return;

  // Coquille de l'appli : network-first, repli sur le cache
  e.respondWith(
    fetch(req)
      .then((res) => {
        if (cacheable(res)) {
          const copy = res.clone();
          caches.open(SHELL_CACHE).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      })
      .catch(async () => {
        const hit = await caches.match(req);
        if (hit) return hit;
        // Le repli sur la page ne vaut que pour une navigation : renvoyer du HTML
        // à la place d'une icône ou d'un script ne ferait qu'ajouter une erreur.
        if (req.mode === 'navigate') {
          const shell = await caches.match('./index.html');
          if (shell) return shell;
        }
        return Response.error();
      })
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
