// Formulaire de devis : reçoit la demande et l'envoie par e-mail via Resend (resend.com).
// Variables d'environnement à définir dans Vercel (Settings > Environment Variables) :
//   RESEND_API_KEY  clé API Resend (obligatoire)
//   DEVIS_TO        adresse qui reçoit les demandes (par défaut contact@agencelily.fr)
//   DEVIS_FROM      expéditeur, par défaut "Agence Lily <onboarding@resend.dev>"
//                   (sans domaine vérifié, Resend n'envoie qu'à l'adresse du compte)

const CHAMPS = {
  prenom: "Prénom",
  email: "E-mail",
  telephone: "Téléphone",
  date: "Date de l'événement",
  evenement: "Événement",
  lieu: "Ville ou lieu",
  invites: "Nombre d'invités",
  formule: "Formule",
  message: "Message",
  config: "Sélection du simulateur",
  estimation: "Estimation",
  service: "Page d'origine (service)",
  pack: "Pack demandé",
};

function lireCorps(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return Object.fromEntries(new URLSearchParams(req.body));
  return {};
}

const nettoyer = (v) => String(v == null ? "" : v).trim().slice(0, 2000);
const echapper = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

module.exports = async function handler(req, res) {
  const json = /application\/json/.test(req.headers["accept"] || "") || /application\/json/.test(req.headers["content-type"] || "");
  const repondre = (code, data) => {
    if (json) return res.status(code).json(data);
    // Envoi sans JavaScript : retour à la page merci, ou à la page devis en cas d'erreur
    res.setHeader("Location", code === 200 ? "/merci/" : "/devis/?erreur=1");
    return res.status(303).end();
  };

  if (req.method !== "POST") return res.status(405).json({ ok: false });

  const corps = lireCorps(req);
  // Champ piège invisible : rempli uniquement par les robots
  if (nettoyer(corps.site_web)) return repondre(200, { ok: true });

  const d = {};
  for (const k of Object.keys(CHAMPS)) d[k] = nettoyer(corps[k]);

  if (!d.prenom || !d.date || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) {
    return repondre(400, { ok: false, erreur: "champs" });
  }

  const cle = process.env.RESEND_API_KEY;
  const destinataire = process.env.DEVIS_TO || "contact@agencelily.fr";
  if (!cle) return repondre(500, { ok: false, erreur: "config" });

  // Date au format français (12/06/2027)
  const m = d.date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) d.date = `${m[3]}/${m[2]}/${m[1]}`;

  const lignes = Object.entries(CHAMPS).filter(([k]) => d[k]);
  const texte = lignes.map(([k, nom]) => `${nom} : ${d[k]}`).join("\n");
  const html = `<table cellpadding="6" style="font-family:Arial,sans-serif;font-size:15px;border-collapse:collapse">${lignes
    .map(([k, nom]) => `<tr><td style="color:#6f655e;vertical-align:top">${nom}</td><td><strong>${echapper(d[k]).replace(/\n/g, "<br>")}</strong></td></tr>`)
    .join("")}</table>`;

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${cle}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.DEVIS_FROM || "Agence Lily <onboarding@resend.dev>",
        to: destinataire.split(",").map((s) => s.trim()),
        reply_to: d.email,
        subject: `Demande de devis : ${d.evenement || "événement"} le ${d.date} (${d.prenom})`,
        text: texte,
        html,
      }),
    });
    if (!r.ok) {
      console.error("Resend", r.status, await r.text());
      return repondre(502, { ok: false, erreur: "envoi" });
    }
    return repondre(200, { ok: true });
  } catch (e) {
    console.error(e);
    return repondre(502, { ok: false, erreur: "envoi" });
  }
};
