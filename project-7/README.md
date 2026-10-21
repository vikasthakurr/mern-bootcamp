# WishFlow — Wishlist & Smart Filter

A small React app focused on **React Hooks & State Management**. Browse a product
catalog, save favorites to a persistent wishlist, and refine the view with smart
filtering and sorting.

## Hooks showcased

| Hook | Where | What it does |
| --- | --- | --- |
| `useState` | `App.jsx`, `Navbar` | filters and view toggle |
| `useReducer` | `context/WishlistContext.jsx` | all wishlist mutations (toggle / remove / clear) |
| `useContext` | `useWishlist()` | shares the wishlist store across components |
| `useMemo` | `App.jsx` | memoized filter + sort pipeline (derived state) |
| `useEffect` | `useLocalStorage`, context | persistence + storage sync |
| custom hook | `hooks/useLocalStorage.js` | `useState` that persists to `localStorage` |

## Features

- **Smart filter**: text search (name/category/tags), category, max price, min
  rating, and in-stock-only.
- **Smart sort**: featured, price ↑/↓, top rated, name A→Z, newest.
- **Wishlist**: toggle with the ♡ button; count in the navbar; a dedicated
  wishlist view that is itself filterable/sortable.
- **Persistence**: the wishlist survives reloads via `localStorage`.

## Run

```bash
npm install
npm run dev
```

Then open the printed local URL. Build with `npm run build`.

## Stack

React 18 · Vite · Tailwind CSS
