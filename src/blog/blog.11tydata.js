module.exports = {
  layout: "layouts/article.njk",
  tags: [],
  eleventyComputed: {
    permalink: (data) => `/blog/${data.page.fileSlug}/`,
  },
};
