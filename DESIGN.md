# Design system Agence Lily

Direction artistique inspirée de « Rosella » (site de wedding planner haut de gamme) : fond ivoire chaud, brun très foncé, un accent taupe, grand serif, photos de mariage généreuses, filets fins, angles quasi droits, beaucoup d'air. Le luxe vient de la chaleur et de la retenue.

Toutes les valeurs vivent dans `src/assets/style.css` (bloc `:root` et couche « DA Rosella » en fin de fichier). Ne jamais écrire une couleur, une taille ou un espacement en dur dans un template : utiliser un token ou une classe existante.

## 1. Principes
1. **La photo porte l'émotion** : grandes images de vrais moments, l'interface reste neutre et chaude.
2. **Une seule couleur d'accent, le taupe**, pour l'action principale, les surtitres et le footer. Jamais de noir pur, jamais d'autre couleur.
3. **Grand serif en bas de casse pour les titres**, en capitales uniquement pour le H1 du hero.
4. **Angles quasi droits** (2 px) partout, boutons compris. Filets de 1 px plutôt que des ombres.
5. **Une idée par section, une phrase par idée.** Les prix restent visibles.

## 2. Couleurs

| Token | Valeur | Usage |
|---|---|---|
| `--bg` | `#f8f6f2` | Ivoire : fond principal |
| `--surface` | `#f0ebe4` | Sable : sections alternées, encarts |
| `--white` | `#ffffff` | Cartes, texte sur photo |
| `--line` | `#e2d9cf` | Filets, bordures |
| `--ink` | `#2a2420` | Brun très foncé : texte, boutons contour |
| `--muted` | `#6f655e` | Texte secondaire, seconde moitié des paragraphes deux tons (contraste 5,3 sur ivoire, 4,8 sur sable) |
| `--accent` | `#7a6558` | Taupe : bouton principal, surtitres, puces |
| `--accent-dark` | `#5f4d42` | Survol du bouton principal |

## 3. Typographie
Deux familles, auto-hébergées dans `src/assets/fonts/` :
- **Instrument Serif** (titres) : grand serif éditorial en bas de casse ; en capitales pour le seul H1 du hero.
- **Manrope** (texte, étiquettes, boutons) : sans-serif humaniste, discret.

**Échelle : 7 tailles, et aucune autre.** Chaque `font-size` du CSS utilise un de ces tokens.

| Token | Valeur | Usage |
|---|---|---|
| `--fs-label` | 11 px | Surtitres taupe (capitales, interlettrage 0.22em), tags, fil d'Ariane |
| `--fs-small` | 13 px | Boutons (bas de casse), notes, légendes, liens, texte des cartes |
| `--fs-body` | 16 px | Texte courant, h3 en capitales |
| `--fs-lead` | 18 à 21 px | Paragraphe d'intro centré en deux tons |
| `--fs-h2` | 32 à 52 px | H2 (Instrument Serif) |
| `--fs-h1` | 46 à 96 px | H1 (Instrument Serif) |
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
- La barre de contact mobile est masquée sur les pages Devis et Merci. Sur le Simulateur, elle est remplacée par une barre « total estimé + Vérifier ma date ».
- Chaque page a un bouton d'action dans le premier écran mobile.
- Photos, cartes, encarts, tuiles, boutons, badges : **rayon 2 px** (`--radius`). Aucune pilule.
- Focus clavier : contour taupe de 2 px (`:focus-visible`), blanc sur photo et sur le footer.
- Images locales : largeur et hauteur ajoutées automatiquement au build (transform `images-dimensions`).
- Contraste : tout texte atteint 4,5 (WCAG AA). Ne jamais éclaircir `--muted`.
- Bordures : 1 px `--line`, uniquement quand un fond ne suffit pas.

## 6. Composants

**En-tête** : fond ivoire, filet bas. Liens à gauche (Livre d'or, Location, Mariage, Tarifs), logo LILY centré (`assets/logo-lily.svg`, 26 px de haut, 22 px sur mobile ; version blanche `logo-lily-blanc.svg` dans le footer), bouton taupe « Vérifier ma date » à droite. Mobile : logo à gauche, menu à droite.

**Hero encadré** (`partials/hero-full.njk`) : photo en retrait de 20 px dans la page, voile sombre en haut et en bas. H1 en capitales serif en haut à gauche. En bas à gauche : bouton contour blanc (et prix si utile). En bas à droite : légende courte (`heroIntro`).

**Intro centrée** (`.intro-center`) : pictogramme, paragraphe en deux tons (première phrase en `--ink`, suite en `--muted` dans un `<span>`), bouton contour.

**Titre de section** (`.section-title`) : surtitre taupe en capitales espacées, H2 serif centré, phrase courte grise optionnelle.

**Trio décalé** (`.trio`) : trois colonnes de photos verticales, la colonne du milieu descend et place son titre au-dessus de la photo.

**Offres en zigzag** (`partials/formules-zigzag.njk`) : photo et texte alternés gauche/droite. Texte : badge éventuel, nom en serif, description grise, puces rondes taupe, « Prix » puis montant en serif, bouton contour.

**Bandeau témoignage** (`.testimonial`) : photo pleine largeur, surtitre et titre en haut à gauche, carte translucide en bas à droite. Un vrai avis uniquement ; à défaut, la promesse de marque.

**Galerie** (`.masonry`) : mosaïque à hauteurs variées, légende serif sur la photo.

**FAQ** (`.faq-center`) : colonne centrée étroite, filets fins, chevrons, bouton contour centré dessous.

**Footer** (`.footer-xl`) : fond brun très foncé (`--ink`). À gauche, phrase de marque en serif, téléphone, e-mail, zone et icônes rondes ; à droite, trois colonnes de liens (Livre d'or, Occasions, Agence) sous des surtitres. Filet fin terminé par le bouton blanc « Vérifier ma date », ligne légale, puis logo LILY géant à 14 % d'opacité, coupé en bas.

**Boutons**
- `.btn` : contour 1 px brun, fond transparent, bas de casse. Action secondaire et standard.
- `.btn.primary` : taupe plein, texte blanc. Action principale (en-tête, barre mobile).
- Sur photo ou fond taupe : contour blanc (automatique dans le hero, le bandeau, le footer).
- Un seul libellé d'action principale sur tout le site : « Vérifier ma date ».

**En-tête de page sans photo** (`.page-head`) : surtitre, H1 et phrase grise centrés, boutons dessous (Tarifs, Devis, Simulateur).

**Fil d'Ariane** : posé en haut de la photo du hero. **Visuel manquant** : fond neutre seul, sans étiquette. **Carrousel mobile** (`.m-rail`) pour les grilles qui rallongent la page.

## 7. Images
- Lumière naturelle, tons chauds et neutres, jamais saturés.
- Scènes réelles plutôt que posées : invités, mains, détails de table.
- Formats : hero 16:9 (recadré en 4:3 sur mobile), cartes 3:2, galerie libre.
- Pas de texte incrusté dans les photos.
- Photos provisoires générées (sauf le baby shower, encore sur Unsplash) : à remplacer par les vraies prestations.

## 8. À ne pas faire
- Pas d'arrondi au-delà de 2 px.
- Pas d'ombre portée.
- Aucune autre couleur que la palette ivoire, sable, brun et taupe.
- Pas de titre en capitales, sauf le H1 du hero et les h3 étiquettes.
- Pas de tiret long (—) dans les textes.
