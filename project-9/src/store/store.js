import { configureStore } from "@reduxjs/toolkit";
import boardReducer from "./boardSlice.js";
import filterReducer from "./filterSlice.js";
import attendanceReducer from "./attendanceSlice.js";

const BOARD_KEY = "kanbanhub:board";
const ATTENDANCE_KEY = "kanbanhub:attendance";

// Small helper: read and parse one saved value from localStorage.
// Returns undefined if nothing is saved or the data is broken,
// so Redux falls back to the slice's own initialState.
function load(key) {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return undefined;
    return JSON.parse(saved);
  } catch {
    return undefined;
  }
}

// Build the preloaded state only from the pieces we actually saved.
const preloadedState = {};
const savedBoard = load(BOARD_KEY);
const savedAttendance = load(ATTENDANCE_KEY);
if (savedBoard) preloadedState.board = savedBoard;
if (savedAttendance) preloadedState.attendance = savedAttendance;

// The store is the single place that holds ALL of our app state.
// We register each slice under its own key.
export const store = configureStore({
  reducer: {
    board: boardReducer,
    filter: filterReducer,
    attendance: attendanceReducer,
  },
  // Start the store with any saved data (filters always start fresh).
  preloadedState: Object.keys(preloadedState).length
    ? preloadedState
    : undefined,
});

// Save to localStorage whenever the store changes.
// store.subscribe runs after every action, so the saved copy
// always matches what's on screen. This is how a refresh keeps data.
store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem(BOARD_KEY, JSON.stringify(state.board));
  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(state.attendance));
});
