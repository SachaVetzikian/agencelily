/**
 * CRM des demandes de devis Agence Lily (Google Sheet + Apps Script)
 *
 * Ce que fait ce script :
 * 1. doPost : chaque demande du site (api/devis.js) ajoute une ligne dans l'onglet "Demandes".
 * 2. relancer : tous les matins, relance les clients qui ont reçu un devis sans répondre
 *    (J+3 puis J+7 après la date "Devis envoyé le"). Ensuite le statut passe à "Sans réponse".
 * 3. onEdit : quand tu passes une ligne en "Devis envoyé", la date du jour se remplit toute seule.
 *
 * Installation : voir docs/CRM-DEVIS.md
 */

const ONGLET = "Demandes";
const TOKEN = "A_REMPLACER"; // même valeur que CRM_TOKEN dans Vercel
const EXPEDITEUR = "contact@agencelily.fr"; // alias "Envoyer en tant que" de ton Gmail
const SIGNATURE = "Sacha\nAgence Lily\n06 65 70 42 20";

const COLONNES = [
  "Reçu le", "Type", "Prénom", "E-mail", "Téléphone", "Événement", "Date événement",
  "Lieu", "Invités", "Formule", "Estimation", "Message", "Page d'origine",
  "Statut", "Devis envoyé le", "Relance 1", "Relance 2", "Montant", "Notes",
];
const STATUTS = ["Nouveau", "Devis envoyé", "Gagné", "Perdu", "Sans réponse", "Pas de relance"];
const col = (nom) => COLONNES.indexOf(nom) + 1;

