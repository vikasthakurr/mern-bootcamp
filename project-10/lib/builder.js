// The builder: this is the heart of the generator.
// It reads Markdown files, turns them into HTML pages, and writes
// the finished site into the output folder. This is where we use
// the Node core modules fs and path the most.

import fs from "fs";
import path from "path";

import config from "../config.js";
import { markdownToHtml } from "./markdown.js";
import { render } from "./template.js";

// Make a title from a file name: "about.md" -> "About"
function titleFromFileName(fileName) {
  const base = path.basename(fileName, ".md"); // drop the ".md"
  // Capitalize the first letter so it looks nicer.
  return base.charAt(0).toUpperCase() + base.slice(1);
}

// Copy every file from one folder into another.
// Used to copy the static folder (CSS, images) into the output.
function copyFolder(fromDir, toDir) {
  if (!fs.existsSync(fromDir)) return; // nothing to copy

  // Make sure the destination folder exists.
  fs.mkdirSync(toDir, { recursive: true });

  // Read the list of files and copy them one by one.
  const files = fs.readdirSync(fromDir);
  for (const file of files) {
    const fromPath = path.join(fromDir, file);
    const toPath = path.join(toDir, file);
    fs.copyFileSync(fromPath, toPath);
    console.log("  copied:", file);
  }
}

// Build the whole site.
export function build() {
  console.log("Building site...");

  // 1. Read the layout template once (we reuse it for every page).
  const template = fs.readFileSync(config.templateFile, "utf-8");

  // 2. Make sure the output folder exists and is empty-ish.
  fs.mkdirSync(config.outputDir, { recursive: true });

  // 3. Read all the Markdown files in the content folder.
  const files = fs
    .readdirSync(config.contentDir)
    .filter((file) => file.endsWith(".md"));

  if (files.length === 0) {
    console.log("No .md files found in", config.contentDir);
    return;
  }

  // 4. Turn each Markdown file into an HTML page.
  for (const file of files) {
    const filePath = path.join(config.contentDir, file);

    // Read the Markdown text from disk.
    const markdown = fs.readFileSync(filePath, "utf-8");

    // Convert Markdown -> HTML body.
    const bodyHtml = markdownToHtml(markdown);

    // Fill the layout template with this page's values.
    const page = render(template, {
      title: titleFromFileName(file),
      siteName: config.siteName,
      content: bodyHtml,
    });

    // Work out the output file name: "about.md" -> "about.html"
    const outName = path.basename(file, ".md") + ".html";
    const outPath = path.join(config.outputDir, outName);

    // Write the finished HTML page to disk.
    fs.writeFileSync(outPath, page);
    console.log("  page:", outName);
  }

  // 5. Copy the static files (CSS, etc.) into the output folder.
  copyFolder(config.staticDir, config.outputDir);

  console.log(`Done. Site written to the "${config.outputDir}" folder.`);
}

// Delete the output folder (used by the "clean" command).
export function clean() {
  if (fs.existsSync(config.outputDir)) {
    fs.rmSync(config.outputDir, { recursive: true, force: true });
    console.log(`Removed the "${config.outputDir}" folder.`);
  } else {
    console.log("Nothing to clean.");
  }
}
