import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client.js";
import JobCard from "../components/JobCard.jsx";
import { SearchIcon } from "../components/Icons.jsx";

const categories = ["all", "web", "design", "mobile", "marketing", "writing"];

// Fetch jobs from the API, passing the current filters as query params.
function fetchJobs({ search, category, sort }) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (category && category !== "all") params.set("category", category);
  if (sort) params.set("sort", sort);
  return api.get(`/jobs?${params.toString()}`);
}

export default function Jobs() {
  // The URL carries the initial search/category (set from the home page).
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [sort, setSort] = useState("newest");

  // If the URL params change (e.g. clicking a category on Home), sync them in.
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setCategory(searchParams.get("category") || "all");
  }, [searchParams]);

  // React Query re-runs this whenever a filter in the key changes.
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["jobs", { search, category, sort }],
    queryFn: () => fetchJobs({ search, category, sort }),
  });

  const jobs = data?.data || [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold text-ink-900">Find your next job</h1>
      <p className="mt-1 text-sm text-ink-500">
        {data ? `${data.total} jobs available` : "Loading jobs..."}
      </p>

      {/* Filter bar */}
      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-card">
        <div className="relative flex-1 min-w-[220px]">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-ink-500">
            <SearchIcon />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or keyword"
            className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm capitalize outline-none focus:border-brand-500"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === "all" ? "All categories" : c}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
        >
          <option value="newest">Newest</option>
          <option value="budget_desc">Budget: high to low</option>
          <option value="budget_asc">Budget: low to high</option>
        </select>
      </div>

      {/* Results */}
      <div className="mt-6">
        {isLoading && (
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-40 animate-pulse rounded-xl border border-slate-200 bg-white"
              />
            ))}
          </div>
        )}

        {isError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error.message}
          </div>
        )}

        {data && jobs.length === 0 && (
          <p className="py-10 text-center text-ink-500">
            No jobs match your filters.
          </p>
        )}

        {data && jobs.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
