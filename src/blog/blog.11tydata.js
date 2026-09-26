// Les articles marqués "draft: true" ne sont ni publiés ni listés (gardés pour la stratégie suivante)
module.exports = {
  layout: "layouts/article.njk",
  eleventyComputed: {
    permalink: (data) => (data.draft ? false : `/blog/${data.page.fileSlug}/`),
    eleventyExcludeFromCollections: (data) => !!data.draft,
  },
};
