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

Hébergement : Vercel (`vercel.json`). Design system : `DESIGN.md` (tokens dans `src/assets/style.css`).

## Mesure d'audience (GTM + GA4)
Google Tag Manager (`gtmId` dans `src/_data/site.json`, actuellement GTM-NP7VPK5P) est chargé sur toutes les pages en Consent Mode v2 : mesure refusée par défaut, accordée quand le visiteur clique « Accepter » sur le bandeau (choix mémorisé, lien « Cookies » dans le footer).

À configurer dans GTM :
1. Balise « Google tag » avec l'identifiant GA4 (G-XXXXXXX), déclencheur « Initialization - All Pages ».
2. Balise « GA4 Event » nommée `{{Event}}`, déclencheur « Événement personnalisé » avec le nom en expression régulière `generate_lead|clic_.*|temoignage_ecoute`.
3. Publier, puis dans GA4 marquer `generate_lead` comme événement clé.

Événements envoyés dans le dataLayer : `generate_lead` (devis envoyé, avec `evenement` et `formule`), `clic_devis`, `clic_appel`, `clic_email`, `temoignage_ecoute`, `consent_granted`.

Search Console : coller le code de vérification dans `googleVerification` (même fichier), puis soumettre `sitemap.xml`.

## Formulaire de devis
Le formulaire de `/devis/` envoie la demande à `api/devis.js` (fonction Vercel), qui la transmet par e-mail via Resend. Le bouton « Répondre » de l'e-mail répond directement au client.

Mise en service (une fois) :
1. Créer un compte gratuit sur resend.com avec l'adresse qui doit recevoir les demandes
2. Resend > API Keys > Create API Key (droit « Sending access »), copier la clé
3. Vercel > projet > Settings > Environment Variables, ajouter :
   - `RESEND_API_KEY` : la clé
   - `DEVIS_TO` : l'adresse du compte Resend
4. Redéployer (Deployments > ⋯ > Redeploy)

Optionnel : vérifier le domaine agencelily.fr dans Resend (DNS chez OVH) puis définir `DEVIS_FROM` (ex. `Agence Lily <devis@agencelily.fr>`) pour envoyer à n'importe quelle adresse.

Le formulaire récupère la page d'origine et la sélection du simulateur (`evenement`, `service`, `pack`, `config`, `invites`, `estimation`). Champ piège anti-robots inclus. En cas d'échec, le visiteur voit l'e-mail et le téléphone.

Guide d'édition depuis le téléphone : `docs/MODIFIER-LE-SITE.md`.

## À compléter avant la mise en ligne
- Variables Vercel du formulaire (`RESEND_API_KEY`, `DEVIS_TO`)
- `src/_data/site.json` : WhatsApp, Instagram, lien des avis Google, fiche Google Business, fondateur (page À propos)
- Photos : remplacer les images Unsplash provisoires par les vraies (`"image"` sur chaque service/événement)
- Avis Google réels sur la home (jamais d'avis inventés)
- Mentions légales (SIRET, adresse, hébergeur)
- Activer Vercel Web Analytics dans le projet Vercel (onglet Analytics). Le script est déjà dans le site.
