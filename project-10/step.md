# ForgeSite — Build Steps (Teaching Order)

Follow these steps in order. Each step says **which file to create**, **why**,
and **what command to run**. Build the project live, one file at a time.

> Tip: run `node forge.js` (with no command) any time to see the help menu.

---

## Step 0 — Create the project folder

```bash
mkdir project-10
cd project-10
```

Everything below happens inside this folder.

---

## Step 1 — `package.json`

**Create first.** This defines the project, turns on ES modules, and lists
Express as a dependency.

The important line is:

```json
"type": "module"
```

This is what lets us use `import` / `export` instead of `require`.

**Run:**

```bash
npm install
```

This creates `node_modules/` and installs Express.

---

## Step 2 — `.gitignore`

Keep generated and installed files out of git.

```
node_modules
public
.DS_Store
```

Nothing to run here.

---

## Step 3 — `config.js`

One place for all the folder names and settings, so we never repeat them.
Exported with `export default` so every other file can import it.

Teaches: `export default`.

Nothing to run yet.

---

## Step 4 — `templates/layout.html`

The single HTML shell used for every page. It has placeholders:
`{{title}}`, `{{siteName}}`, `{{content}}`.

Teaches: the idea of a template with slots to fill in.

Nothing to run yet.

---

## Step 5 — `content/index.md` and `content/about.md`

The pages, written in Markdown. These are the INPUT to our generator.

Create a `content/` folder with two files:

- `content/index.md`
- `content/about.md`

Nothing to run yet.

---

## Step 6 — `static/style.css`

Plain CSS for the site. The builder copies this straight into the output.

Teaches: not everything needs processing — some files are just copied.

Nothing to run yet.

---

## Step 7 — `lib/markdown.js`

Converts Markdown text into HTML (headings, bold, italic, links, lists).
Written by hand so students see the string processing.

Teaches: string methods, regex, `export`.

**Quick test (optional):**

```bash
node -e "import('./lib/markdown.js').then(m => console.log(m.markdownToHtml('# Hi\n- one\n- two')))"
```

You should see `<h1>Hi</h1>` and a `<ul>` list printed.

---

## Step 8 — `lib/template.js`

Fills the `{{placeholders}}` in the layout with real values.

Teaches: `String.replace` with a global regex, `export`.

Nothing to run yet (used by the builder next).

---

## Step 9 — `lib/builder.js`

The heart of the project. Uses the `fs` and `path` core modules to:

1. read the template,
2. read each `.md` file,
3. convert it and fill the template,
4. write the `.html` page,
5. copy the static files.

It exports `build()` and `clean()`.

Teaches: `fs.readFileSync`, `fs.writeFileSync`, `fs.readdirSync`,
`fs.mkdirSync`, `fs.copyFileSync`, `fs.rmSync`, and `path.join` /
`path.basename`.

Nothing to run yet (needs the CLI to call it).

---

## Step 10 — `lib/server.js`

A tiny preview server using Express and `express.static`.
Exports `serve()`.

Teaches: a first look at Express.

Nothing to run yet (needs the CLI).

---

## Step 11 — `forge.js` (the CLI entry point)

**Create last.** This ties everything together. It reads the command the
user typed with `process.argv` and calls `build()`, `serve()`, or `clean()`.

Teaches: `process.argv`, `switch`, importing from other files.

**Now run the whole thing:**

```bash
node forge.js build     # Markdown in content/ -> site in public/
node forge.js serve     # preview at http://localhost:3000
node forge.js clean     # delete the public/ folder
```

Shortcuts (from package.json scripts):

```bash
npm run build
npm run serve
npm run clean
```

---

## Full build order at a glance

| # | File                   | Why it comes here                        | Run after        |
| - | ---------------------- | ---------------------------------------- | ---------------- |
| 1 | `package.json`         | project + ES modules + dependency        | `npm install`    |
| 2 | `.gitignore`           | ignore node_modules and output           | —                |
| 3 | `config.js`            | shared settings                          | —                |
| 4 | `templates/layout.html`| the page shell with placeholders         | —                |
| 5 | `content/*.md`         | the input pages                          | —                |
| 6 | `static/style.css`     | styling, copied as-is                    | —                |
| 7 | `lib/markdown.js`      | Markdown -> HTML                         | optional node -e |
| 8 | `lib/template.js`      | fill the placeholders                    | —                |
| 9 | `lib/builder.js`       | the main fs/path logic                   | —                |
| 10| `lib/server.js`        | Express preview                          | —                |
| 11| `forge.js`             | CLI that runs everything                 | `node forge.js build` |

---

## Final check

```bash
node forge.js build
node forge.js serve
```

Open http://localhost:3000 — you should see the Home and About pages,
styled with the CSS. Edit a file in `content/`, run `build` again, and
refresh the browser to see it update.
