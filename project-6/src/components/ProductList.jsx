import ProductCard from "./ProductCard.jsx";

// Renders the grid of products, or an empty-state message when nothing matches.
function ProductList({ products, onAddToCart }) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
        <p className="text-4xl">🔎</p>
        <p className="mt-3 font-semibold text-slate-700">No products found</p>
        <p className="text-sm text-slate-500">
          Try a different search term or category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}

export default ProductList;
