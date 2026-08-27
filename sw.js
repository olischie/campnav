// Service Worker v11 — GPS Camping-Car
// Stratégies modernes, cache borné, offline-safe, sans dépendance.

const VERSION = 'cc-v11';
const SHELL_CACHE = `${VERSION}-shell`;
const TILE_CACHE = `${VERSION}-tiles`;
const MAX_TILES = 1500;
const MAX_AGE_DAYS = 14;

const SHELL_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png',
  './apple-touch-icon.png'
];

// Bibliothèques CDN. L'URL protomaps doit être EXACTEMENT celle de index.html,
// sinon la version mise en cache n'est jamais celle que la page demande.
const CDN_ASSETS = [
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js',
  'https://unpkg.com/protomaps-leaflet@4/dist/protomaps-leaflet.js'
];

// Tuiles de fond : vectorielles Protomaps, et matricielles OSM quand aucune clé
// n'est renseignée. Sans cette seconde entrée, les tuiles OSM tombaient dans la
// stratégie « shell » et remplissaient sans limite le cache de l'application.
const TILE_HOSTS = ['api.protomaps.com', 'tile.openstreetmap.org'];

const DYNAMIC_HOSTS = [
  'nominatim.openstreetmap.org',
  'router.project-osrm.org',
  'api.openrouteservice.org',
  'overpass-api.de',
  'overpass.kumi.systems',
  'overpass.private.coffee',
  'api.tomtom.com'
];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const shell = await caches.open(SHELL_CACHE);
    await Promise.allSettled([
      ...SHELL_ASSETS.map(u => shell.add(u).catch(()=>{})),
      ...CDN_ASSETS.map(u => shell.add(new Request(u, {mode:'no-cors'})).catch(()=>{}))
    ]);
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => !k.startsWith(VERSION)).map(k => caches.delete(k)));
    await self.clients.claim();
    await trimCacheByAge(TILE_CACHE, MAX_AGE_DAYS);
  })());
});

// Une réponse « opaque » (mode no-cors) porte le statut 0 : stockable telle
// quelle, mais ni lisible ni reconstructible. D'où ce test avant toute copie.
function isCacheable(res){
  return !!res && res.ok && (res.type === 'basic' || res.type === 'cors');
}

function hostMatches(hostname, base){
  return hostname === base || hostname.endsWith('.' + base);
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  let url;
  try { url = new URL(req.url); } catch { return; }
  if (!['http:','https:'].includes(url.protocol)) return;

  // 1. Tuiles : Stale-While-Revalidate + plafond du nombre d'entrées
  if (TILE_HOSTS.some(h => hostMatches(url.hostname, h))){
    e.respondWith(staleWhileRevalidate(req, TILE_CACHE, MAX_TILES));
    return;
  }

  // 2. APIs dynamiques : jamais de cache
  if (DYNAMIC_HOSTS.some(h => hostMatches(url.hostname, h))){
    return; // laisse passer le réseau
  }

  // 3. Shell + bibliothèques : Network-First avec repli hors ligne
  e.respondWith(networkFirst(req, SHELL_CACHE));
});

async function staleWhileRevalidate(req, cacheName, maxEntries){
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  const fetchPromise = fetch(req).then(async res => {
    if (isCacheable(res)){
      try {
        // Horodatage pour la purge par ancienneté. `statusText` était perdu au
        // passage, et un statut 0 (réponse opaque) ferait échouer new Response().
        const clone = res.clone();
        const headers = new Headers(clone.headers);
        headers.set('x-cached-at', Date.now().toString());
        const withMeta = new Response(await clone.blob(), {
          status: clone.status,
          statusText: clone.statusText,
          headers
        });
        await cache.put(req, withMeta);
        trimCache(cacheName, maxEntries);
      } catch { /* mise en cache impossible : la réponse réseau reste valable */ }
    }
    return res;
  }).catch(() => cached || Response.error());

  return cached || fetchPromise;
}

async function networkFirst(req, cacheName){
  try {
    const res = await fetch(req);
    if (isCacheable(res)){
      const cache = await caches.open(cacheName);
      cache.put(req, res.clone()).catch(()=>{});
    }
    return res;
  } catch {
    const cached = await caches.match(req);
    if (cached) return cached;
    if (req.mode === 'navigate'){
      // './' et './index.html' ne sont pas la même entrée de cache : on essaie
      // les deux, sinon une navigation hors ligne finissait sur une page 503.
      const shell = (await caches.match('./index.html')) || (await caches.match('./'));
      if (shell) return shell;
    }
    return new Response('Hors ligne', {status: 503, statusText: 'Offline'});
  }
}

// Purge par ordre d'insertion : `cache.keys()` restitue cet ordre, et un `put`
// sur une clé existante ne la déplace pas — les plus anciennes partent d'abord.
async function trimCache(name, max){
  const cache = await caches.open(name);
  const keys = await cache.keys();
  const excess = keys.length - max;
  if (excess <= 0) return;
  for (let i = 0; i < excess; i++) await cache.delete(keys[i]);
}

async function trimCacheByAge(name, maxDays){
  const cache = await caches.open(name);
  const keys = await cache.keys();
  const now = Date.now();
  const maxAge = maxDays * 24 * 3600 * 1000;
  for (const req of keys){
    const res = await cache.match(req);
    const cachedAt = res && res.headers.get('x-cached-at');
    const t = cachedAt ? parseInt(cachedAt, 10) : NaN;
    if (!isNaN(t) && now - t > maxAge) await cache.delete(req);
  }
}
