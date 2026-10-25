// Check-list des animations de mariage : envoie le PDF par e-mail, programme 2 relances
// et prévient Agence Lily. Mêmes variables d'environnement que api/devis.js
// (RESEND_API_KEY, DEVIS_TO, DEVIS_FROM). Facultatif : RESEND_AUDIENCE_ID pour
// ranger le contact dans une audience Resend (envois groupés plus tard).

const SITE = "https://www.agencelily.fr";
const PDF = `${SITE}/assets/check-list-animations-mariage.pdf`;

function lireCorps(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return Object.fromEntries(new URLSearchParams(req.body));
  return {};
}

const nettoyer = (v) => String(v == null ? "" : v).trim().slice(0, 200);
const echapper = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

// Les 3 mails de la série (texte au nom de Sacha). {prenom} est remplacé à l'envoi.
const SERIE = [
  {
    delaiJours: 0,
    objet: "Votre check-list des animations de mariage",
    texte: `Bonjour {prenom},

Voici votre check-list, à garder sous la main jusqu'au jour J :
${PDF}

Elle tient sur deux pages. Imprimez-la, cochez au fur et à mesure, et ne laissez pas le vin d'honneur pour la fin (c'est le moment le plus long de la journée, et le plus souvent oublié).

Si une question vous trotte dans la tête, répondez simplement à ce mail. C'est moi qui lis.

Sacha
Agence Lily`,
  },
  {
    delaiJours: 3,
    objet: "Le moment que tout le monde oublie",
    texte: `Bonjour {prenom},

Une heure et demie.

C'est souvent la durée d'un vin d'honneur. Vos invités ont un verre à la main, vous êtes pris par les photos, et il ne se passe pas grand-chose.

C'est là que le livre d'or audio fait le plus de messages. Un téléphone vintage sur le passage, quelqu'un pour aller chercher les invités, et les gens vous parlent comme s'ils vous appelaient.

Tout est expliqué ici, avec les deux formules :
${SITE}/livre-d-or-audio-video/

Sacha

(Vous recevez ce mail car vous avez téléchargé la check-list. Un dernier suivra dans une semaine. Pour l'arrêter, répondez STOP.)`,
  },
  {
    delaiJours: 10,
    objet: "Votre date est-elle encore libre ?",
    texte: `Bonjour {prenom},

Dernier petit mot, promis.

Les samedis de mai à septembre partent vite. Si un livre d'or audio ou vidéo vous tente, envoyez-moi votre date, je vous réponds sous 24 h avec un devis précis :
${SITE}/devis/

Essentiel à 200 €, Signature à 500 € avec la vidéo et une heure d'animation. Livré et installé chez vous, à Paris et en Île-de-France.

Belle préparation,
Sacha

(Vous recevez ce mail car vous avez téléchargé la check-list sur agencelily.fr. C'est le dernier de la série.)`,
  },
];

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok: false });
  const corps = lireCorps(req);
  if (nettoyer(corps.site_web)) return res.status(200).json({ ok: true }); // champ piège

  const prenom = nettoyer(corps.prenom) || "";
  const email = nettoyer(corps.email);
  const date = nettoyer(corps.date);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ ok: false, erreur: "email" });

  const cle = process.env.RESEND_API_KEY;
  if (!cle) return res.status(500).json({ ok: false, erreur: "config" });
  const from = process.env.DEVIS_FROM || "Agence Lily <onboarding@resend.dev>";
  const equipe = (process.env.DEVIS_TO || "contact@agencelily.fr").split(",").map((s) => s.trim());
  const envoyer = (body) =>
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${cle}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

  try {
    // 1. Le mail avec le PDF (indispensable)
    const premier = SERIE[0];
    const r = await envoyer({ from, to: [email], reply_to: equipe[0], subject: premier.objet, text: premier.texte.replace("{prenom}", prenom || "") });
    if (!r.ok) {
      console.error("Resend", r.status, await r.text());
      return res.status(502).json({ ok: false, erreur: "envoi" });
    }

    // 2. Les relances programmées et la notification : un échec ne bloque pas l'utilisateur
    const maintenant = Date.now();
    const annexes = SERIE.slice(1).map((m) =>
      envoyer({
        from, to: [email], reply_to: equipe[0], subject: m.objet,
        text: m.texte.replace("{prenom}", prenom || ""),
        scheduled_at: new Date(maintenant + m.delaiJours * 86400000).toISOString(),
      })
    );
    annexes.push(
      envoyer({
        from, to: equipe, reply_to: email,
        subject: `Nouveau contact check-list : ${prenom || email}${date ? ` (mariage le ${date})` : ""}`,
        text: `Prénom : ${prenom}\nE-mail : ${email}\nDate du mariage : ${date || "non précisée"}\n\nIl ou elle recevra 2 relances automatiques (J+3 et J+10).`,
        html: `<p>Prénom : <strong>${echapper(prenom)}</strong><br>E-mail : <strong>${echapper(email)}</strong><br>Date du mariage : <strong>${echapper(date || "non précisée")}</strong></p><p>2 relances automatiques programmées (J+3 et J+10).</p>`,
      })
    );
    if (process.env.RESEND_AUDIENCE_ID) {
      annexes.push(
        fetch(`https://api.resend.com/audiences/${process.env.RESEND_AUDIENCE_ID}/contacts`, {
          method: "POST",
          headers: { Authorization: `Bearer ${cle}`, "Content-Type": "application/json" },
          body: JSON.stringify({ email, first_name: prenom, unsubscribed: false }),
        })
      );
    }
    const resultats = await Promise.allSettled(annexes);
    resultats.forEach((x, i) => {
      if (x.status === "rejected") console.error("annexe", i, x.reason);
      else if (!x.value.ok) x.value.text().then((t) => console.error("annexe", i, x.value.status, t));
    });
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(502).json({ ok: false, erreur: "envoi" });
  }
};
