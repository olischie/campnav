# 🚐 GPS Camping-Car

Application web de navigation pensée pour les camping-cars, **optimisée mobile**, à ouvrir dans un simple navigateur. Aucune installation, aucun serveur à gérer : une page (`index.html`), un manifeste et un service worker.

## ✨ Fonctionnalités

- **Carte vectorielle** plein écran (**MapLibre GL JS**, fond **OpenFreeMap** gratuit et sans clé, noms en français), avec **choix du fond de carte** dans l'onglet Options : **Clair**, **Contraste** (niveaux de gris) et **Nuit** (fond sombre dont les routes ont été éclaircies pour rester bien visibles), plus un **curseur de luminosité** qui n'agit que sur le fond, jamais sur le tracé, et un interrupteur **Bâtiments en 3D** (éteint par défaut : en ville, à fort zoom, semi-transparents pour laisser deviner les rues). Si OpenFreeMap ne répond pas, l'appli bascule d'elle-même sur **Protomaps** (clé facultative), puis sur les tuiles **OpenStreetMap** classiques.
- **Recherche d'adresses et de lieux** (Nominatim / OpenStreetMap), **classée du plus proche au plus éloigné** de votre position (ou du centre de la carte si vous regardez ailleurs), distance affichée. La recherche porte d'abord sur un rayon d'environ 5 km (le lieu le plus proche s'affiche aussitôt), puis 30 km, puis partout pour trouver aussi les villes et lieux lointains, à une seconde d'intervalle (limite de Nominatim).
- **Itinéraire** point à point : **un seul trajet**, équilibrant durée et distance, avec une option **« éviter les péages »**.
- **Profil du véhicule** (hauteur, poids, largeur, longueur) utilisé de deux façons :
  - avec une **clé TomTom** ou **Openrouteservice**, l'itinéraire est **calculé pour votre gabarit** (les passages trop bas ou limités en tonnage sont évités par le moteur) ;
  - dans tous les cas, les **restrictions rencontrées** le long du trajet sont repérées à partir des données OpenStreetMap et annoncées à l'approche.
