# 🚐 GPS Camping-Car

Application web de navigation pensée pour les camping-cars, **optimisée mobile**, à ouvrir dans un simple navigateur. Aucune installation, aucun serveur à gérer : une page (`index.html`), un manifeste et un service worker.

## ✨ Fonctionnalités

- **Carte interactive** plein écran (Leaflet + fonds CARTO), mode **jour / nuit**.
- **Recherche d'adresses et de lieux** (Nominatim / OpenStreetMap).
- **Itinéraire** point à point avec distance et durée estimées, alternatives sélectionnables.
- **Profil du véhicule** (hauteur, poids, largeur, longueur) utilisé de deux façons :
  - avec une **clé TomTom** ou **Openrouteservice**, l'itinéraire est **calculé pour votre gabarit** (les passages trop bas ou limités en tonnage sont évités par le moteur) ;
  - dans tous les cas, les **restrictions rencontrées** le long du trajet sont repérées à partir des données OpenStreetMap et annoncées à l'approche.
- **Aires & services** : aires de camping-car, vidange, points d'eau, campings, parkings, carburant, restaurants, supermarchés, sites touristiques (Overpass).
- **Navigation guidée** : suivi GPS temps réel, carte orientée dans le sens de marche, recentrage, instructions virage par virage, **annonces vocales en français**, vitesse instantanée, verrouillage de l'écran, recalcul automatique en cas de sortie d'itinéraire.
- **Favoris** et **profil véhicule** sauvegardés localement (persistants d'une session à l'autre).
- **Trafic TomTom en direct** (optionnel, nécessite votre propre clé — voir plus bas).

## 🚀 Publier sur GitHub Pages

1. Créez un dépôt GitHub et déposez-y le contenu de ce dossier.
2. Dans le dépôt : **Settings → Pages**.
3. Sous *Build and deployment*, choisissez **Deploy from a branch**, branche `main`, dossier `/ (root)`, puis **Save**.
4. Après une minute, votre appli est en ligne à l'adresse `https://<votre-utilisateur>.github.io/<nom-du-depot>/`.

> Servir l'appli en **HTTPS** (ce que fait GitHub Pages) est important : c'est ce qui active correctement la **géolocalisation** et le **verrouillage d'écran** pendant la navigation, qui ne fonctionnent pas de façon fiable en ouverture locale `file://`.

### Astuce mobile
Une fois la page ouverte sur votre téléphone, utilisez **« Ajouter à l'écran d'accueil »** : l'appli s'ouvre alors en plein écran, comme une application native.

## 📱 Installer comme application (PWA)

L'appli est une **PWA** : installable et utilisable hors-ligne, sans passer par l'App Store.

**Sur iPhone / iPad (Safari)** : ouvrez la page, touchez **Partager** → **Sur l'écran d'accueil**.

**Sur Android (Chrome)** : menu ⋮ → **Installer l'application** (ou la bannière proposée).

**Mode hors-ligne** : un *service worker* met en cache la coquille de l'appli et les **tuiles de carte déjà consultées**. Les fonds de carte des zones que vous avez parcourues restent affichables sans réseau. En revanche, la recherche d'adresses, le calcul d'itinéraire, les POI et le trafic nécessitent une connexion.

> ⚠️ Le mode hors-ligne et l'installation ne fonctionnent qu'en **HTTPS**, pas en ouverture locale `file://`.

## 🔑 Moteurs d'itinéraire

Le bouton **🔑** ouvre le panneau des moteurs. L'appli les essaie **dans cet ordre**, en descendant d'un cran à chaque échec (clé refusée, quota atteint, service indisponible) :

| Rang | Moteur | Gabarit | Trafic | Clé |
|---|---|---|---|---|
| 1 | **TomTom** | oui | oui | requise |
| 2 | **Openrouteservice** (`driving-hgv`) | oui | non | requise |
| 3 | **OSRM** | non | non | aucune |

Sans aucune clé, le trajet est un **routage voiture standard** : seules les alertes de restriction fonctionnent.

### TomTom (recommandé)

