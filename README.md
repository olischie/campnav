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
- **Trafic Google en direct** (optionnel, nécessite votre propre clé — voir plus bas).

## 🚦 Trafic Google en direct (optionnel)

Le trafic temps réel de Google n'est pas accessible gratuitement sans authentification. Pour l'activer :

1. Créez une clé sur [Google Maps Platform](https://console.cloud.google.com/google/maps-apis) et activez **Maps JavaScript API** (la facturation doit être activée sur votre compte ; Google offre un crédit mensuel gratuit qui couvre largement un usage personnel).
2. Dans l'appli, touchez le bouton **🚦** et collez votre clé.

**Sécurité :** la clé est saisie à l'exécution et stockée uniquement dans le navigateur (localStorage). Elle **n'est jamais écrite dans le code** et n'est donc pas publiée sur GitHub. Pensez à **restreindre votre clé** dans la console Google (par référent HTTP, limité au domaine de votre page GitHub Pages) pour éviter tout usage abusif.

## 🔒 Confidentialité & données

- Les favoris, le profil véhicule et la clé Google sont stockés **localement**, sur votre appareil. Aucune synchronisation, aucun compte, aucun serveur tiers propre à l'appli.
- La persistance est propre à un navigateur donné : vider les données de navigation efface ces informations.

## ⚠️ Limites connues

- Le calcul d'itinéraire s'appuie sur un **routage routier standard** (profil voiture). Il ne recalcule pas automatiquement pour contourner un pont trop bas ; il **signale** ces obstacles via les alertes de hauteur.
- Les services publics utilisés (Nominatim, OSRM, Overpass) sont gratuits mais soumis à des **politiques d'usage raisonnable** : ils peuvent être lents ou limités en volume, et ne conviennent pas à un usage intensif ou commercial.
- Le trafic Google s'affiche sur sa propre carte superposée ; il n'influence pas encore le calcul d'itinéraire.

## 🧰 Services & bibliothèques utilisés

- [Leaflet](https://leafletjs.com/) — carte interactive
- [OpenStreetMap](https://www.openstreetmap.org/) — données cartographiques
- [CARTO](https://carto.com/attributions) — fonds de carte (dark / light)
- [Nominatim](https://nominatim.org/) — géocodage
- [OSRM](http://project-osrm.org/) — calcul d'itinéraire
- [Overpass API](https://overpass-api.de/) — points d'intérêt et limitations de hauteur
- [Google Maps Platform](https://developers.google.com/maps) — trafic en direct (optionnel)

Merci de respecter les conditions d'utilisation de chacun de ces services.

## 📄 Licence

Distribué sous licence **MIT** — voir le fichier [LICENSE](LICENSE). Vous êtes libre de l'adapter à vos besoins.
