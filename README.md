# GPS Camping-Car - PWA Navigation Gabarit

Application web GPS mobile-first pour camping-car : itinéraire adapté au gabarit (hauteur/largeur/longueur), alertes de hauteur, aires et services, guidage vocal, trafic en direct TomTom.

**Démo live après publication :** `https://TON-USERNAME.github.io/gps-camping-car/`

## Fonctionnalités
- Routing 3 moteurs : TomTom (trafic), OpenRouteService (gabarit), OSRM (fallback)
- Overpass API en cascade décalée (3 miroirs, hedge 1200ms) pour éviter les 429
- Carte vectorielle Protomaps + Leaflet 1.9.4 avec rotation de carte en navigation
- Navigation vocale FR, paliers 500/200m, détection hors-itinéraire
- Surveillance trafic toutes les 3min, proposition d'alternative si >10min gagnées
- WakeLock (écran allumé), vitesse native `coords.speed`, cap lissé, batterie optimisée
- PWA offline : Service Worker stale-while-revalidate + cache LRU 1500 tuiles

## Structure
```
index.html
sw.js
manifest.webmanifest
icon-192.png
icon-512.png
icon-512-maskable.png
apple-touch-icon.png
```

## Installation
1. Ajoute tes clés API dans l'onglet Paramètres > Options de l'app :
   - Protomaps (gratuit) : https://protomaps.com
   - TomTom (trafic) : https://developer.tomtom.com
   - OpenRouteService (gabarit) : https://openrouteservice.org
2. Les clés sont stockées en localStorage (restreins-les par domaine dans les dashboards).

## Déploiement GitHub Pages
Voir les instructions dans ce chat. HTTPS obligatoire pour GPS + PWA.

## Sécurité
- SRI sur Leaflet CDN
- CSP restrictive
- Pas d'innerHTML sur données utilisateur

## Licence
MIT - Utilisation perso. Vérifie les conditions TomTom/ORS pour usage commercial.
