// Titre et meta calculés en JS pour éviter le double échappement HTML
module.exports = {
  eleventyComputed: {
    title: (data) => `Animation mariage ${data.d.nom} (${data.d.code}) | Agence Lily`,
    meta: (data) =>
      `Bar à crêpes, livre d'or audio, mur cascade et photobooth pour votre mariage ${data.d.en} (${data.d.code}). Livré et installé, pack mariage dès 750 €, devis sous 24h.`,
  },
};
