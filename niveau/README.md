# 🫧 Niveau Camping-Car

Niveau à bulle circulaire pour mettre un camping-car de niveau en stationnement. Appli indépendante du GPS : une page, un manifeste, un service worker. Elle fonctionne hors-ligne une fois ouverte.

Adresse : `https://olischie.github.io/campnav/niveau/`

## Ce qu'elle affiche

- une **fiole circulaire** : la bulle monte du côté le plus haut, comme un vrai niveau ; anneaux à la tolérance choisie, 1°, 2° et 3° ;
- l'inclinaison **en long** et **en travers**, au demi-degré près, avec le côté le plus bas ;
- la **hauteur de cale à placer sous chaque roue**, au centimètre près, calculée avec l'empattement et la voie du véhicule (chaque roue est ramenée au niveau de la plus haute) ; au-delà de 12 cm, l'appli conseille de changer d'emplacement ;
- un **bip** facultatif quand le véhicule devient de niveau, pratique en montant sur les cales ;
- un bouton **Figer** pour garder la mesure affichée.

## Mode d'emploi

1. Posez le téléphone **à plat** sur le plancher, au milieu du véhicule, le haut du téléphone vers l'avant (sinon, indiquez son orientation dans Réglages).
2. Les valeurs par défaut sont celles d'un **Citroën Jumper L4 de 6,36 m** (empattement 4,035 m, voie 1,80 m). Pour un autre véhicule, saisissez dans **Réglages** son empattement (distance entre essieux) et sa voie (écart entre les roues d'un essieu).
3. Placez les cales indiquées, avancez, vérifiez.

## Lecture calme

La mesure est lissée sur environ une seconde, et un chiffre affiché ne change que si l'inclinaison s'écarte nettement de sa valeur : la lecture ne tremble pas. Le véhicule est considéré **de niveau sous 1°** (réglable : 0,5°, 1° ou 2°), ce qui suffit au confort et au réfrigérateur.

## Calibration

Un téléphone n'est jamais parfaitement plat (bloc photo, coque). **Calibrer** fait deux mesures au même endroit, avec un demi-tour entre les deux : la moyenne donne le défaut du téléphone, sans avoir besoin d'une surface déjà de niveau. À refaire si vous changez de coque.

## Installation

- **iPhone (Safari)** : Partager → Sur l'écran d'accueil. Au premier lancement, touchez **Autoriser** pour donner accès au capteur d'inclinaison.
- **Android (Chrome)** : menu ⋮ → Installer l'application.

La page doit être servie en **HTTPS** (c'est le cas avec GitHub Pages) : sans cela, le navigateur refuse l'accès au capteur.

## Limites

Une fois calibré, un téléphone mesure bien en dessous du demi-degré affiché. Pour un réfrigérateur à absorption, la tolérance usuelle est d'environ 3° en travers et 6° en long : la notice de votre modèle fait foi.
