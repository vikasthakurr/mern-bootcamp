function Navbar({ cartCount }) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-lg font-black text-white">
            C
          </span>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            Catalog<span className="text-indigo-600">X</span>
          </span>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
          <span aria-hidden="true">🛒</span>
          <span>Cart</span>
          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-xs text-white">
            {cartCount}
          </span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
