# ForgeSite — A Static Site Generator

A small command-line tool that turns Markdown files into a website.
Built to teach **Node.js fundamentals** with plain, readable code.

## What students learn

- **fs module** — read and write files, make and remove folders, copy files
- **path module** — build file paths that work on any operating system
- **process.argv** — read commands typed in the terminal (the CLI)
- **modules** — split code into files with `import` / `export` (ES modules)
- **string processing** — a hand-written Markdown-to-HTML converter
- **Express (a peek)** — a tiny preview server with `express.static`

## How it works

```
content/*.md   ->   [ ForgeSite ]   ->   public/*.html
                         ^
                   templates/layout.html  (one shell for every page)
                   static/*               (copied as-is: CSS, images)
```

1. Read the layout template once.
2. For each `.md` file: read it, convert Markdown to HTML, drop it into
   the template, and write the finished `.html` page to `public/`.
3. Copy everything from `static/` into `public/`.

## Commands

```bash
npm install          # install Express (used only for the preview server)

node forge.js build  # build the site into public/
node forge.js serve  # preview it at http://localhost:3000
node forge.js clean  # delete the public/ folder
```

There are also npm script shortcuts: `npm run build`, `npm run serve`,
`npm run clean`.

## Project structure

```
forge.js              # CLI entry point (reads process.argv)
config.js             # folder names and settings in one place
templates/
  layout.html         # the HTML shell with {{title}} {{content}} slots
content/
  index.md            # pages written in Markdown
  about.md
static/
  style.css           # copied straight into the output
lib/
  markdown.js         # Markdown -> HTML (written by hand)
  template.js         # fills {{placeholders}} in the template
  builder.js          # the main build logic (fs + path)
  server.js           # Express preview server
public/               # the generated site (created by "build")
```

## Try it

1. `npm install`
2. `node forge.js build`
3. `node forge.js serve` and open http://localhost:3000
4. Edit a file in `content/`, run `build` again, and refresh.
