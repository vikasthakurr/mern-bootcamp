// A tiny Markdown-to-HTML converter.
//
// We write this by hand (instead of installing a library) so students
// can see how text processing works line by line. It only supports the
// common basics: headings, bold, italic, links, lists, and paragraphs.
// That is plenty for a teaching project.

// Convert inline bits that can appear inside a line of text:
// **bold**, *italic*, and [text](url) links.
function convertInline(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") // **bold**
    .replace(/\*(.+?)\*/g, "<em>$1</em>") // *italic*
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>'); // [text](url)
}

// Convert a whole Markdown string into an HTML string.
function markdownToHtml(markdown) {
  // Split the text into lines so we can look at them one at a time.
  const lines = markdown.split("\n");

  const htmlParts = [];
  let inList = false; // are we currently inside a <ul>?

  // A small helper to close an open list when we leave it.
  function closeListIfOpen() {
    if (inList) {
      htmlParts.push("</ul>");
      inList = false;
    }
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();

    // Empty line -> blank space, close any open list.
    if (line === "") {
      closeListIfOpen();
      continue;
    }

    // Headings: #, ##, ### ...
    if (line.startsWith("#")) {
      closeListIfOpen();
      const level = line.match(/^#+/)[0].length; // how many # signs
      const text = line.slice(level).trim();
      htmlParts.push(`<h${level}>${convertInline(text)}</h${level}>`);
      continue;
    }

    // List items: lines starting with "- "
    if (line.startsWith("- ")) {
      if (!inList) {
        htmlParts.push("<ul>");
        inList = true;
      }
      const text = line.slice(2).trim();
      htmlParts.push(`<li>${convertInline(text)}</li>`);
      continue;
    }

    // Anything else is a normal paragraph.
    closeListIfOpen();
    htmlParts.push(`<p>${convertInline(line)}</p>`);
  }

  // Make sure we close a list if the file ended inside one.
  closeListIfOpen();

  // Join everything into one HTML string.
  return htmlParts.join("\n");
}

// Export so other files can use it: import { markdownToHtml } from "...";
export { markdownToHtml };
