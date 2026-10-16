// Presentational component: receives a product object and an onAddToCart callback.
function ProductCard({ product, onAddToCart }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm">
          {product.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-tight text-slate-900">
            {product.name}
          </h3>
          <span className="flex items-center gap-0.5 whitespace-nowrap text-sm font-medium text-amber-500">
            ★ {product.rating.toFixed(1)}
          </span>
        </div>

        <p className="mb-4 flex-1 text-sm text-slate-500">
          {product.description}
        </p>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-lg font-bold text-slate-900">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={() => onAddToCart(product)}
            className="rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 active:scale-95"
          >
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
