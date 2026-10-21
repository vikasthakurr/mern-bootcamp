import { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTeam } from "../hooks/useTeam.js";
import { cycleStatus } from "../store/attendanceSlice.js";
import { selectAttendance } from "../store/selectors.js";
import { SearchIcon, RefreshIcon } from "./Icons.jsx";

// How each attendance status should look (label + colors).
const statusStyles = {
  present: {
    label: "Present",
    dot: "bg-green-500",
    badge: "bg-green-50 text-green-700 hover:bg-green-100",
  },
  remote: {
    label: "Remote",
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700 hover:bg-amber-100",
  },
  absent: {
    label: "Absent",
    dot: "bg-red-500",
    badge: "bg-red-50 text-red-700 hover:bg-red-100",
  },
};

// A clickable attendance badge. Clicking it cycles the status.
function AttendanceBadge({ memberId, status }) {
  const dispatch = useDispatch();
  const style = statusStyles[status] || statusStyles.present;

  return (
    <button
      onClick={() => dispatch(cycleStatus({ memberId }))}
      title="Click to change attendance"
      className={`flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition ${style.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {style.label}
    </button>
  );
}

// A small skeleton row shown while the data is loading.
function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
      <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-3/4 animate-pulse rounded bg-slate-100" />
      </div>
    </div>
  );
}

// The first letter of a name, used as a simple gradient avatar.
function Avatar({ name }) {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 font-semibold text-white transition duration-200 group-hover:scale-110">
      {name.charAt(0)}
    </div>
  );
}

// Shows the team members fetched from the API.
// This component teaches the three React Query states:
// isLoading, isError, and success (data).
export default function TeamPanel() {
  // One line gives us everything: the data plus the current status.
  // refetch lets the user reload the data on demand.
  const { data, isLoading, isError, error, refetch, isFetching } = useTeam();

  // Attendance map from Redux ({ memberId: status }).
  const attendance = useSelector(selectAttendance);

  // Local search just for this panel (not shared in Redux).
  const [query, setQuery] = useState("");

  // Count how many members are present / remote / absent.
  // useMemo caches this so it only recounts when the data or
  // the attendance map changes.
  const summary = useMemo(() => {
    const counts = { present: 0, remote: 0, absent: 0 };
    if (!data) return counts;
    data.forEach((m) => {
      const status = attendance[m.id] || "present";
      counts[status] += 1;
    });
    return counts;
  }, [data, attendance]);

  // Filter the fetched members by name or company.
  // useMemo caches the result so we don't re-filter on every render.
  const members = useMemo(() => {
    if (!data) return [];
    const term = query.trim().toLowerCase();
    if (!term) return data;
    return data.filter(
      (m) =>
        m.name.toLowerCase().includes(term) ||
        m.company.toLowerCase().includes(term),
    );
  }, [data, query]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-semibold text-slate-800">Team members</h2>
          {/* A small live badge to show this data comes from an API */}
          <span className="flex items-center gap-1.5 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Live API
          </span>

          {/* Attendance summary counts */}
          {data && (
            <span className="flex items-center gap-2 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                {summary.present} present
              </span>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                {summary.remote} remote
              </span>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                {summary.absent} absent
              </span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Local search box for the team list */}
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-2.5 flex items-center text-slate-400">
              <SearchIcon />
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search team..."
              className="w-44 rounded-lg border border-slate-300 bg-slate-50 py-1.5 pl-8 pr-3 text-sm outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-100"
            />
          </div>

          <button
            onClick={() => refetch()}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-600 transition duration-200 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
          >
            <RefreshIcon
              className={isFetching ? "h-4 w-4 animate-spin" : "h-4 w-4"}
            />
            {isFetching ? "Refreshing" : "Refresh"}
          </button>
        </div>
      </div>

      {/* STATE 1: loading -> show skeleton placeholders */}
      {isLoading && (
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </div>
      )}

      {/* STATE 2: error -> show a friendly message + retry */}
      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-medium">Something went wrong</p>
          <p className="mt-0.5 text-red-600">{error.message}</p>
          <button
            onClick={() => refetch()}
            className="mt-3 rounded-lg bg-red-600 px-3 py-1.5 font-medium text-white transition hover:bg-red-700"
          >
            Try again
          </button>
        </div>
      )}

      {/* STATE 3: success -> show the (filtered) list */}
      {data && (
        <>
          {members.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-400">
              No team members match your search.
            </p>
          ) : (
            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="group rounded-xl border border-slate-200 bg-white p-3 transition duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lg"
                >
                  {/* Top row: avatar + name + company */}
                  <div className="flex items-center gap-3">
                    <Avatar name={member.name} />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-900">
                        {member.name}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {member.company}
                      </p>
                    </div>
                  </div>

                  {/* Bottom row: name label + clickable attendance status */}
                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5">
                    <span className="text-xs font-medium text-slate-500">
                      Attendance
                    </span>
                    <AttendanceBadge
                      memberId={member.id}
                      status={attendance[member.id] || "present"}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
