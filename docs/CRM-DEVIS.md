# CRM des devis (Google Sheet)

Chaque demande du formulaire de devis :
1. t'arrive par e-mail (comme avant),
2. déclenche un accusé de réception au client, signé Sacha,
3. ajoute une ligne dans le Google Sheet « CRM Devis Agence Lily ».

Quand tu as envoyé ton devis, passe le statut de la ligne à **Devis envoyé**. La date se remplit seule. Si le client ne répond pas, il reçoit une relance à J+3 puis une dernière à J+7, depuis ton Gmail. Dès qu'il t'écrit, les relances s'arrêtent toutes seules.

## Installation (5 minutes, une seule fois)

1. Ouvre le Sheet, menu **Extensions > Apps Script**.
2. Efface le contenu, colle tout `docs/crm-devis.gs`.
3. Remplace `A_REMPLACER` par un mot de passe au hasard (le même que `CRM_TOKEN` ci-dessous). Enregistre.
4. Choisis la fonction `installer` en haut, clique **Exécuter**, accepte les autorisations Google.
5. **Déployer > Nouveau déploiement > Application Web**. Exécuter en tant que : moi. Accès : tout le monde. Copie l'URL.
6. Dans Vercel > Settings > Environment Variables, ajoute :
   - `CRM_WEBHOOK_URL` = l'URL copiée
   - `CRM_TOKEN` = le mot de passe de l'étape 3
7. Redéploie le site (Deployments > ... > Redeploy).

## Couper une partie
- Accusé de réception client : `ACCUSE_RECEPTION=off` dans Vercel.
- Relances pour un client précis : statut **Pas de relance**.
