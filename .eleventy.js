const Image = require("@11ty/eleventy-img");

// Optimisation des photos distantes (Unsplash, etc.) au moment du build :
// téléchargées, converties en WebP en 3 tailles et servies depuis le site.
// Si le téléchargement échoue, l'image distante d'origine est conservée.
const imgCache = new Map();
function optimize(src) {
  if (!imgCache.has(src)) {
    imgCache.set(
      src,
      Image(src, {
        widths: [480, 960, 1600],
        formats: ["webp"],
        outputDir: "_site/img/",
        urlPath: "/img/",
        sharpWebpOptions: { quality: 72 },
        cacheOptions: { duration: "30d" },
      }).catch(() => {
        console.warn(`[images] téléchargement impossible, image distante conservée : ${src}`);
        return null;
      })
    );
  }
  return imgCache.get(src);
}

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
    c.getFilteredByGlob("src/blog/*.md").filter((p) => !p.data.draft).sort((a, b) => b.date - a.date)
  );
  const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  eleventyConfig.addFilter("dateFr", (d) => {
    const date = new Date(d);
    return `${date.getUTCDate()} ${MOIS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
  });
  eleventyConfig.addFilter("isoDate", (d) => new Date(d).toISOString().slice(0, 10));
  // URL d'un service : URL dédiée si définie (livre d'or), sinon /categorie/slug/
  eleventyConfig.addFilter("serviceUrl", (s) => (s && s.url) || `/${s.categorie}/${s.slug}/`);
  eleventyConfig.addFilter("euros", (n) => `${n} €`);
  eleventyConfig.addFilter("json", (v) => JSON.stringify(v));

  eleventyConfig.addTransform("images-webp", async function (content, outputPath) {
    if (!outputPath || !outputPath.endsWith(".html")) return content;
    const tags = content.match(/<img\b[^>]*\ssrc="https?:\/\/[^"]+"[^>]*>/g);
    if (!tags) return content;
    for (const tag of new Set(tags)) {
      const src = tag.match(/\ssrc="([^"]+)"/)[1];
      const meta = await optimize(src);
      if (!meta || !meta.webp) continue;
      const sizes = meta.webp;
      const largest = sizes[sizes.length - 1];
      let out = tag.replace(/\ssrc="[^"]+"/, ` src="${largest.url}" srcset="${sizes.map((s) => `${s.url} ${s.width}w`).join(", ")}"`);
      if (!/\ssizes=/.test(out)) out = out.replace(/<img\b/, '<img sizes="(max-width: 700px) 100vw, 50vw"');
      if (!/\swidth=/.test(out)) out = out.replace(/<img\b/, `<img width="${largest.width}" height="${largest.height}"`);
      content = content.split(tag).join(out);
    }
    return content;
  });

  // Typographie française : apostrophe courbe (’) dans le texte visible uniquement
  eleventyConfig.addTransform("apostrophes", function (content, outputPath) {
    if (!outputPath || !outputPath.endsWith(".html")) return content;
    return content.replace(/(<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>)|([^<]+)/g, (m, tag, text) =>
      tag ? tag : text.replace(/(\p{L})'(?=\p{L})/gu, "$1’").replace(/(\p{L})&#39;(?=\p{L})/gu, "$1’")
    );
  });

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
