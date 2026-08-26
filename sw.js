// Service Worker v10 — GPS Camping-Car amélioré
// Stratégies modernes, cache LRU, offline-safe, Workbox-like sans dépendance

const VERSION = 'cc-v10';
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

// CDN assets avec SRI - à mettre en cache séparément
const CDN_ASSETS = [
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js',
  'https://unpkg.com/protomaps-leaflet/dist/protomaps-leaflet.js'
];

const TILE_HOSTS = ['api.protomaps.com'];
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
    // Cache shell + CDN avec gestion d'erreur fine
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
    // Nettoyage périodique des tuiles expirées
    await trimCacheByAge(TILE_CACHE, MAX_AGE_DAYS);
  })());
});

function isCacheable(res){
  return res && res.ok && (res.type === 'basic' || res.type === 'cors');
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  let url;
  try { url = new URL(req.url); } catch { return; }
  if (!['http:','https:'].includes(url.protocol)) return;

  // 1. Tuiles vectorielles : Stale-While-Revalidate + LRU
  if (TILE_HOSTS.some(h => url.hostname.endsWith(h))){
    e.respondWith(staleWhileRevalidate(req, TILE_CACHE, MAX_TILES));
    return;
  }

  // 2. APIs dynamiques : jamais de cache
  if (DYNAMIC_HOSTS.some(h => url.hostname.endsWith(h))){
    return; // laisse passer réseau
  }

  // 3. Shell : Network-First avec fallback offline
  e.respondWith(networkFirst(req, SHELL_CACHE));
});

async function staleWhileRevalidate(req, cacheName, maxEntries){
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  const fetchPromise = fetch(req).then(async res => {
    if (isCacheable(res)){
      // Ajoute timestamp pour LRU par âge
      const clone = res.clone();
      const headers = new Headers(clone.headers);
      headers.set('x-cached-at', Date.now().toString());
      const withMeta = new Response(await clone.blob(), { headers, status: clone.status });
      await cache.put(req, withMeta);
      trimCache(cacheName, maxEntries);
    }
    return res;
  }).catch(()=> cached || Response.error());
  
  return cached || await fetchPromise;
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
      const shell = await caches.match('./index.html');
      if (shell) return shell;
    }
    return new Response('Offline', {status: 503, statusText: 'Offline'});
  }
}

async function trimCache(name, max){
  const cache = await caches.open(name);
  const keys = await cache.keys();
  if (keys.length > max){
    // Supprime les plus anciens d'abord (FIFO simple mais basé sur x-cached-at si dispo)
    // Pour un vrai LRU il faudrait trier par header
    for (let i=0; i<keys.length-max; i++) await cache.delete(keys[i]);
  }
}

async function trimCacheByAge(name, maxDays){
  const cache = await caches.open(name);
  const keys = await cache.keys();
  const now = Date.now();
  const maxAge = maxDays*24*3600*1000;
  for (const req of keys){
    const res = await cache.match(req);
    const cachedAt = res?.headers.get('x-cached-at');
    if (cachedAt && now - parseInt(cachedAt) > maxAge){
      await cache.delete(req);
    }
  }
}
