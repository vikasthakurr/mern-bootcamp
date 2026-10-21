import { useSelector } from "react-redux";
import Navbar from "./components/Navbar.jsx";
import StatsBar from "./components/StatsBar.jsx";
import AddCardForm from "./components/AddCardForm.jsx";
import FilterBar from "./components/FilterBar.jsx";
import TeamPanel from "./components/TeamPanel.jsx";
import MeetingsPanel from "./components/MeetingsPanel.jsx";
import Column from "./components/Column.jsx";
import { selectFilteredBoard, selectSearch } from "./store/selectors.js";

// The main page. It reads the board from Redux and shows the columns.
export default function App() {
  // selectFilteredBoard gives each column with its cards, already
  // filtered by whatever is typed in the search box.
  const board = useSelector(selectFilteredBoard);
  const search = useSelector(selectSearch);

  // How many cards are showing after filtering (for the results note).
  const visibleCards = board.reduce((sum, col) => sum + col.cards.length, 0);

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      {/* A soft gradient band behind the page header */}
      <div className="bg-gradient-to-b from-brand-50 to-slate-100">
        <div className="max-w-6xl mx-auto px-4 pt-8 pb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-brand-600">Workspace</p>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Team Board
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Move tasks across columns and keep an eye on progress.
              </p>
            </div>
            <StatsBar />
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 pb-10">
        {/* Two panels side by side: meetings + team */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <MeetingsPanel />
          <TeamPanel />
        </div>

        {/* Add a new task */}
        <div className="mt-6">
          <AddCardForm />
        </div>

        {/* Dropdown filters (priority + assignee) */}
        <div className="mt-4">
          <FilterBar />
        </div>

        {/* A small note telling the manager what the search matched */}
        {search && (
          <p className="mt-4 text-sm text-slate-500">
            Showing {visibleCards} result{visibleCards === 1 ? "" : "s"} for
            <span className="font-medium text-slate-700"> "{search}"</span>
          </p>
        )}

        {/* The three columns, side by side */}
        <div className="board-scroll mt-4 flex gap-5 overflow-x-auto pb-4">
          {board.map((column) => (
            <Column key={column.id} column={column} />
          ))}
        </div>
      </main>
    </div>
  );
}
