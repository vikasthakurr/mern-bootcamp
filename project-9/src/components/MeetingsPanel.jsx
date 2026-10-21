import { useMemo } from "react";
import { meetings } from "../data/seed.js";
import { useClock } from "../hooks/useClock.js";
import { ClockIcon, UsersIcon } from "./Icons.jsx";

// Turn "14:30" into minutes since midnight, so we can compare times.
function toMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

// Turn "14:30" into a friendly "2:30 PM".
function formatTime(time) {
  const [h, m] = time.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${suffix}`;
}

// Shows today's meetings: the time, what has to be done, and who joins.
// It highlights the NEXT upcoming meeting based on the live clock.
export default function MeetingsPanel() {
  // Live time so "next meeting" stays correct as the day goes on.
  const now = useClock();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  // Figure out which meeting is the next one still to come.
  // useMemo caches this; it only recomputes when the minute changes.
  const nextMeetingId = useMemo(() => {
    const upcoming = meetings
      .filter((mtg) => toMinutes(mtg.time) >= nowMinutes)
      .sort((a, b) => toMinutes(a.time) - toMinutes(b.time));
    return upcoming.length > 0 ? upcoming[0].id : null;
  }, [nowMinutes]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
          <ClockIcon />
        </span>
        <div>
          <h2 className="font-semibold text-slate-800">Today's meetings</h2>
          <p className="text-xs text-slate-500">What has to be done and when</p>
        </div>
      </div>

      <ol className="space-y-2.5">
        {meetings.map((mtg) => {
          const isNext = mtg.id === nextMeetingId;
          const isPast = toMinutes(mtg.time) < nowMinutes;

          return (
            <li
              key={mtg.id}
              className={`flex items-center gap-4 rounded-xl border p-3 transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                isNext
                  ? "border-brand-300 bg-brand-50 hover:border-brand-400"
                  : "border-slate-200 bg-white hover:border-brand-200"
              } ${isPast && !isNext ? "opacity-60 hover:opacity-100" : ""}`}
            >
              {/* Time column */}
              <div className="w-20 shrink-0 text-sm font-semibold text-slate-700">
                {formatTime(mtg.time)}
              </div>

              {/* Title + attendees */}
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-slate-900">
                  {mtg.title}
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                  <UsersIcon className="h-3.5 w-3.5" />
                  {mtg.attendees.join(", ")}
                </p>
              </div>

              {/* Status badge */}
              {isNext ? (
                <span className="shrink-0 rounded-full bg-brand-600 px-2.5 py-0.5 text-xs font-medium text-white">
                  Up next
                </span>
              ) : isPast ? (
                <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
                  Done
                </span>
              ) : (
                <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
                  Later
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
