// A tiny preview server using Express.
// It serves the files from the output folder so you can open the
// built site in a browser. This is the one place we use Express.

import express from "express";
import fs from "fs";

import config from "../config.js";

export function serve() {
  // If the site hasn't been built yet, tell the user to build first.
  if (!fs.existsSync(config.outputDir)) {
    console.log(`No "${config.outputDir}" folder yet. Run "build" first.`);
    return;
  }

  const app = express();

  // express.static serves every file in the output folder directly.
  // So /style.css, /index.html, etc. all just work.
  app.use(express.static(config.outputDir));

  // Start listening on the port from config.
  app.listen(config.port, () => {
    console.log(`Preview running at http://localhost:${config.port}`);
    console.log("Press Ctrl+C to stop.");
  });
}
