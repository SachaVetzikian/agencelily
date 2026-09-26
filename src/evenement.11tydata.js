// Titre et meta calculés en JS pour éviter le double échappement HTML
module.exports = {
  eleventyComputed: {
    title: (data) => data.e.title,
    meta: (data) => data.e.meta,
  },
};
