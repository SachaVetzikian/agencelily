module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/robots.txt");

  // Services d'une catégorie ("animations" ou "location")
  eleventyConfig.addFilter("byCategorie", (services, cat) =>
    services.filter((s) => s.categorie === cat)
  );
  // Retrouve un service ou un événement par son slug
  eleventyConfig.addFilter("findBySlug", (items, slug) =>
    items.find((i) => i.slug === slug)
  );
  // Événements pour lesquels un service est recommandé
  eleventyConfig.addFilter("eventsFor", (evenements, slug) =>
    evenements.filter((e) => e.services.some((s) => s.slug === slug))
  );
  eleventyConfig.addFilter("euros", (n) => `${n} €`);
  eleventyConfig.addFilter("json", (v) => JSON.stringify(v));

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
