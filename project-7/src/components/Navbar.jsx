import { useWishlist } from "../context/WishlistContext.jsx";

export default function Navbar({ showWishlistOnly, onToggleView }) {
  const { count } = useWishlist();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌊</span>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight">WishFlow</h1>
            <p className="-mt-1 text-xs text-slate-500">
              Wishlist &amp; smart filter
            </p>
          </div>
        </div>

        <button
          onClick={onToggleView}
          className={`relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
            showWishlistOnly
              ? "bg-rose-500 text-white hover:bg-rose-600"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <span>{showWishlistOnly ? "♥ My Wishlist" : "♡ Wishlist"}</span>
          <span
            className={`inline-flex min-w-[1.5rem] items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-bold ${
              showWishlistOnly ? "bg-white/25 text-white" : "bg-rose-500 text-white"
            }`}
          >
            {count}
          </span>
        </button>
      </div>
    </header>
  );
}
