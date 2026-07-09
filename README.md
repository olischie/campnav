# 🚐 GPS Camping-Car

Application web de navigation pensée pour les camping-cars, **optimisée mobile**, à ouvrir dans un simple navigateur. Un seul fichier (`index.html`), aucune installation, aucun serveur à gérer.

## ✨ Fonctionnalités

- **Carte interactive** plein écran (Leaflet + fonds CARTO), mode **jour / nuit**.
- **Recherche d'adresses et de lieux** (Nominatim / OpenStreetMap).
- **Itinéraire** point à point avec distance et durée estimées (OSRM).
- **Profil du véhicule** (hauteur, poids, largeur, longueur) et **alertes de hauteur** : repérage des ponts et tunnels trop bas le long du trajet, à partir des données réelles OpenStreetMap.
- **Aires & services** : aires de camping-car, vidange, points d'eau, campings, parkings, carburant (Overpass).
- **Navigation guidée** : suivi GPS temps réel, recentrage, instructions virage par virage, **annonces vocales en français**, vitesse instantanée, verrouillage de l'écran, recalcul automatique en cas de sortie d'itinéraire.
- **Favoris** et **profil véhicule** sauvegardés localement (persistants d'une session à l'autre).
- **Trafic TomTom en direct** (optionnel, nécessite votre propre clé — voir plus bas).

## 🚀 Publier sur GitHub Pages

1. Créez un dépôt GitHub et déposez-y le contenu de ce dossier (au minimum `index.html`).
2. Dans le dépôt : **Settings → Pages**.
3. Sous *Build and deployment*, choisissez **Deploy from a branch**, branche `main`, dossier `/ (root)`, puis **Save**.
4. Après une minute, votre appli est en ligne à l'adresse `https://<votre-utilisateur>.github.io/<nom-du-depot>/`.

> Servir l'appli en **HTTPS** (ce que fait GitHub Pages) est important : c'est ce qui active correctement la **géolocalisation** et le **verrouillage d'écran** pendant la navigation, qui ne fonctionnent pas de façon fiable en ouverture locale `file://`.

### Astuce mobile
Une fois la page ouverte sur votre téléphone, utilisez **« Ajouter à l'écran d'accueil »** : l'appli s'ouvre alors en plein écran, comme une application native.

## 📱 Installer comme application (PWA)

L'appli est une **PWA** : installable et utilisable hors-ligne, sans passer par l'App Store.

**Sur iPhone / iPad (Safari)** : ouvrez la page, touchez **Partager** → **Sur l'écran d'accueil**. L'icône apparaît comme une vraie app et s'ouvre en plein écran.

**Sur Android (Chrome)** : menu ⋮ → **Installer l'application** (ou la bannière proposée).

**Mode hors-ligne** : un *service worker* met en cache la coquille de l'appli et les **tuiles de carte déjà consultées**. Les fonds de carte des zones que vous avez parcourues restent affichables sans réseau. En revanche, la recherche d'adresses, le calcul d'itinéraire, les POI et le trafic nécessitent une connexion (ce sont des services en ligne).

> ⚠️ Le mode hors-ligne et l'installation ne fonctionnent qu'en **HTTPS** (GitHub Pages convient), pas en ouverture locale `file://`.

## 🚦 Trafic TomTom en direct (optionnel)

Le trafic en temps réel s'affiche directement sur la carte, sous forme de couleurs de circulation (vert = fluide, orange = dense, rouge = ralenti). Il utilise les tuiles de trafic **TomTom**, gratuites pour un usage personnel.

1. Créez un compte gratuit sur [developer.tomtom.com](https://developer.tomtom.com/) — **aucune carte bancaire requise**.
2. Dans *My Dashboard*, copiez votre clé d'API.
3. Dans l'appli, touchez le bouton **🚦** et collez votre clé.

**Sécurité :** la clé est saisie à l'exécution et stockée uniquement dans le navigateur (localStorage). Elle **n'est jamais écrite dans le code** et n'est donc pas publiée sur GitHub. Pensez à **restreindre votre clé** dans le tableau de bord TomTom (par domaine autorisé) pour éviter tout usage abusif, puisque le dépôt est public.

## 🔒 Confidentialité & données

- Les favoris, le profil véhicule et la clé TomTom sont stockés **localement**, sur votre appareil. Aucune synchronisation, aucun compte, aucun serveur tiers propre à l'appli.
- La persistance est propre à un navigateur donné : vider les données de navigation efface ces informations.

## ⚠️ Limites connues

- Le calcul d'itinéraire s'appuie sur un **routage routier standard** (profil voiture). Il ne recalcule pas automatiquement pour contourner un pont trop bas ; il **signale** ces obstacles via les alertes de hauteur.
- Les services publics utilisés (Nominatim, OSRM, Overpass) sont gratuits mais soumis à des **politiques d'usage raisonnable** : ils peuvent être lents ou limités en volume, et ne conviennent pas à un usage intensif ou commercial.
- Le trafic TomTom s'affiche en surcouche sur la carte ; il n'influence pas encore le calcul d'itinéraire.

## 🧰 Services & bibliothèques utilisés

- [Leaflet](https://leafletjs.com/) — carte interactive
- [OpenStreetMap](https://www.openstreetmap.org/) — données cartographiques
- [CARTO](https://carto.com/attributions) — fonds de carte (dark / light)
- [Nominatim](https://nominatim.org/) — géocodage
- [OSRM](http://project-osrm.org/) — calcul d'itinéraire
- [Overpass API](https://overpass-api.de/) — points d'intérêt et limitations de hauteur
- [TomTom](https://developer.tomtom.com/) — trafic en direct (optionnel)

Merci de respecter les conditions d'utilisation de chacun de ces services.

## 📄 Licence

Distribué sous licence **MIT** — voir le fichier [LICENSE](LICENSE). Vous êtes libre de l'adapter à vos besoins.
