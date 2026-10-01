# Design system Agence Lily

Direction artistique inspirée de l'hôtellerie de luxe parisienne : photos plein cadre, capitales, angles droits, beaucoup d'air, boutons en pilule. Le luxe vient de la retenue, pas de la décoration.

Toutes les valeurs vivent dans `src/assets/style.css` (bloc `:root`). Ne jamais écrire une couleur, une taille ou un espacement en dur dans un template : utiliser un token ou une classe existante.

## 1. Principes
1. **La photo porte l'émotion.** Le reste de l'interface est neutre (noir, blanc, gris) pour la laisser respirer.
2. **Angles droits partout**, sauf les boutons et les pastilles, toujours en pilule.
3. **Capitales pour les titres**, bas de casse pour le texte courant.
4. **Pas d'ombres.** La hiérarchie se fait par les fonds (blanc / gris clair / noir) et l'espace.
5. **Noir et blanc uniquement.** Aucune couleur d'accent : la hiérarchie vient du contraste, de la taille et de l'espace. L'action principale est un bouton noir plein (blanc plein sur fond sombre).
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

## 3. Typographie
Deux familles, auto-hébergées dans `src/assets/fonts/` :
- **Instrument Serif** (titres) : grand serif éditorial, en bas de casse, jamais en capitales. L'italique sert à une seule phrase d'accent par page, en gris.
- **Jost** (texte, étiquettes, boutons) : géométrique, discrète.

**Échelle : 7 tailles, et aucune autre.** Chaque `font-size` du CSS utilise un de ces tokens.

| Token | Valeur | Usage |
|---|---|---|
| `--fs-label` | 11 px | Surtitres, tags, boutons, fil d'Ariane, en-têtes de tableau (Jost, capitales, interlettrage 0.1 à 0.14em) |
| `--fs-small` | 13 px | Notes, légendes, liens du footer |
| `--fs-body` | 16 px | Texte courant, h3 en capitales |
| `--fs-lead` | 18 à 20 px | Texte d'intro (Jost 300) |
| `--fs-h2` | 32 à 56 px | H2 (Instrument Serif) |
| `--fs-h1` | 44 à 92 px | H1 (Instrument Serif) |
| `--fs-display` | 48 à 88 px | Phrase manifeste, prix des formules (Instrument Serif) |

**Règles de composition**
- Titres en `text-wrap: balance` : jamais un mot seul sur la dernière ligne.
- Apostrophe typographique (’) partout dans le texte visible : elle est appliquée automatiquement au build (transform `apostrophes`).
- Italique serif gris : une seule phrase d'accent par section au maximum.

**Règle des mots :** une idée par section, une phrase par idée. L'accueil reste sous 150 mots ; le texte détaillé (étapes, FAQ, logistique) vit sur les pages produit et location.

**Un seul verbe d'action sur tout le site :** « Vérifier ma date ».

## 4. Espacements
Échelle de 4 px : `--s1` 4 · `--s2` 8 · `--s3` 12 · `--s4` 16 · `--s5` 24 · `--s6` 32 · `--s7` 48 · `--s8` 72 · `--s9` 112.

- Entre deux sections : `--s8` (72 px) sur mobile, `--s9` (112 px) sur ordinateur.
- Titre de section vers contenu : `--s6`.
- Padding des cartes : `--s5`.
- Largeur de contenu : 1200 px, texte long limité à 720 px.

## 5. Formes et interactions
- Cibles tactiles : 44 px minimum pour tout lien isolé (liens du footer, fil d'Ariane, liens « Comment ça marche », questions de FAQ).
- La barre de contact mobile est masquée sur les pages Devis et Merci.
- Photos, cartes, encarts, tuiles : **rayon 0**.
- Boutons, pastilles, badges : **pilule** (`999px`).
- Bordures : 1 px `--line`, uniquement quand un fond ne suffit pas.

## 6. Composants

**Hero plein cadre** (`partials/hero-full.njk`) : photo pleine largeur, dégradé sombre en bas, H1 en capitales blanches en bas à gauche. Juste dessous, un **bandeau d'intro** gris : texte d'intro à gauche, prix / contact / bouton à droite. Sur mobile : image verticale dédiée (`heroImgMobile`, 4:5), hero plus court, prix et bouton affichés avant le texte.

**Fil d'Ariane** : posé en haut de la photo du hero (texte blanc, 11 px). Sur les pages sans hero photo, en haut de page.

**Footer** (`.footer-min`) : la phrase de marque en serif, un bouton « Vérifier ma date », une ligne de liens, une ligne légale. Rien d'autre.

**Visuel manquant** : fond neutre seul, jamais d'étiquette « Photo : … ». Une section sans photo vaut mieux qu'un rectangle annoté.

**Carrousel mobile** (`.m-rail`) : sur mobile, une grille (formules, exemples, étapes) devient un défilement horizontal pour raccourcir la page.

**Carte** (`.card`) : photo en haut (ratio 3:2), corps gris `--surface`, surtitre, titre en capitales, texte gris, puis une ligne prix à gauche + bouton pilule noir à droite.

**Carrousel** (`.rail`) : cartes en défilement horizontal avec accroche magnétique, la suivante dépasse pour inviter à glisser.

**Galerie** (`.gallery`) : mosaïque en colonnes, photos sans marge ni légende.

**Bandeau citation** (`.quote-band`) : photo plein cadre, phrase en capitales blanches, bouton blanc. N'y mettre qu'un vrai avis client ou une promesse de marque, jamais un faux témoignage.

**Encart devis** (`.enquiry`) : bloc gris horizontal, titre en capitales, phrase courte, bouton noir à droite.

**Boutons**
- `.btn` : noir, texte blanc. Action standard.
- `.btn.primary` : noir plein, plus grand et plus gras. Action principale (devis). Devient blanc plein sur fond sombre (header, pack, bandeau citation, barre mobile).
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
- Aucune couleur : noir, blanc et gris uniquement.
- Pas de titre de section en bas de casse.
- Pas de tiret long (—) dans les textes.
