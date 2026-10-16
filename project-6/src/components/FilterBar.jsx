// A controlled search input + category buttons + sort dropdown.
// All state lives in the parent (App); this component just reports changes up.
function FilterBar({
  search,
  onSearchChange,
  categories,
  activeCategory,
  onCategoryChange,
  sort,
  onSortChange,
}) {
  return (
    <div className="mb-8 space-y-4">
      {/* Search + sort row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            🔍
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm font-medium text-slate-600">
            Sort by
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white py-2 pl-3 pr-8 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          >
            <option value="default">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Category buttons */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isActive = category === activeCategory;
          return (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={
                "rounded-full border px-4 py-1.5 text-sm font-medium transition " +
                (isActive
                  ? "border-indigo-600 bg-indigo-600 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:border-indigo-400 hover:text-indigo-600")
              }
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default FilterBar;
