// Page en noindex et hors sitemap tant qu'aucun prestataire n'est renseigné (évite une page vide indexée)
module.exports = {
  eleventyComputed: {
    robots: (data) => (data.prestataires && data.prestataires.length ? undefined : "noindex, follow"),
  },
};
