import { useWishlist } from "../context/WishlistContext.jsx";

export default function ProductCard({ product }) {
  const { has, toggle } = useWishlist();
  const wished = has(product.id);

  return (
    <article className="group flex animate-fade-up flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative flex h-32 items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-5xl">
        <span>{product.emoji}</span>
        <button
          onClick={() => toggle(product.id)}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wished}
          className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full text-lg shadow transition active:scale-90 ${
            wished
              ? "animate-pop-in bg-rose-500 text-white"
              : "bg-white/90 text-slate-400 hover:text-rose-500"
          }`}
        >
          {wished ? "♥" : "♡"}
        </button>
        {!product.inStock && (
          <span className="absolute left-3 top-3 rounded-full bg-slate-900/80 px-2 py-0.5 text-xs font-semibold text-white">
            Out of stock
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-tight text-slate-800">
            {product.name}
          </h3>
          <span className="shrink-0 text-sm font-bold text-slate-900">
            ${product.price.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium">
            {product.category}
          </span>
          <span className="inline-flex items-center gap-1 text-amber-500">
            ★ <span className="text-slate-600">{product.rating.toFixed(1)}</span>
          </span>
        </div>

        <div className="mt-auto flex flex-wrap gap-1 pt-2">
          {product.tags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-slate-50 px-1.5 py-0.5 text-[11px] text-slate-500 ring-1 ring-inset ring-slate-200"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