/** À lancer une seule fois : crée l'onglet, les colonnes, la liste des statuts et le déclencheur du matin. */
function installer() {
  const ss = SpreadsheetApp.getActive();
  const sh = ss.getSheetByName(ONGLET) || ss.insertSheet(ONGLET);
  sh.getRange(1, 1, 1, COLONNES.length).setValues([COLONNES]).setFontWeight("bold");
  sh.setFrozenRows(1);
  const regle = SpreadsheetApp.newDataValidation().requireValueInList(STATUTS, true).build();
  sh.getRange(2, col("Statut"), 1000, 1).setDataValidation(regle);
  // Couleurs par statut
  const plage = sh.getRange(2, 1, 1000, COLONNES.length);
  const lettre = String.fromCharCode(64 + col("Statut"));
  const couleurs = { "Nouveau": "#fff4d6", "Devis envoyé": "#e3eefc", "Gagné": "#dff3e4", "Perdu": "#f3f3f3", "Sans réponse": "#fbe3e3" };
  sh.setConditionalFormatRules(Object.keys(couleurs).map((s) =>
    SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied(`=$${lettre}2="${s}"`).setBackground(couleurs[s]).setRanges([plage]).build()
  ));
  ScriptApp.getProjectTriggers().forEach((t) => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger("relancer").timeBased().everyDays(1).atHour(10).create();
  ScriptApp.newTrigger("auModification").forSpreadsheet(ss).onEdit().create();
}

/** Reçoit les demandes envoyées par le site. */
function doPost(e) {
  const d = JSON.parse(e.postData.contents || "{}");
  if (d.token !== TOKEN) return ContentService.createTextOutput("refusé");
  const sh = SpreadsheetApp.getActive().getSheetByName(ONGLET);
  const ligne = COLONNES.map(() => "");
  const poser = (nom, v) => (ligne[col(nom) - 1] = v || "");
  poser("Reçu le", new Date());
  poser("Type", d.type);
  poser("Prénom", d.prenom);
  poser("E-mail", d.email);
  poser("Téléphone", d.telephone ? "'" + d.telephone : "");
  poser("Événement", d.evenement);
  poser("Date événement", d.date ? "'" + d.date : "");
  poser("Lieu", d.lieu);
  poser("Invités", d.invites);
  poser("Formule", d.formule || d.pack);
  poser("Estimation", d.estimation);
  poser("Message", [d.message, d.config].filter(String).join("\n"));
  poser("Page d'origine", d.service);
  poser("Statut", "Nouveau");
  sh.appendRow(ligne);
  return ContentService.createTextOutput("ok");
}

/** Remplit "Devis envoyé le" quand le statut passe à "Devis envoyé". */
function auModification(e) {
  const r = e.range;
  if (r.getSheet().getName() !== ONGLET || r.getColumn() !== col("Statut") || r.getRow() < 2) return;
  const cellule = r.getSheet().getRange(r.getRow(), col("Devis envoyé le"));
  if (e.value === "Devis envoyé" && !cellule.getValue()) cellule.setValue(new Date());
}

/** Tous les matins : relance J+3 et J+7 après l'envoi du devis, si le client n'a pas répondu. */
function relancer() {
  const sh = SpreadsheetApp.getActive().getSheetByName(ONGLET);
  const lignes = sh.getDataRange().getValues();
  const jour = 86400000;
  const maintenant = Date.now();
  for (let i = 1; i < lignes.length; i++) {
    const l = lignes[i];
    const v = (nom) => l[col(nom) - 1];
    if (v("Type") !== "Devis" || v("Statut") !== "Devis envoyé" || !v("Devis envoyé le") || !v("E-mail") || !v("Date événement")) continue;
    if (repondu(v("E-mail"), new Date(v("Devis envoyé le")))) {
      sh.getRange(i + 1, col("Notes")).setValue(("Le client a répondu, relances stoppées. " + v("Notes")).trim());
      sh.getRange(i + 1, col("Statut")).setValue("Pas de relance");
      continue;
    }
    const ecoules = (maintenant - new Date(v("Devis envoyé le")).getTime()) / jour;
    if (ecoules >= 3 && !v("Relance 1")) {
      envoyer(v("E-mail"), MAILS[0], v);
      sh.getRange(i + 1, col("Relance 1")).setValue(new Date());
    } else if (ecoules >= 7 && v("Relance 1") && !v("Relance 2")) {
      envoyer(v("E-mail"), MAILS[1], v);
      sh.getRange(i + 1, col("Relance 2")).setValue(new Date());
      sh.getRange(i + 1, col("Statut")).setValue("Sans réponse");
    }
  }
}

/** Le client a-t-il écrit depuis l'envoi du devis ? (cherche dans ta boîte Gmail) */
function repondu(email, depuis) {
  const apres = Utilities.formatDate(depuis, "Europe/Paris", "yyyy/MM/dd");
  return GmailApp.search(`from:${email} after:${apres}`, 0, 1).length > 0;
}

const MAILS = [
  {
    objet: (v) => `Votre devis pour le ${v("Date événement")}`,
    texte: (v) => `Bonjour ${v("Prénom")},

Je voulais m'assurer que le devis est bien arrivé. Il se cache parfois dans les spams.

Si quelque chose vous fait hésiter, le prix, la formule ou l'organisation le jour J, dites-le moi simplement. On trouve presque toujours une solution.

${SIGNATURE}`,
  },
  {
    objet: (v) => `Votre date du ${v("Date événement")}`,
    texte: (v) => `Bonjour ${v("Prénom")},

Dernier petit mot de ma part, promis.

Les samedis partent vite et je préfère vous prévenir avant qu'un autre couple me demande le ${v("Date événement")}. Si le livre d'or vous tente toujours, un simple "on y va" par retour de mail suffit pour bloquer la date.

Et si votre projet a changé, aucun souci. Je vous souhaite une très belle fête.

${SIGNATURE}`,
  },
];

function envoyer(email, mail, v) {
  const options = { name: "Sacha · Agence Lily" };
  if (GmailApp.getAliases().indexOf(EXPEDITEUR) > -1) options.from = EXPEDITEUR;
  GmailApp.sendEmail(email, mail.objet(v), mail.texte(v), options);
}
