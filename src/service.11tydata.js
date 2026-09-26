// Titre et meta calculés en JS pour éviter le double échappement HTML
module.exports = {
  eleventyComputed: {
    title: (data) => data.s.title,
    meta: (data) => data.s.meta,
  },
};
