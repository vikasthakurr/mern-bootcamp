import React from "react";
import { CloseIcon } from "./Icons.jsx";

// Colors for each priority. "stripe" is the thin bar on the card's left edge.
const priorityStyles = {
  high: { stripe: "bg-red-500", tag: "bg-red-100 text-red-700" },
  medium: { stripe: "bg-amber-500", tag: "bg-amber-100 text-amber-700" },
  low: { stripe: "bg-green-500", tag: "bg-green-100 text-green-700" },
};

// A small colored tag for the card's priority.
function PriorityTag({ priority }) {
  const style = priorityStyles[priority] || priorityStyles.medium;
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${style.tag}`}
    >
      {priority}
    </span>
  );
}

// A round avatar made from the assignee's first letter.
function Avatar({ name }) {
  return (
    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-[11px] font-semibold text-slate-600">
      {name.charAt(0)}
    </div>
  );
}

// One task card.
//
// PERFORMANCE: we wrap this component in React.memo.
// React.memo tells React: "only re-render this card if ITS props change."
// So when the manager edits one card, the other cards do NOT re-render.
//
// For this to work, the functions we pass in (onMove, onDelete) must be
// STABLE between renders. The Column creates them with useCallback so they
// keep the same identity. If they changed every render, memo would be useless.
function Card({ card, columns, currentColumnId, onMove, onDelete }) {
  // A tiny log so students can SEE in the console which cards re-render.
  console.log("Rendering card:", card.title);

  const style = priorityStyles[card.priority] || priorityStyles.medium;

  return (
    <div className="group relative animate-fade-up overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card transition duration-200 hover:-translate-y-1 hover:border-brand-300 hover:shadow-xl">
      {/* Colored priority stripe on the left edge */}
      <div className={`absolute inset-y-0 left-0 w-1 ${style.stripe}`} />

      <div className="p-3 pl-4">
        <div className="flex items-start justify-between gap-2">
          <p className="font-medium leading-snug text-slate-900">
            {card.title}
          </p>
          {/* Delete button appears on hover for a cleaner look */}
          <button
            onClick={() => onDelete(card.id)}
            className="rounded-md p-1 text-slate-300 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
            title="Delete card"
          >
            <CloseIcon className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar name={card.assignee} />
            <span className="text-xs text-slate-500">{card.assignee}</span>
          </div>
          <PriorityTag priority={card.priority} />
        </div>

        {/* Move the card to another column */}
        <div className="mt-3 flex flex-wrap gap-1.5 border-t border-slate-100 pt-3">
          {columns
            .filter((col) => col.id !== currentColumnId)
            .map((col) => (
              <button
                key={col.id}
                onClick={() => onMove(card.id, currentColumnId, col.id)}
                className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 transition duration-200 hover:-translate-y-0.5 hover:bg-brand-100 hover:text-brand-700 hover:shadow-sm"
              >
                Move to {col.title}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}

// Export the memoized version so parents get the performance benefit.
export default React.memo(Card);
