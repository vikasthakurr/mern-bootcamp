import { useState } from "react";
import { useDispatch } from "react-redux";
import { addCard } from "../store/boardSlice.js";
import { team } from "../data/seed.js";
import { useTeam } from "../hooks/useTeam.js";

// A form the manager uses to add a new task card.
// New cards always go into the "To Do" column (handled in the slice).
export default function AddCardForm() {
  const dispatch = useDispatch();

  // Get team members from the API (React Query). While it loads,
  // or if it fails, we fall back to the names from seed.js.
  // This shows API data (React Query) feeding into an action (Redux).
  const { data: apiTeam } = useTeam();
  const assigneeOptions = apiTeam ? apiTeam.map((m) => m.name) : team;

  // Controlled inputs: React holds the value of each field.
  const [title, setTitle] = useState("");
  const [assignee, setAssignee] = useState(team[0]);
  const [priority, setPriority] = useState("medium");

  function handleSubmit(e) {
    e.preventDefault();
    if (!title) return; // need at least a title

    // Send the action to Redux. The slice adds it to "To Do".
    dispatch(addCard({ title, assignee, priority }));

    // Reset the title so the manager can type the next one.
    setTitle("");
  }

  // Shared input styling so every field looks the same.
  const field =
    "mt-1 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card"
    >
      <h2 className="text-sm font-semibold text-slate-800">Create a task</h2>

      <div className="mt-3 flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[220px]">
          <label className="block text-xs font-medium text-slate-500">
            Task title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Fix the login bug"
            className={`${field} w-full`}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500">
            Assignee
          </label>
          <select
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            className={field}
          >
            {assigneeOptions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500">
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className={field}
          >
            <option value="high">high</option>
            <option value="medium">medium</option>
            <option value="low">low</option>
          </select>
        </div>

        <button
          type="submit"
          className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-card transition duration-200 hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-lg active:translate-y-0"
        >
          + Add task
        </button>
      </div>
    </form>
  );
}