- **Aires & services** : aires de camping-car, campings, parkings, restaurants, supermarchés, sites touristiques (Overpass). Les services proches du centre de la carte s'affichent en une ou deux secondes, le reste de la zone s'y ajoute ensuite. **Site web** du lieu indiqué quand il est connu (à défaut, celui de l'enseigne). Les résultats s'effacent de la carte d'un bouton.
- **Navigation guidée** : suivi GPS temps réel, carte **orientée dans le sens de marche et inclinée** comme sur un GPS (véhicule placé aux deux tiers bas de l'écran pour voir loin devant), **position calée sur la route** tant qu'on suit l'itinéraire (le repère avance le long du tracé, sans couper les virages), **tracé parcouru effacé au fur et à mesure**, recentrage, instructions virage par virage, **annonces vocales en français** (à 1 km, 500 m et 200 m, puis au moment de tourner), **compteur de vitesse** en bas à gauche, **alternative proposée si le trafic fait gagner au moins 10 min** (clé TomTom ; la proposition s'efface au bout de 45 s), bouton trafic accessible en roulant, verrouillage de l'écran, recalcul automatique en cas de sortie d'itinéraire.
- **Heure d'arrivée estimée** affichée pendant le guidage, à côté du temps restant.
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

**Mode hors-ligne** : un *service worker* met en cache la coquille de l'appli, les **tuiles de carte déjà consultées** et les polices du fond de carte ; les styles OpenFreeMap sont gardés dans le navigateur pour un démarrage immédiat. Les zones que vous avez parcourues restent affichables sans réseau, noms de rues compris. En revanche, la recherche d'adresses, le calcul d'itinéraire, les POI et le trafic nécessitent une connexion.

> ⚠️ Le mode hors-ligne et l'installation ne fonctionnent qu'en **HTTPS**, pas en ouverture locale `file://`.

## 🗺️ Fond de carte

Trois fournisseurs, essayés dans cet ordre, comme les moteurs d'itinéraire :

| Rang | Fournisseur | Type | Clé |
|---|---|---|---|
| 1 | **OpenFreeMap** | vectoriel | aucune |
| 2 | **Protomaps** | vectoriel | facultative |
| 3 | **OpenStreetMap** | images | aucune |

L'appli ne descend d'un cran que sur une vraie panne (erreurs répétées du serveur, style introuvable), pas sur une simple coupure de réseau : hors ligne, les tuiles déjà vues restent affichées. Pour activer le secours Protomaps, créez une clé gratuite sur [protomaps.com/dashboard](https://protomaps.com/dashboard) et collez-la dans l'onglet **Options**, sous « Clé Protomaps ».

OpenFreeMap est un projet bénévole, financé par des dons et sans garantie de service : c'est pour cela que les deux autres fournisseurs restent en réserve. Ses styles d'origine (Liberty pour Clair, Positron pour Contraste, Dark pour Nuit) sont adaptés par l'appli : noms en français, routes éclaircies la nuit, bâtiments à plat par défaut pour ne pas masquer les rues en vue inclinée (relief disponible avec l'interrupteur « Bâtiments en 3D »).

## 🔑 Moteurs d'itinéraire

L'onglet **Options** (à droite des Favoris) réunit le **choix du fond de carte**, l'évitement des péages et les clés d'activation. L'appli les essaie **dans cet ordre**, en descendant d'un cran à chaque échec (clé refusée, quota atteint, service indisponible) :

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
3. Dans l'onglet **Options**, collez la clé sous « TomTom ». Elle est vérifiée une fois, puis conservée. Le trafic n'est **pas** activé automatiquement : touchez **🚦** quand vous le voulez.

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
- Avec le moteur TomTom, le tracé vient de la cartographie TomTom alors que le fond de carte vient d'OpenStreetMap : par endroits, les deux peuvent différer de quelques mètres. Openrouteservice et OSRM, eux, utilisent les mêmes données que le fond de carte.
- Une restriction portant sur un long tronçon est rattachée au point de votre trajet le plus proche du tronçon : sa position est approximative.
- Les services publics utilisés (Nominatim, OSRM, Overpass) sont gratuits mais soumis à des **politiques d'usage raisonnable** : ils peuvent être lents ou limités en volume, et ne conviennent pas à un usage intensif ou commercial.
- Overpass est interrogé sur **trois instances successives** (`overpass-api.de`, `overpass.kumi.systems`, `overpass.private.coffee`) : si l'une sature, l'appli bascule automatiquement sur la suivante. La pastille grise « contrôle du gabarit indisponible » signifie que **les trois** ont échoué — donc *non vérifié*, et non *rien à signaler*.
- Le trafic TomTom s'affiche en surcouche ; il n'influence le calcul d'itinéraire que via le paramètre `traffic=true` du moteur TomTom.
- En navigation, déplacer ou zoomer la carte à la main suspend le suivi automatique (la carte garde son orientation) : le bouton **⌖ Recentrer** le rétablit.
- MapLibre dessine la carte avec **WebGL**, présent sur tout téléphone récent. Sur un appareil qui en serait dépourvu, l'appli affiche un message au lieu de la carte.

## 🧰 Services & bibliothèques utilisés

- [MapLibre GL JS](https://maplibre.org/) — carte vectorielle (rotation, inclinaison)
- [OpenFreeMap](https://openfreemap.org/) — fond de carte vectoriel par défaut (styles et tuiles OpenMapTiles)
- [Protomaps](https://protomaps.com/) — fond de carte vectoriel de secours
- [OpenStreetMap](https://www.openstreetmap.org/) — données cartographiques, et tuiles du fond de secours
- [Nominatim](https://nominatim.org/) — géocodage
- [Openrouteservice](https://openrouteservice.org/) — itinéraire poids-lourd libre (repli)
- [OSRM](http://project-osrm.org/) — calcul d'itinéraire (dernier recours)
- [Overpass API](https://overpass-api.de/) — points d'intérêt et restrictions de gabarit (avec miroirs [kumi.systems](https://overpass.kumi.systems/) et [private.coffee](https://overpass.private.coffee/))
- [TomTom](https://developer.tomtom.com/) — itinéraire poids-lourd, trafic en direct (optionnel)

Merci de respecter les conditions d'utilisation de chacun de ces services.

## 📄 Licence

Distribué sous licence **MIT** — voir le fichier [LICENSE](LICENSE). Vous êtes libre de l'adapter à vos besoins.
