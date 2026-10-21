import { useState } from "react";
import { WishlistProvider, useWishlist } from "./context/WishlistContext.jsx";
import { products } from "./data/products.js";
import Navbar from "./components/Navbar.jsx";
import FilterBar from "./components/FilterBar.jsx";
import ProductList from "./components/ProductList.jsx";

function Dashboard() {
  const { ids, clear, count } = useWishlist();

  // All the filter controls live in one state object.
  const [filters, setFilters] = useState({
    search: "",
    category: "All",
    maxPrice: 400,
    inStockOnly: false,
    minRating: 0,
    sort: "featured",
  });

  // true = show only wishlist items, false = show the whole catalog.
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);

  // --- Step 1: filter the products ---
  let visibleProducts = products.filter((product) => {
    // When in wishlist view, keep only saved products.
    if (showWishlistOnly && !ids.includes(product.id)) return false;

    // Category filter.
    if (filters.category !== "All" && product.category !== filters.category) {
      return false;
    }

    // Price and rating filters.
    if (product.price > filters.maxPrice) return false;
    if (product.rating < filters.minRating) return false;

    // In-stock filter.
    if (filters.inStockOnly && !product.inStock) return false;

    // Search box: match name, category, or tags.
    if (filters.search) {
      const text = (
        product.name +
        " " +
        product.category +
        " " +
        product.tags.join(" ")
      ).toLowerCase();
      if (!text.includes(filters.search.toLowerCase())) return false;
    }

    return true;
  });

  // --- Step 2: sort the filtered products ---
  if (filters.sort === "price-asc") {
    visibleProducts.sort((a, b) => a.price - b.price);
  } else if (filters.sort === "price-desc") {
    visibleProducts.sort((a, b) => b.price - a.price);
  } else if (filters.sort === "rating-desc") {
    visibleProducts.sort((a, b) => b.rating - a.rating);
  } else if (filters.sort === "name-asc") {
    visibleProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (filters.sort === "newest") {
    visibleProducts.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
  }

  return (
    <div className="min-h-screen">
      <Navbar
        showWishlistOnly={showWishlistOnly}
        onToggleView={() => setShowWishlistOnly(!showWishlistOnly)}
      />

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-extrabold tracking-tight">
            {showWishlistOnly ? "Your Wishlist" : "Discover Products"}
          </h2>
          <p className="text-sm text-slate-500">
            {showWishlistOnly
              ? "Items you've saved. Filter and sort them just like the catalog."
              : "Browse the catalog, then save favorites with the ♡ button."}
          </p>
        </div>

        <FilterBar
          filters={filters}
          setFilters={setFilters}
          resultCount={visibleProducts.length}
        />

        {showWishlistOnly && count > 0 && (
          <div className="flex items-center justify-between rounded-xl bg-rose-50 px-4 py-2 text-sm text-rose-700 ring-1 ring-inset ring-rose-100">
            <span>
              {count} item{count === 1 ? "" : "s"} in your wishlist
            </span>
            <button
              onClick={clear}
              className="font-semibold underline-offset-2 hover:underline"
            >
              Clear all
            </button>
          </div>
        )}

        <ProductList
          products={visibleProducts}
          emptyMessage={
            showWishlistOnly
              ? "Your wishlist is empty — tap ♡ on any product to save it."
              : "No products match your filters."
          }
        />
      </main>

      <footer className="mx-auto max-w-6xl px-4 pb-10 pt-4 text-center text-xs text-slate-400 sm:px-6">
        WishFlow · React Hooks &amp; State Management demo
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <WishlistProvider>
      <Dashboard />
    </WishlistProvider>
  );
}
