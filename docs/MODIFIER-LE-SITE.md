# Modifier le site depuis ton téléphone

Tout le contenu est dans des fichiers texte. Tu les modifies sur GitHub, Vercel met le site à jour tout seul en 1 minute.

## Comment faire
1. Ouvre l'appli GitHub (ou github.com dans le navigateur) et va dans le repo `agencelily`.
2. Ouvre le fichier à modifier (liste ci-dessous).
3. Touche l'icône crayon, fais ta modification.
4. Touche « Commit changes ». C'est en ligne une minute plus tard.

## Quel fichier pour quoi

| Je veux changer… | Fichier | Champ |
|---|---|---|
| Un prix de service | `src/_data/services.json` | `"prix"` (et `"parPersonne"` pour les bars) |
| Un prix de formule du livre d'or | `src/_data/services.json` | `"formules"` > `"prix"` |
| Le prix d'un pack | `src/_data/evenements.json` | `"pack"` > `"prix"` et `"valeur"` |
| Le téléphone, WhatsApp, Instagram | `src/_data/site.json` | `"phone"`, `"whatsapp"`, `"instagram"` |
| Le code de vérification Google Search Console | `src/_data/site.json` | `"googleVerification"` |
| L'adresse qui reçoit les devis | Vercel > Settings > Environment Variables | `DEVIS_TO` |
| Ajouter un avis client | `src/_data/avis.json` | voir modèle ci-dessous |
| Mettre à jour le nombre d'avis Google | `src/_data/site.json` | `"avis"` > `"nombre"` (le compteur s'affiche à partir de 5 avis) |
| Ajouter une réalisation | `src/_data/realisations.json` | voir modèle ci-dessous |

## Règles pour ne rien casser
- Les prix sont des nombres **sans guillemets** : `"prix": 400` et pas `"prix": "400"`.
- Ne supprime jamais une virgule ou un guillemet. Si le site ne se met pas à jour, c'est presque toujours ça : GitHub garde l'historique, on peut revenir en arrière.
- WhatsApp : format international sans `+` ni espaces, par exemple `33612345678`.

## Modèle d'avis (`avis.json`)
```json
[
  {
    "prenom": "Julie",
    "evenement": "Mariage",
    "date": "juin 2026",
    "note": 5,
    "texte": "Le texte de l'avis, copié tel quel depuis Google.",
    "services": ["bar-a-crepes", "livre-dor-audio-video"]
  }
]
```
`services` sert à afficher l'avis sur les bonnes pages service. Copie les avis tels quels, n'en invente jamais.

## Modèle de réalisation (`realisations.json`)
```json
[
  {
    "titre": "Mariage de Julie et Thomas",
    "evenement": "Mariage",
    "ville": "Versailles",
    "date": "juin 2026",
    "texte": "Bar à crêpes en fin de soirée et livre d'or audio avec animateur.",
    "prestations": ["bar-a-crepes", "livre-dor-audio-video"],
    "photos": ["/assets/photos/mariage-julie-thomas.webp"]
  }
]
```
La page Réalisations apparaît automatiquement dès la première réalisation ajoutée.

## Ajouter une photo
Dépose le fichier dans `src/assets/photos/` (format `.webp` ou `.jpg`, 1600 px de large max), puis renseigne son chemin dans le champ `"image"` du service ou de l'événement : `"image": "/assets/photos/bar-a-crepes.webp"`.
