import ProductCard from "./ProductCard.jsx";

export default function ProductList({ products, emptyMessage }) {
  if (products.length === 0) {
    return (
      <div className="grid place-items-center rounded-2xl border border-dashed border-slate-300 bg-white/50 py-16 text-center">
        <div className="text-4xl">🗂️</div>
        <p className="mt-3 font-medium text-slate-600">
          {emptyMessage || "No products match your filters."}
        </p>
        <p className="text-sm text-slate-400">
          Try adjusting the search, price, or rating.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
