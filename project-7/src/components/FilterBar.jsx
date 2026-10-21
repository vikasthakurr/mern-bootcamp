import { categories } from "../data/products.js";

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "rating-desc", label: "Top Rated" },
  { value: "name-asc", label: "Name: A → Z" },
  { value: "newest", label: "Newest" },
];

export default function FilterBar({ filters, setFilters, resultCount }) {
  // Change one filter while keeping the rest the same.
  function update(changes) {
    setFilters({ ...filters, ...changes });
  }

  // Put every filter back to its starting value.
  function reset() {
    setFilters({
      search: "",
      category: "All",
      maxPrice: 400,
      inStockOnly: false,
      minRating: 0,
      sort: "featured",
    });
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4">
        {/* Search */}
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            🔍
          </span>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => update({ search: e.target.value })}
            placeholder="Search products or tags…"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Category */}
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-slate-600">Category</span>
            <select
              value={filters.category}
              onChange={(e) => update({ category: e.target.value })}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          {/* Sort */}
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-slate-600">Sort by</span>
            <select
              value={filters.sort}
              onChange={(e) => update({ sort: e.target.value })}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>

          {/* Max price */}
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-slate-600">
              Max price: ${filters.maxPrice}
            </span>
            <input
              type="range"
              min="0"
              max="400"
              step="10"
              value={filters.maxPrice}
              onChange={(e) => update({ maxPrice: Number(e.target.value) })}
              className="mt-2 accent-rose-500"
            />
          </label>

          {/* Min rating */}
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-slate-600">
              Min rating: {filters.minRating.toFixed(1)}★
            </span>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={filters.minRating}
              onChange={(e) => update({ minRating: Number(e.target.value) })}
              className="mt-2 accent-rose-500"
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-600">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) => update({ inStockOnly: e.target.checked })}
              className="h-4 w-4 rounded accent-rose-500"
            />
            In stock only
          </label>

          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">
              {resultCount} result{resultCount === 1 ? "" : "s"}
            </span>
            <button
              onClick={reset}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
