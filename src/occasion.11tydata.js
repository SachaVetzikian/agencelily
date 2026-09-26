// Titre et meta calculés en JS pour éviter le double échappement HTML
module.exports = {
  eleventyComputed: {
    title: (data) => data.o.title,
    meta: (data) => data.o.meta,
  },
};
