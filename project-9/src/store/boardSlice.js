import { createSlice } from "@reduxjs/toolkit";
import { columns, cards } from "../data/seed.js";

// A "slice" is one piece of the Redux store.
// It holds some state + the functions (reducers) that change it.

// The whole board state lives here.
// "history" stores past versions of the board so we can UNDO.
const initialState = {
  columns: columns, // the 3 columns with their card-id lists
  cards: cards, // all cards, looked up by id
  history: [], // snapshots of {columns, cards} before each change
};

// Helper: save the current board into history before we change it.
// We make a deep copy so the snapshot doesn't change later.
// We keep only the last 20 snapshots so the list can't grow forever.
function saveHistory(state) {
  state.history.push({
    columns: JSON.parse(JSON.stringify(state.columns)),
    cards: JSON.parse(JSON.stringify(state.cards)),
  });
  if (state.history.length > 20) {
    state.history.shift(); // drop the oldest one
  }
}

const boardSlice = createSlice({
  name: "board",
  initialState,
  // Reducers describe HOW the state changes.
  // With Redux Toolkit we can "mutate" state directly here,
  // because it uses Immer behind the scenes to keep it safe.
  reducers: {
    // Move a card from one column to another.
    moveCard: (state, action) => {
      const { cardId, fromColumnId, toColumnId } = action.payload;
      if (fromColumnId === toColumnId) return; // nothing to do

      saveHistory(state); // remember the board so we can undo

      const from = state.columns.find((col) => col.id === fromColumnId);
      const to = state.columns.find((col) => col.id === toColumnId);

      // Remove the card id from the old column...
      from.cardIds = from.cardIds.filter((id) => id !== cardId);
      // ...and add it to the end of the new column.
      to.cardIds.push(cardId);
    },

    // Add a brand new card to the "To Do" column.
    addCard: (state, action) => {
      const { title, assignee, priority } = action.payload;

      saveHistory(state);

      const id = "c" + Date.now(); // simple unique id

      // Save the card in the cards object.
      state.cards[id] = { id, title, assignee, priority };

      // Put its id at the top of the To Do column.
      const todo = state.columns.find((col) => col.id === "todo");
      todo.cardIds.unshift(id);
    },

    // Edit an existing card's details.
    editCard: (state, action) => {
      const { id, title, assignee, priority } = action.payload;
      const card = state.cards[id];
      if (!card) return;

      saveHistory(state);

      card.title = title;
      card.assignee = assignee;
      card.priority = priority;
    },

    // Delete a card completely.
    deleteCard: (state, action) => {
      const { cardId } = action.payload;

      saveHistory(state);

      // Remove the card id from whichever column holds it.
      state.columns.forEach((col) => {
        col.cardIds = col.cardIds.filter((id) => id !== cardId);
      });

      // Remove the card object itself.
      delete state.cards[cardId];
    },

    // Undo: go back to the most recent saved snapshot.
    undo: (state) => {
      const last = state.history.pop();
      if (!last) return; // nothing to undo

      state.columns = last.columns;
      state.cards = last.cards;
    },
  },
});

// Redux Toolkit creates the action creators for us automatically.
export const { moveCard, addCard, editCard, deleteCard, undo } =
  boardSlice.actions;

// The reducer is what we give to the store.
export default boardSlice.reducer;
