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
  // Articles du blog, du plus récent au plus ancien
  eleventyConfig.addCollection("posts", (c) =>
    c.getFilteredByGlob("src/blog/*.md").sort((a, b) => b.date - a.date)
  );
  const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  eleventyConfig.addFilter("dateFr", (d) => {
    const date = new Date(d);
    return `${date.getUTCDate()} ${MOIS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
  });
  eleventyConfig.addFilter("isoDate", (d) => new Date(d).toISOString().slice(0, 10));
  eleventyConfig.addFilter("euros", (n) => `${n} €`);
  eleventyConfig.addFilter("json", (v) => JSON.stringify(v));

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
