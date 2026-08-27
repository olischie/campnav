# Icônes PWA

Les quatre fichiers sont fournis et prêts à l'emploi :

| Fichier | Taille | Rôle |
|---|---|---|
| `icon-192.png` | 192×192 | Écran d'accueil Android, onglet |
| `icon-512.png` | 512×512 | Splash screen, magasins d'applications |
| `icon-512-maskable.png` | 512×512 | Android adaptatif (`purpose: maskable`) |
| `apple-touch-icon.png` | 180×180 | Écran d'accueil iOS (opaque, sans arrondi) |

Le dessin est repris du favicon SVG intégré à `index.html` : repère de
localisation blanc sur fond bleu `#3b82f6`. La variante maskable utilise le bleu
plus soutenu `#2563eb`, à fond perdu, avec le dessin confiné aux 80 % centraux —
Android peut rogner jusqu'à cette limite selon la forme du masque de l'appareil.

Pour les régénérer ou changer la couleur, le script `icons.py` est joint.
