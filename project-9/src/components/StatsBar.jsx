import { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  selectTotalCards,
  selectHighPriorityCount,
  selectColumns,
} from "../store/selectors.js";
import { LayersIcon, FlagIcon, CheckIcon } from "./Icons.jsx";

// A single stat card with an icon, number, and label.
function Stat({ icon, label, value, ring }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-card transition duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lg">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl transition group-hover:scale-105 ${ring}`}
      >
        {icon}
      </div>
      <div className="leading-tight">
        <p className="text-xl font-extrabold text-slate-900">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  );
}

// Shows quick numbers about the board for the manager.
export default function StatsBar() {
  // These come from memoized selectors, so they only recompute
  // when the underlying cards actually change.
  const totalCards = useSelector(selectTotalCards);
  const highCount = useSelector(selectHighPriorityCount);
  const columns = useSelector(selectColumns);

  // PERFORMANCE: useMemo caches this calculation.
  // "Done" count only recomputes when the columns list changes,
  // not on every single render of this component.
  const doneCount = useMemo(() => {
    const done = columns.find((col) => col.id === "done");
    return done ? done.cardIds.length : 0;
  }, [columns]);

  return (
    <div className="flex flex-wrap gap-3">
      <Stat
        icon={<LayersIcon />}
        label="Total tasks"
        value={totalCards}
        ring="bg-brand-50 text-brand-600"
      />
      <Stat
        icon={<FlagIcon />}
        label="High priority"
        value={highCount}
        ring="bg-red-50 text-red-600"
      />
      <Stat
        icon={<CheckIcon />}
        label="Completed"
        value={doneCount}
        ring="bg-green-50 text-green-600"
      />
    </div>
  );
}
