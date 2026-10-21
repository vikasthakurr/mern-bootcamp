import { useSelector, useDispatch } from "react-redux";
import {
  setPriority,
  setAssignee,
  clearFilters,
} from "../store/filterSlice.js";
import {
  selectPriority,
  selectAssignee,
  selectSearch,
} from "../store/selectors.js";
import { team } from "../data/seed.js";

// A row of dropdown filters for the board.
// They write to the SAME filter slice that the search box uses,
// and the board's memoized selector combines all of them.
export default function FilterBar() {
  const dispatch = useDispatch();

  const priority = useSelector(selectPriority);
  const assignee = useSelector(selectAssignee);
  const search = useSelector(selectSearch);

  // Show the "Clear all" button only when some filter is active.
  const hasActiveFilter =
    search !== "" || priority !== "all" || assignee !== "all";

  const field =
    "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-card">
      <span className="text-sm font-medium text-slate-600">Filters</span>

      <select
        value={priority}
        onChange={(e) => dispatch(setPriority(e.target.value))}
        className={field}
      >
        <option value="all">All priorities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      <select
        value={assignee}
        onChange={(e) => dispatch(setAssignee(e.target.value))}
        className={field}
      >
        <option value="all">All assignees</option>
        {team.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>

      {hasActiveFilter && (
        <button
          onClick={() => dispatch(clearFilters())}
          className="ml-auto rounded-lg px-3 py-2 text-sm font-medium text-brand-600 transition duration-200 hover:bg-brand-50 hover:text-brand-700"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
