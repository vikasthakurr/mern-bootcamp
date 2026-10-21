import { createSlice } from "@reduxjs/toolkit";

// This slice tracks each team member's attendance for the day.
// We store it as an object: { [memberId]: "present" | "remote" | "absent" }.
// A member with no entry yet is treated as "present" by default.

// The three statuses, in the order we cycle through them when clicked.
export const STATUS_ORDER = ["present", "remote", "absent"];

const initialState = {
  // byId holds the status for members the manager has changed.
  byId: {},
};

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    // Set a member's status directly.
    setStatus: (state, action) => {
      const { memberId, status } = action.payload;
      state.byId[memberId] = status;
    },

    // Click to move to the next status: present -> remote -> absent -> present.
    cycleStatus: (state, action) => {
      const { memberId } = action.payload;

      // Current status (default to the first one if not set yet).
      const current = state.byId[memberId] || STATUS_ORDER[0];

      // Find the next status in the list, wrapping back to the start.
      const nextIndex = (STATUS_ORDER.indexOf(current) + 1) % STATUS_ORDER.length;
      state.byId[memberId] = STATUS_ORDER[nextIndex];
    },
  },
});

export const { setStatus, cycleStatus } = attendanceSlice.actions;
export default attendanceSlice.reducer;
