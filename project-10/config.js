// Central settings for the site generator.
// Keeping them in one file means we don't repeat folder names everywhere.
// We use "export default" so other files can import it.
export default {
  siteName: "ForgeSite",

  // Where our Markdown content lives.
  contentDir: "content",

  // Where static files (css, images) live.
  staticDir: "static",

  // Where the finished website is written.
  outputDir: "public",

  // The layout template file (one HTML shell for every page).
  templateFile: "templates/layout.html",

  // Port used by the preview server.
  port: 3000,
};
