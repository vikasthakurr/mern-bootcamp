# CatalogX — E-Commerce Product Catalog

A beginner-friendly React product catalog built with **Vite** and **Tailwind CSS**.
It sticks to React foundations: components, props, `useState`, list rendering,
and event handlers. No routing, context, or external state libraries.

## Features

- Product grid rendered from a static data array
- Search by product name
- Filter by category
- Sort by price or rating
- Add to cart with quantity merging, remove items, and clear cart
- Live cart totals (item count + price)
- Responsive layout and empty states

## Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build into `dist/`
- `npm run preview` — preview the production build

## Project structure

```
project-6/
├─ index.html
├─ package.json
├─ vite.config.js
├─ tailwind.config.js
├─ postcss.config.js
└─ src/
   ├─ main.jsx            # React entry point
   ├─ App.jsx             # State + layout wiring
   ├─ index.css           # Tailwind directives
   ├─ data/products.js    # Static product list
   └─ components/
      ├─ Navbar.jsx
      ├─ FilterBar.jsx
      ├─ ProductList.jsx
      ├─ ProductCard.jsx
      └─ CartSummary.jsx
```
