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
  profil: "Profil (partenaire)",
  volume: "Mariages par an",
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

// Accusé de réception envoyé au client juste après sa demande (au nom de Sacha)
const TEL = "06 65 70 42 20";
function accuse(d, cadeau, partenaire) {
  const prenom = d.prenom;
  if (partenaire) {
    return {
      objet: "Votre demande de partenariat est bien arrivée",
      texte: `Bonjour ${prenom},

Merci pour votre message. Je vous rappelle sous 24 h pour voir comment on peut travailler ensemble.

Si vous voulez y jeter un œil avant, notre plaquette partenaires est ici :
https://www.agencelily.fr/assets/agence-lily-plaquette-partenaires.pdf

Et si c'est plus simple pour vous, appelez-moi directement au ${TEL}.

À très vite,
Sacha
Agence Lily`,
    };
  }
  if (cadeau) {
    return {
      objet: "Votre bon cadeau Agence Lily",
      texte: `Bonjour ${prenom},

Merci, c'est une très jolie idée de cadeau. Je vous envoie le bon et les modalités de paiement sous 24 h.

Une question en attendant, pour personnaliser le bon. Quels prénoms voulez-vous qu'on y écrive ? Répondez simplement à ce mail.

Sacha
Agence Lily
${TEL}`,
    };
  }
  return {
    objet: `Votre demande pour le ${d.date}, c'est bien reçu`,
    texte: `Bonjour ${prenom},

Merci pour votre message. Je regarde tout de suite si le ${d.date} est encore libre et je reviens vers vous sous 24 h avec un devis précis.

En attendant, une petite question qui m'aide beaucoup. Avez-vous déjà une idée de l'endroit où sera le livre d'or pendant la fête (près du bar, dans l'entrée, sur le passage du vin d'honneur…) ? Répondez simplement à ce mail, c'est moi qui lis.

Vous pouvez aussi m'appeler ou m'écrire sur WhatsApp au ${TEL}, c'est souvent plus rapide.

À très vite,
Sacha
Agence Lily`,
  };
}

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

  // Commande de bon cadeau : la date de l'événement n'est pas encore connue
  const cadeau = d.service === "bon-cadeau";
  // Demande de partenariat (lieu, wedding planner) : pas d'événement précis
  const partenaire = d.service === "partenariat";
  if (!d.prenom || (!d.date && !cadeau && !partenaire) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) {
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
        subject: cadeau ? `Commande de bon cadeau : ${d.formule || "formule à préciser"} (${d.prenom})` : partenaire ? `Demande de partenariat : ${d.lieu || "lieu à préciser"} (${d.prenom})` : `Demande de devis : ${d.evenement || "événement"} le ${d.date} (${d.prenom})`,
        text: texte,
        html,
      }),
    });
    if (!r.ok) {
      console.error("Resend", r.status, await r.text());
      return repondre(502, { ok: false, erreur: "envoi" });
    }

    // Annexes : un échec ne bloque jamais le client
    const annexes = [];
    // 1. Accusé de réception au client (désactivable avec ACCUSE_RECEPTION=off)
    if (process.env.ACCUSE_RECEPTION !== "off") {
      const ar = accuse(d, cadeau, partenaire);
      annexes.push(
        fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${cle}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: process.env.DEVIS_FROM || "Agence Lily <onboarding@resend.dev>",
            to: [d.email],
            reply_to: destinataire.split(",")[0].trim(),
            subject: ar.objet,
            text: ar.texte,
          }),
        })
      );
    }
    // 2. Ligne dans le CRM Google Sheet (Apps Script, voir docs/CRM-DEVIS.md)
    if (process.env.CRM_WEBHOOK_URL) {
      annexes.push(
        fetch(process.env.CRM_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: process.env.CRM_TOKEN || "", type: cadeau ? "Bon cadeau" : partenaire ? "Partenariat" : "Devis", ...d }),
          redirect: "follow",
        })
      );
    }
    const resultats = await Promise.allSettled(annexes);
    resultats.forEach((x, i) => {
      if (x.status === "rejected") console.error("annexe", i, x.reason);
      else if (!x.value.ok) x.value.text().then((t) => console.error("annexe", i, x.value.status, t));
    });
    return repondre(200, { ok: true });
  } catch (e) {
    console.error(e);
    return repondre(502, { ok: false, erreur: "envoi" });
  }
};
