import { Link } from "react-router-dom";
import { WalletIcon, TagIcon, UserIcon } from "./Icons.jsx";

// A single job shown as a card in the jobs list, styled like a
// job-portal listing: a logo tile, the title, and a row of tags.
export default function JobCard({ job }) {
  // Use the first letter of the client's name as a simple logo tile.
  const initial = job.client?.name ? job.client.name.charAt(0) : "?";

  return (
    <Link
      to={`/jobs/${job.id}`}
      className="group block rounded-xl border border-slate-200 bg-white p-5 transition duration-200 hover:border-brand-200 hover:shadow-hover"
    >
      <div className="flex items-start gap-4">
        {/* Logo tile */}
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-lg font-bold text-brand-500">
          {initial}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-ink-900 group-hover:text-brand-500">
              {job.title}
            </h3>
            <span className="shrink-0 rounded-md bg-brand-50 px-2.5 py-1 text-sm font-semibold text-brand-600">
              ${job.budget}
            </span>
          </div>

          {job.client && (
            <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-500">
              <UserIcon className="h-3.5 w-3.5" />
              {job.client.name}
            </p>
          )}

          <p className="mt-3 line-clamp-2 text-sm text-ink-500">
            {job.description}
          </p>

          {/* Tag row */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-ink-700">
              <TagIcon className="h-3.5 w-3.5" />
              {job.category}
            </span>
            <span className="flex items-center gap-1 rounded-md bg-green-50 px-2 py-1 font-medium text-green-700">
              <WalletIcon className="h-3.5 w-3.5" />
              Fixed price
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
