# GPS Camping-Car — PWA de navigation adaptée au gabarit

Application web mobile-first pour camping-car : itinéraire tenant compte du gabarit
(hauteur / largeur / longueur / poids), alertes de restriction, aires et services,
guidage vocal en français, trafic en direct TomTom.

**Démo après publication :** `https://TON-USERNAME.github.io/gps-camping-car/`

## Fonctionnalités
- Routage en cascade : TomTom (trafic + gabarit), Openrouteservice (gabarit), OSRM (dernier recours)
- Overpass interrogé en cascade décalée sur 3 miroirs (hedge 1200 ms) pour éviter les 429
- Carte vectorielle Protomaps + Leaflet 1.9.4, rotation de la carte en navigation
- Repli automatique sur les tuiles matricielles OSM quand aucune clé Protomaps n'est saisie
- Navigation vocale FR, paliers 500/200 m (1000/300 m pour les sorties), détection hors-itinéraire
- Surveillance du trafic toutes les 3 min, alternative proposée si plus de 10 min gagnées
- WakeLock, vitesse issue de `coords.speed`, cap lissé, zoom automatique selon la vitesse
- PWA hors ligne : Service Worker stale-while-revalidate, cache de tuiles plafonné à 1500 entrées

## Structure
```
index.html            (nom en minuscules : GitHub Pages est sensible à la casse)
sw.js
manifest.webmanifest
icon-192.png
icon-512.png
icon-512-maskable.png
apple-touch-icon.png
```

## Installation
1. Saisir les clés dans Paramètres › Options :
   - Protomaps (fond de carte, gratuit) : https://protomaps.com
   - TomTom (trafic + gabarit) : https://developer.tomtom.com
   - Openrouteservice (gabarit, repli) : https://openrouteservice.org
2. Les clés sont stockées en `localStorage`. Restreignez-les par domaine dans chaque
   tableau de bord : elles sont lisibles par quiconque ouvre l'application.

## Déploiement GitHub Pages
HTTPS obligatoire (géolocalisation, WakeLock, Service Worker).
Après chaque mise à jour de `sw.js`, incrémenter `VERSION` pour forcer le renouvellement des caches.

## Sécurité — état réel
- Content-Security-Policy déclarée en `<meta>` : sources d'API et de tuiles listées explicitement.
- `integrity` (SRI) présent sur Leaflet (CSS + JS). **Absent sur protomaps-leaflet** :
  l'URL est épinglée sur la majeure `@4`, qui continue de bouger. Pour ajouter un SRI,
  figer une version exacte (`@4.x.y`) et calculer son hash :
  `curl -s https://unpkg.com/protomaps-leaflet@4.x.y/dist/protomaps-leaflet.js | openssl dgst -sha384 -binary | openssl base64 -A`
  puis reporter la valeur dans `index.html` **et** dans `CDN_ASSETS` de `sw.js`.
- Aucune donnée tierce (noms OSM, URL de sites) n'est injectée sans échappement.
- Les quatre icônes PWA sont fournies (voir `ICONS.md`) ; `icons.py` permet de les
  régénérer si vous changez de couleur ou de symbole.

## Avertissement
Les alertes de gabarit reposent sur OpenStreetMap. Les données sont incomplètes et
parfois erronées : elles ne remplacent jamais les panneaux routiers.

## Licence
MIT — usage personnel. Vérifier les conditions TomTom / ORS / Protomaps pour un usage commercial.
