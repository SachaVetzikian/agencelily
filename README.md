# Agence Lily : site

Eleventy, sans framework JS. Tout le contenu vient de deux fichiers :

- `src/_data/services.json` : les 7 prestations (bars gourmands et location), prix, FAQ
- `src/_data/evenements.json` : les 5 pages événement, services recommandés, packs

Ajouter une prestation ou un événement = ajouter une entrée JSON. Les pages, le menu, le footer, les tarifs et le sitemap se mettent à jour seuls.

```
npm install
npm start      # http://localhost:8080
npm run build  # sortie dans _site/
```

Hébergement : Vercel (`vercel.json`).

## Formulaire de devis (Tally)
1. Créer le formulaire sur tally.so
2. Ajouter les champs cachés `evenement`, `service` et `pack` (ils récupèrent la page d'origine du visiteur)
3. Régler la fin du formulaire sur une redirection vers `https://www.agencelily.fr/merci/`
4. Copier l'ID du formulaire (`tally.so/r/XXXXXX`) dans `src/_data/site.json`, champ `tallyId`

## À compléter avant la mise en ligne
- `src/_data/site.json` : ID Tally, téléphone, Instagram, lien des avis Google
- Photos : remplacer les images Unsplash provisoires par les vraies (`"image"` sur chaque service/événement)
- Avis Google réels sur la home (jamais d'avis inventés)
- Mentions légales (SIRET, adresse, hébergeur)
