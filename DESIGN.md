# Design system Agence Lily

Direction artistique inspirée de l'hôtellerie de luxe parisienne : photos plein cadre, capitales, angles droits, beaucoup d'air, boutons en pilule. Le luxe vient de la retenue, pas de la décoration.

Toutes les valeurs vivent dans `src/assets/style.css` (bloc `:root`). Ne jamais écrire une couleur, une taille ou un espacement en dur dans un template : utiliser un token ou une classe existante.

## 1. Principes
1. **La photo porte l'émotion.** Le reste de l'interface est neutre (noir, blanc, gris) pour la laisser respirer.
2. **Angles droits partout**, sauf les boutons et les pastilles, toujours en pilule.
3. **Capitales pour les titres**, bas de casse pour le texte courant.
4. **Pas d'ombres.** La hiérarchie se fait par les fonds (blanc / gris clair / noir) et l'espace.
5. **Une seule couleur d'accent**, le sauge, réservée à l'action principale d'une section (demande de devis).
6. **Les prix restent visibles** : c'est la différence avec un palace. Luxe accessible, pas luxe inaccessible.

## 2. Couleurs

| Token | Valeur | Usage |
|---|---|---|
| `--white` | `#ffffff` | Fond principal |
| `--surface` | `#f4f4f2` | Cartes, bandeaux d'intro, encarts |
| `--line` | `#e4e4e0` | Séparateurs fins |
| `--ink` | `#111111` | Texte principal, boutons principaux |
| `--muted` | `#6e6e6a` | Texte secondaire |
| `--black` | `#000000` | Header, footer, bandeaux sombres |
| `--sage` | `#cfe0d3` | Bouton d'action principale (devis) |
| `--sage-ink` | `#1f3527` | Texte sur fond sauge |

## 3. Typographie
Une seule famille : **Jost** (géométrique, auto-hébergée dans `src/assets/fonts/`).

| Rôle | Taille | Graisse | Casse | Interlettrage |
|---|---|---|---|---|
| Titre hero (H1 sur photo) | 40 à 64 px | 400 | Capitales | 0.02em |
| Titre de section (H2) | 24 à 30 px | 500 | Capitales | 0.04em |
| Titre de carte (H3) | 15 px | 500 | Capitales | 0.06em |
| Surtitre / tag | 11 px | 500 | Capitales | 0.14em |
| Texte d'intro (lede) | 18 à 20 px | 300 | Normale | 0 |
| Texte courant | 15 px | 400 | Normale | 0 |
| Bouton | 12 px | 500 | Capitales | 0.1em |

## 4. Espacements
Échelle de 4 px : `--s1` 4 · `--s2` 8 · `--s3` 12 · `--s4` 16 · `--s5` 24 · `--s6` 32 · `--s7` 48 · `--s8` 72 · `--s9` 112.

- Entre deux sections : `--s8` (72 px) sur mobile, `--s9` (112 px) sur ordinateur.
- Titre de section vers contenu : `--s6`.
- Padding des cartes : `--s5`.
- Largeur de contenu : 1200 px, texte long limité à 720 px.

## 5. Formes
- Photos, cartes, encarts, tuiles : **rayon 0**.
- Boutons, pastilles, badges : **pilule** (`999px`).
- Bordures : 1 px `--line`, uniquement quand un fond ne suffit pas.

## 6. Composants

**Hero plein cadre** (`partials/hero-full.njk`) : photo pleine largeur, dégradé sombre en bas, H1 en capitales blanches en bas à gauche. Juste dessous, un **bandeau d'intro** gris : texte d'intro à gauche, prix / contact / bouton à droite.

**Carte** (`.card`) : photo en haut (ratio 3:2), corps gris `--surface`, surtitre, titre en capitales, texte gris, puis une ligne prix à gauche + bouton pilule noir à droite.

**Carrousel** (`.rail`) : cartes en défilement horizontal avec accroche magnétique, la suivante dépasse pour inviter à glisser.

**Galerie** (`.gallery`) : mosaïque en colonnes, photos sans marge ni légende.

**Bandeau citation** (`.quote-band`) : photo plein cadre, phrase en capitales blanches, bouton sauge. N'y mettre qu'un vrai avis client ou une promesse de marque, jamais un faux témoignage.

**Encart devis** (`.enquiry`) : bloc gris horizontal, titre en capitales, phrase courte, bouton sauge à droite.

**Boutons**
- `.btn` : noir, texte blanc. Action standard.
- `.btn.sage` : sauge, texte vert foncé. Action principale (devis).
- `.btn.ghost` : blanc, bordure fine. Action secondaire.
- `.btn.light` : blanc sur fond sombre ou photo.

## 7. Images
- Lumière naturelle, tons chauds et neutres, jamais saturés.
- Scènes réelles plutôt que posées : invités, mains, détails de table.
- Formats : hero 16:9 (recadré en 4:3 sur mobile), cartes 3:2, galerie libre.
- Pas de texte incrusté dans les photos.
- Photos provisoires Unsplash à remplacer par les vraies prestations.

## 8. À ne pas faire
- Pas d'arrondi sur une photo ou une carte.
- Pas d'ombre portée.
- Pas de deuxième couleur d'accent.
- Pas de titre de section en bas de casse.
- Pas de tiret long (—) dans les textes.
