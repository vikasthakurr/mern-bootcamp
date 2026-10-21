import { useSelector, useDispatch } from "react-redux";
import { setSearch, clearSearch } from "../store/filterSlice.js";
import { undo } from "../store/boardSlice.js";
import { selectSearch, selectCanUndo } from "../store/selectors.js";
import { useClock } from "../hooks/useClock.js";
import { SearchIcon, CloseIcon, ClockIcon, UndoIcon } from "./Icons.jsx";

// The top bar. Holds the logo, global task search, undo, and a live clock.
export default function Navbar() {
  const dispatch = useDispatch();

  // Read the current search text and whether undo is possible.
  const search = useSelector(selectSearch);
  const canUndo = useSelector(selectCanUndo);

  // Live time, updated every second by our custom hook.
  const now = useClock();
  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* A simple lettered logo mark with the brand gradient */}
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 font-bold text-white shadow-card">
            K
          </div>
          <div className="leading-tight">
            <p className="font-extrabold text-slate-900">KanbanHub</p>
            <p className="text-xs text-slate-500">A Manager's Tool</p>
          </div>
        </div>

        {/* Global search: filters tasks by title or assignee */}
        <div className="relative hidden w-full max-w-sm sm:block">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
            <SearchIcon />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
            placeholder="Search tasks or assignees..."
            className="w-full rounded-lg border border-slate-300 bg-slate-50 py-2 pl-9 pr-9 text-sm outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-100"
          />
          {search && (
            <button
              onClick={() => dispatch(clearSearch())}
              className="absolute inset-y-0 right-2 flex items-center text-slate-400 hover:text-slate-600"
              title="Clear search"
            >
              <CloseIcon />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Undo button: disabled when there is nothing to undo */}
          <button
            onClick={() => dispatch(undo())}
            disabled={!canUndo}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-600 transition duration-200 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-300 disabled:hover:bg-white disabled:hover:text-slate-600"
            title="Undo last change"
          >
            <UndoIcon />
            Undo
          </button>

          {/* Live clock */}
          <div className="hidden items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600 md:flex">
            <ClockIcon />
            <span className="tabular-nums">{time}</span>
          </div>
        </div>
      </nav>
    </header>
  );
}
