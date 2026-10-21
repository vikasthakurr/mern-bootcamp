// The template renderer.
//
// A template is one HTML file with placeholders like {{title}} and
// {{content}}. This function swaps those placeholders for real values.
// It's a simple example of string replacement, a common Node task.

// Replace every {{key}} in the template with values[key].
// Example: render("<h1>{{title}}</h1>", { title: "Hi" }) -> "<h1>Hi</h1>"
function render(template, values) {
  let output = template;

  // Go through each key in the values object and replace its placeholder.
  for (const key of Object.keys(values)) {
    // A global regex so we replace EVERY {{key}}, not just the first.
    const placeholder = new RegExp(`{{\\s*${key}\\s*}}`, "g");
    output = output.replace(placeholder, values[key]);
  }

  return output;
}

export { render };
