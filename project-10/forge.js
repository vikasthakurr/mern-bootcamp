// The command-line entry point for ForgeSite.
//
// You run it like:  node forge.js build
// Here we read the command the user typed and call the right function.
// This teaches process.argv (the list of command-line arguments).

import { build, clean } from "./lib/builder.js";
import { serve } from "./lib/server.js";

// process.argv looks like:
//   [ "node", "forge.js", "build" ]
// So the actual command is the THIRD item (index 2).
const command = process.argv[2];

// Print a short help message.
function showHelp() {
  console.log("ForgeSite - a tiny static site generator");
  console.log("");
  console.log("Usage: node forge.js <command>");
  console.log("");
  console.log("Commands:");
  console.log("  build    Turn Markdown in content/ into a site in public/");
  console.log("  serve    Start a preview server for the built site");
  console.log("  clean    Delete the public/ output folder");
}

// Decide what to do based on the command.
switch (command) {
  case "build":
    build();
    break;
  case "serve":
    serve();
    break;
  case "clean":
    clean();
    break;
  default:
    // No command, or an unknown one -> show help.
    showHelp();
}
