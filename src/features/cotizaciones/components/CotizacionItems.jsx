export function CotizacionItems({
  products,
  onIncrease,
  onDecrease,
  onRemove,
  onPriceChange,
}) {
  return (
    <div className="mt-5 overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full min-w-[750px] text-sm">
        <thead className="bg-slate-50">
          <tr className="text-left text-slate-600">
            <th className="px-4 py-3 font-medium">Producto</th>
            <th className="px-4 py-3 font-medium">Cantidad</th>
            <th className="px-4 py-3 font-medium">Precio</th>
            <th className="px-4 py-3 font-medium">Subtotal</th>
            <th className="px-4 py-3 font-medium">Acción</th>
          </tr>
        </thead>

        <tbody>
          {products.length === 0 ? (
            <tr>
              <td
                colSpan="5"
                className="px-4 py-8 text-center text-slate-500"
              >
                No hay productos agregados.
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.id} className="border-t border-slate-200">
                <td className="px-4 py-3 text-slate-700">
                  {product.name}
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onDecrease(product.id)}
                      disabled={product.quantity === 1}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 hover:bg-slate-100 disabled:opacity-40"
                    >
                      −
                    </button>

                    <span className="w-8 text-center font-medium">
                      {product.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => onIncrease(product.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 hover:bg-slate-100"
                    >
                      +
                    </button>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={product.price}
                    onChange={(event) =>
                      onPriceChange(product.id, event.target.value)
                    }
                    className="w-24 rounded-md border border-slate-300 px-2 py-1.5 outline-none focus:border-[#17324c]"
                  />
                </td>

                <td className="px-4 py-3 font-medium text-slate-700">
                  S/ {(product.quantity * product.price).toFixed(2)}
                </td>

                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onRemove(product.id)}
                    className="text-sm font-medium text-red-600 hover:text-red-700"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}