# KanbanHub — A Manager's Tool

A simple Kanban board (To Do / In Progress / Done) built for teaching
**React Performance** and **Redux Toolkit**. Same beginner-friendly coding
style as the other cohort projects.

## What students learn

### Redux Toolkit (state management)

- **store**: one central place that holds all app state (`src/store/store.js`).
- **slice**: state + the reducers that change it (`src/store/boardSlice.js`),
  with actions `addCard`, `moveCard`, `deleteCard`.
- **Provider**: makes the store available to every component (`src/main.jsx`).
- **useSelector / useDispatch**: read state and send actions from components.
- **normalized state**: cards are stored by id and columns keep a list of ids,
  so moving a card is just editing id lists.

### React performance

- **React.memo** (`Card.jsx`): a card only re-renders when its own props change.
- **useCallback** (`Column.jsx`): keeps the `onMove` / `onDelete` functions
  stable so `React.memo` actually works.
- **useMemo** (`StatsBar.jsx`): caches a calculation so it doesn't run on
  every render.
- **memoized selectors** with `createSelector` (`selectors.js`): derived data
  (the full board, counts) is only recomputed when inputs change.

## See performance in action

1. Run the app and open the browser console.
2. Each card logs `Rendering card: ...` when it renders.
3. Add or move ONE card and watch the console: only the cards that actually
   changed re-render. That's `React.memo` + `useCallback` working together.
4. Try removing `React.memo` from `Card.jsx` and repeat — now every card
   logs on every change. A clear before/after lesson.

## Run it

```bash
npm install
npm run dev
```

## Project structure

```
src/
  main.jsx                # wraps app in the Redux <Provider>
  App.jsx                 # reads the board, renders columns
  index.css               # Tailwind styles
  data/
    seed.js               # starting columns + cards (normalized)
  store/
    store.js              # the Redux store
    boardSlice.js         # state + reducers (add/move/delete)
    selectors.js          # memoized selectors (createSelector)
  components/
    Navbar.jsx
    StatsBar.jsx          # useMemo + memoized selectors
    AddCardForm.jsx       # useDispatch to add a card
    Column.jsx            # useCallback for stable handlers
    Card.jsx              # React.memo
```