Les dimensions du profil véhicule partent dans la requête (`travelMode=truck`, `vehicleHeight`, `vehicleWidth`, `vehicleLength`, `vehicleWeight`) avec `vehicleCommercial=false` : les **limites physiques** s'appliquent, mais pas les interdictions réservées au transport de marchandises. C'est le réglage juste pour un camping-car.

1. Compte gratuit sur [developer.tomtom.com](https://developer.tomtom.com/) — **aucune carte bancaire requise**.
2. Dans *My Dashboard*, copiez votre clé d'API.
3. Touchez **🔑** (ou **🚦**), collez la clé. Elle est vérifiée une fois, puis conservée.

### Openrouteservice (repli)

Moteur libre fondé sur OpenStreetMap — **la même source que les alertes de gabarit**, donc moteur et alertes ne se contredisent jamais. Profil `driving-hgv`, `vehicle_type: goods`, avec les restrictions `height` / `width` / `length` / `weight`. Pas de trafic. Clé gratuite sur [openrouteservice.org](https://openrouteservice.org/dev/#/signup).

Il n'est appelé que si au moins une dimension est renseignée : sans profil véhicule, il n'apporte rien de plus qu'OSRM.

**Sécurité :** les clés sont saisies à l'exécution et stockées uniquement dans le navigateur (localStorage). Elles **ne sont jamais écrites dans le code**, jamais mises en cache par le service worker, et ne sont donc pas publiées sur GitHub. Pensez à **restreindre votre clé TomTom** (par domaine autorisé) dans son tableau de bord, puisque le dépôt est public.

## 🔒 Confidentialité & données

- Les favoris, le profil véhicule et la clé TomTom sont stockés **localement**, sur votre appareil. Aucune synchronisation, aucun compte, aucun serveur tiers propre à l'appli.
- La persistance est propre à un navigateur donné : vider les données de navigation efface ces informations.

## ⚠️ Limites connues

- L'**évitement** des restrictions dépend du moteur : TomTom ou Openrouteservice. Avec OSRM (sans aucune clé), l'appli **signale** les obstacles mais ne les contourne pas.
- Openrouteservice plafonne les trajets à 6 000 km et à 3 alternatives, et impose un quota journalier.
- Les alertes de gabarit reposent sur les données OpenStreetMap : elles sont incomplètes par endroits et **ne remplacent jamais les panneaux routiers**.
- Une restriction portant sur un long tronçon est rattachée au point de votre trajet le plus proche du tronçon : sa position est approximative.
- Les services publics utilisés (Nominatim, OSRM, Overpass) sont gratuits mais soumis à des **politiques d'usage raisonnable** : ils peuvent être lents ou limités en volume, et ne conviennent pas à un usage intensif ou commercial.
- Le trafic TomTom s'affiche en surcouche ; il n'influence le calcul d'itinéraire que via le paramètre `traffic=true` du moteur TomTom.
- En navigation, déplacer la carte à la main remet momentanément le **nord en haut** : le bouton **⌖ Recentrer** rétablit l'orientation dans le sens de marche.

## 🧰 Services & bibliothèques utilisés

- [Leaflet](https://leafletjs.com/) — carte interactive
- [OpenStreetMap](https://www.openstreetmap.org/) — données cartographiques
- [CARTO](https://carto.com/attributions) — fonds de carte (dark / light)
- [Nominatim](https://nominatim.org/) — géocodage
- [Openrouteservice](https://openrouteservice.org/) — itinéraire poids-lourd libre (repli)
- [OSRM](http://project-osrm.org/) — calcul d'itinéraire (dernier recours)
- [Overpass API](https://overpass-api.de/) — points d'intérêt et restrictions de gabarit
- [TomTom](https://developer.tomtom.com/) — itinéraire poids-lourd, trafic en direct (optionnel)

Merci de respecter les conditions d'utilisation de chacun de ces services.

## 📄 Licence

Distribué sous licence **MIT** — voir le fichier [LICENSE](LICENSE). Vous êtes libre de l'adapter à vos besoins.
