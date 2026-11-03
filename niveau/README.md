# 🫧 Niveau Camping-Car

Niveau à bulle circulaire pour mettre un camping-car de niveau en stationnement. Appli indépendante du GPS : une page, un manifeste, un service worker. Elle fonctionne hors-ligne une fois ouverte.

Adresse : `https://olischie.github.io/campnav/niveau/`

## Ce qu'elle affiche

- une **fiole circulaire** : la bulle monte du côté le plus haut, comme un vrai niveau ; anneaux à la tolérance choisie, 1°, 2° et 3° (échelle resserrée au centre, là où se joue la précision) ;
- l'inclinaison **en long** et **en travers**, en degrés et en pourcentage, avec le côté le plus bas ;
- la **hauteur de cale à placer sous chaque roue**, au demi-centimètre, calculée avec l'empattement et la voie du véhicule (chaque roue est ramenée au niveau de la plus haute) ; au-delà de 12 cm, l'appli conseille de changer d'emplacement ;
- un **bip** facultatif quand le véhicule devient de niveau, pratique en montant sur les cales ;
- un bouton **Figer** pour garder la mesure affichée.

## Mode d'emploi

1. Posez le téléphone **à plat** sur le plancher, au milieu du véhicule, le haut du téléphone vers l'avant (sinon, indiquez son orientation dans Réglages).
2. Dans **Réglages**, saisissez l'empattement (distance entre essieux) et la voie (écart entre les roues d'un essieu).
3. Placez les cales indiquées, avancez, vérifiez.

## Calibration

Un téléphone n'est jamais parfaitement plat (bloc photo, coque). **Calibrer** fait deux mesures au même endroit, avec un demi-tour entre les deux : la moyenne donne le défaut du téléphone, sans avoir besoin d'une surface déjà de niveau. À refaire si vous changez de coque.

## Installation

- **iPhone (Safari)** : Partager → Sur l'écran d'accueil. Au premier lancement, touchez **Autoriser** pour donner accès au capteur d'inclinaison.
- **Android (Chrome)** : menu ⋮ → Installer l'application.

La page doit être servie en **HTTPS** (c'est le cas avec GitHub Pages) : sans cela, le navigateur refuse l'accès au capteur.

## Limites

Les capteurs de téléphone sont précis à quelques dixièmes de degré près une fois calibrés. Pour un réfrigérateur à absorption, la tolérance usuelle est d'environ 3° en travers et 6° en long : la notice de votre modèle fait foi.
