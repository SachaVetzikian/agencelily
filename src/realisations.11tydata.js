// La page n'est générée que s'il existe au moins une réalisation (évite une page vide indexée)
module.exports = {
  eleventyComputed: {
    permalink: (data) => (data.realisations && data.realisations.length ? "/realisations/" : false),
  },
};
