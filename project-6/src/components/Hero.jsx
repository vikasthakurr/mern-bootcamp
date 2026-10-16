// Hero section: headline, copy, call-to-action buttons, stats, and an image collage.
// Kept to React foundations — just props and plain JSX/handlers.
function Hero({ productCount, onBrowseClick }) {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-slate-900">
      {/* Soft gradient glows in the background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-indigo-600/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-2 lg:py-20">
        {/* Left: copy */}
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-indigo-200">
            <span aria-hidden="true">✨</span> New season, fresh tech
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
            Gear up with{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">
              CatalogX
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-md text-base text-slate-300 lg:mx-0">
            A curated collection of audio, wearables, and accessories. Browse,
            filter, and build your cart in seconds.
          </p>

          <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <button
              onClick={onBrowseClick}
              className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 active:scale-95 sm:w-auto"
            >
              Browse the catalog
            </button>
            <a
              href="#catalog"
              className="w-full rounded-lg border border-white/20 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto"
            >
              View deals
            </a>
          </div>

          {/* Stats */}
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-white/10 pt-6 text-center lg:mx-0 lg:text-left">
            <div>
              <dt className="text-2xl font-bold text-white">{productCount}+</dt>
              <dd className="text-xs text-slate-400">Products</dd>
            </div>
            <div>
              <dt className="text-2xl font-bold text-white">6</dt>
              <dd className="text-xs text-slate-400">Categories</dd>
            </div>
            <div>
              <dt className="text-2xl font-bold text-white">4.5★</dt>
              <dd className="text-xs text-slate-400">Avg. rating</dd>
            </div>
          </dl>
        </div>

        {/* Right: image collage */}
        <div className="relative mx-auto hidden w-full max-w-md lg:block">
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80"
              alt="Wireless headphones"
              className="aspect-square w-full translate-y-6 rounded-2xl object-cover shadow-2xl ring-1 ring-white/10"
            />
            <img
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80"
              alt="Smart watch"
              className="aspect-square w-full rounded-2xl object-cover shadow-2xl ring-1 ring-white/10"
            />
            <img
              src="https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=400&q=80"
              alt="Mechanical keyboard"
              className="aspect-square w-full rounded-2xl object-cover shadow-2xl ring-1 ring-white/10"
            />
            <img
              src="https://images.unsplash.com/photo-1519638831568-d9897f54ed69?auto=format&fit=crop&w=400&q=80"
              alt="Mirrorless camera"
              className="aspect-square w-full -translate-y-6 rounded-2xl object-cover shadow-2xl ring-1 ring-white/10"
            />
          </div>

          {/* Floating badge */}
          <div className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-lg">
            <span aria-hidden="true">🚚</span> Free shipping over $50
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
