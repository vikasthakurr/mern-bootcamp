import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "./Card.jsx";
import { moveCard, deleteCard } from "../store/boardSlice.js";
import { selectColumns } from "../store/selectors.js";

// Each column gets its own accent color so the lanes are easy to tell apart.
const columnStyles = {
  todo: { dot: "bg-slate-400", count: "bg-slate-200 text-slate-600" },
  doing: { dot: "bg-brand-500", count: "bg-brand-100 text-brand-700" },
  done: { dot: "bg-green-500", count: "bg-green-100 text-green-700" },
};

// One column on the board (e.g. "To Do"). It shows its cards.
export default function Column({ column }) {
  const dispatch = useDispatch();

  // We need the list of all columns so each card knows where it can move.
  const columns = useSelector(selectColumns);

  // Pick this column's colors (fall back to the "todo" style if unknown).
  const style = columnStyles[column.id] || columnStyles.todo;

  // PERFORMANCE: useCallback keeps these functions STABLE.
  // Without it, a new function would be created on every render, and every
  // Card (even unchanged ones) would re-render despite React.memo.
  // The empty [] means "never recreate these functions".
  const handleMove = useCallback(
    (cardId, fromColumnId, toColumnId) => {
      dispatch(moveCard({ cardId, fromColumnId, toColumnId }));
    },
    [dispatch],
  );

  const handleDelete = useCallback(
    (cardId) => {
      dispatch(deleteCard({ cardId }));
    },
    [dispatch],
  );

  return (
    <div className="flex w-80 flex-shrink-0 flex-col rounded-2xl border border-slate-200 bg-slate-50/80 p-3">
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${style.dot}`} />
          <h2 className="font-semibold text-slate-700">{column.title}</h2>
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${style.count}`}
        >
          {column.cards.length}
        </span>
      </div>

      <div className="space-y-2.5">
        {column.cards.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 py-8 text-center text-sm text-slate-400">
            Drop a task here
          </div>
        )}

        {column.cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            columns={columns}
            currentColumnId={column.id}
            onMove={handleMove}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
