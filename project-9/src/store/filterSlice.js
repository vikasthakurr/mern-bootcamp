import { createSlice } from "@reduxjs/toolkit";

// This slice holds everything the manager uses to narrow down the board:
//   - search:   free text (matches title or assignee)
//   - priority: "all" | "high" | "medium" | "low"
//   - assignee: "all" or a person's name
// Keeping all filters in one place means one memoized selector can
// combine them, and any component can read the current filters.
const initialState = {
  search: "",
  priority: "all",
  assignee: "all",
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setPriority: (state, action) => {
      state.priority = action.payload;
    },
    setAssignee: (state, action) => {
      state.assignee = action.payload;
    },
    clearSearch: (state) => {
      state.search = "";
    },
    // Reset every filter back to its default.
    clearFilters: (state) => {
      state.search = "";
      state.priority = "all";
      state.assignee = "all";
    },
  },
});

export const {
  setSearch,
  setPriority,
  setAssignee,
  clearSearch,
  clearFilters,
} = filterSlice.actions;

export default filterSlice.reducer;
