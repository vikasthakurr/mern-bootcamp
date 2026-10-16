import { useState } from "react";
import { products } from "./data/products.js";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import FilterBar from "./components/FilterBar.jsx";
import ProductList from "./components/ProductList.jsx";
import CartSummary from "./components/CartSummary.jsx";

// Build the category list once: "All" plus the unique categories from the data.
const categories = ["All", ...new Set(products.map((p) => p.category))];

function App() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sort, setSort] = useState("default");
  const [cart, setCart] = useState([]); // array of { ...product, quantity }

  // --- Derive the visible products from the current filters (no extra state) ---
  let visibleProducts = products.filter((product) => {
    const matchesCategory =
      activeCategory === "All" || product.category === activeCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.trim().toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (sort === "price-asc") {
    visibleProducts = [...visibleProducts].sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    visibleProducts = [...visibleProducts].sort((a, b) => b.price - a.price);
  } else if (sort === "rating-desc") {
    visibleProducts = [...visibleProducts].sort((a, b) => b.rating - a.rating);
  }

  // --- Cart handlers ---
  function handleAddToCart(product) {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        // Increase quantity of the existing line.
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }

  function handleRemoveFromCart(id) {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }

  function handleClearCart() {
    setCart([]);
  }

  // Smooth-scroll to the catalog when the hero CTA is clicked.
  function handleBrowseClick() {
    const section = document.getElementById("catalog");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  }

  // --- Derived cart totals ---
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Navbar cartCount={totalItems} />

      <Hero productCount={products.length} onBrowseClick={handleBrowseClick} />

      <main id="catalog" className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
          {/* Catalog */}
          <div>
            <FilterBar
              search={search}
              onSearchChange={setSearch}
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              sort={sort}
              onSortChange={setSort}
            />

            <p className="mb-4 text-sm text-slate-500">
              Showing {visibleProducts.length} of {products.length} products
            </p>

            <ProductList
              products={visibleProducts}
              onAddToCart={handleAddToCart}
            />
          </div>

          {/* Cart */}
          <CartSummary
            items={cart}
            totalItems={totalItems}
            totalPrice={totalPrice}
            onRemove={handleRemoveFromCart}
            onClear={handleClearCart}
          />
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6">
        <p className="text-center text-sm text-slate-500">
          © 2026 CatalogX · Built with React, Vite &amp; Tailwind CSS
        </p>
      </footer>
    </div>
  );
}

export default App;
