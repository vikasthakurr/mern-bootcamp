import { createSelector } from "@reduxjs/toolkit";

// Selectors are small functions that "select" (read) a piece of state.
// Keeping them here means components don't need to know the state shape.

// Basic selectors: just read raw state.
export const selectColumns = (state) => state.board.columns;
export const selectCards = (state) => state.board.cards;

// Filter selectors (with ?? so a missing slice can't crash during reloads).
export const selectSearch = (state) => state.filter?.search ?? "";
export const selectPriority = (state) => state.filter?.priority ?? "all";
export const selectAssignee = (state) => state.filter?.assignee ?? "all";

// True when there is at least one snapshot we can undo back to.
export const selectCanUndo = (state) => state.board.history.length > 0;

// Read the whole attendance map ({ memberId: status }).
export const selectAttendance = (state) => state.attendance?.byId ?? {};

// Get one member's status, defaulting to "present" if not set yet.
export const selectMemberStatus = (memberId) => (state) =>
  state.attendance?.byId?.[memberId] ?? "present";

// A memoized selector built with createSelector.
// "Memoized" means: it only re-calculates when its inputs change.
//
// Here we build the full board (each column with its real card objects).
// Without memoization, this list would be rebuilt on every render,
// which can make the app slow. createSelector caches the result and
// returns the same object until columns or cards actually change.
export const selectBoard = createSelector(
  [selectColumns, selectCards],
  (columns, cards) => {
    return columns.map((col) => ({
      id: col.id,
      title: col.title,
      cards: col.cardIds.map((id) => cards[id]),
    }));
  },
);

// A memoized selector that filters the board by ALL active filters:
// the search text, the chosen priority, and the chosen assignee.
// Because it is memoized, it only re-runs when the board or any
// filter changes, not on every render. This is the heart of the
// "combine several filters in one place" lesson.
export const selectFilteredBoard = createSelector(
  [selectBoard, selectSearch, selectPriority, selectAssignee],
  (board, search, priority, assignee) => {
    const term = search.trim().toLowerCase();

    return board.map((col) => ({
      ...col,
      cards: col.cards.filter((card) => {
        // 1. Text search: match title OR assignee.
        const matchesText =
          !term ||
          card.title.toLowerCase().includes(term) ||
          card.assignee.toLowerCase().includes(term);

        // 2. Priority filter ("all" means no filter).
        const matchesPriority =
          priority === "all" || card.priority === priority;

        // 3. Assignee filter ("all" means no filter).
        const matchesAssignee =
          assignee === "all" || card.assignee === assignee;

        // Keep the card only if it passes every active filter.
        return matchesText && matchesPriority && matchesAssignee;
      }),
    }));
  },
);

// Another memoized selector: count how many cards are "high" priority.
// Used by the stats bar. It only recounts when the cards change.
export const selectHighPriorityCount = createSelector(
  [selectCards],
  (cards) => {
    const all = Object.values(cards);
    return all.filter((card) => card.priority === "high").length;
  },
);

// Total number of cards on the whole board.
export const selectTotalCards = createSelector([selectCards], (cards) => {
  return Object.keys(cards).length;
});
