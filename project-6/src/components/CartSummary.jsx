// Shows the items added to the cart with quantities and a running total.
function CartSummary({ items, totalItems, totalPrice, onRemove, onClear }) {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">Your Cart</h2>
        <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600">
          {totalItems} item{totalItems === 1 ? "" : "s"}
        </span>
      </div>

      {items.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-500">
          Your cart is empty. Add some products to get started.
        </p>
      ) : (
        <>
          <ul className="divide-y divide-slate-100">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 py-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-12 w-12 flex-none rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">
                    {item.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {item.quantity} × ${item.price.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => onRemove(item.id)}
                  className="flex-none rounded-md px-2 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50"
                  aria-label={"Remove " + item.name}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
            <span className="text-sm font-medium text-slate-600">Total</span>
            <span className="text-xl font-bold text-slate-900">
              ${totalPrice.toFixed(2)}
            </span>
          </div>

          <button
            onClick={onClear}
            className="mt-4 w-full rounded-lg border border-slate-300 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Clear cart
          </button>
        </>
      )}
    </aside>
  );
}

export default CartSummary;
