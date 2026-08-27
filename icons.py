#!/usr/bin/env python3
# Génère les quatre icônes PWA du GPS Camping-Car.
# Rendu 4x puis réduction : antialiasing sans dépendance externe.

from PIL import Image, ImageDraw

BLUE   = (59, 130, 246, 255)    # #3b82f6, la couleur du favicon en ligne
BLUE_D = (37, 99, 235, 255)     # #2563eb
WHITE  = (255, 255, 255, 255)

SS = 4  # facteur de suréchantillonnage


def pin(draw, cx, cy, r, fill, hole=None):
    """Goutte de localisation : disque + pointe, avec un trou central."""
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=fill)
    draw.polygon(
        [(cx - r * 0.74, cy + r * 0.66),
         (cx + r * 0.74, cy + r * 0.66),
         (cx, cy + r * 2.35)],
        fill=fill)
    if hole:
        hr = r * 0.40
        draw.ellipse([cx - hr, cy - hr, cx + hr, cy + hr], fill=hole)


def render(size, radius_ratio, content_ratio, bg, full_bleed=False):
    """radius_ratio : arrondi des coins (0 = carré plein).
       content_ratio : part du côté occupée par le dessin — c'est lui qui
       garantit la zone de sécurité des icônes maskable."""
    S = size * SS
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    if full_bleed or radius_ratio == 0:
        d.rectangle([0, 0, S, S], fill=bg)
    else:
        d.rounded_rectangle([0, 0, S - 1, S - 1], radius=int(S * radius_ratio), fill=bg)

    # Le pin mesure ~3,1 rayons de haut : on cale sa hauteur sur content_ratio.
    h = S * content_ratio
    r = h / 3.35
    cx = S / 2
    cy = S / 2 - h * 0.16
    pin(d, cx, cy, r, WHITE, hole=bg)

    return img.resize((size, size), Image.LANCZOS)


def flatten(img, bg):
    """iOS n'accepte pas la transparence sur apple-touch-icon."""
    out = Image.new("RGB", img.size, bg[:3])
    out.paste(img, mask=img.split()[3])
    return out


OUT = "/mnt/user-data/outputs/gps-camping-car/"

# Icônes « any » : coins arrondis, dessin ample.
render(192, 0.22, 0.56, BLUE).save(OUT + "icon-192.png")
render(512, 0.22, 0.56, BLUE).save(OUT + "icon-512.png")

# Maskable : fond plein bord à bord, dessin confiné aux 80 % centraux
# (Android peut rogner jusqu'à cette limite selon la forme du masque).
render(512, 0, 0.42, BLUE_D, full_bleed=True).save(OUT + "icon-512-maskable.png")

# Apple : 180x180, opaque, sans arrondi (iOS applique son propre masque).
flatten(render(180, 0, 0.56, BLUE, full_bleed=True), BLUE).save(
    OUT + "apple-touch-icon.png")

print("ok")
