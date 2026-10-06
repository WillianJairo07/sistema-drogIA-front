export function CotizacionItems({ products }) {
  return (
    <div className="mt-5 overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full min-w-[600px] text-sm">
        <thead className="bg-slate-50">
          <tr className="text-left text-slate-600">
            <th className="px-4 py-3 font-medium">Producto</th>
            <th className="px-4 py-3 font-medium">Cantidad</th>
            <th className="px-4 py-3 font-medium">Precio</th>
            <th className="px-4 py-3 font-medium">Subtotal</th>
          </tr>
        </thead>

        <tbody>
          {products.length === 0 ? (
            <tr>
              <td
                colSpan="4"
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

                <td className="px-4 py-3 text-slate-700">
                  {product.quantity}
                </td>

                <td className="px-4 py-3 text-slate-700">
                  S/ {product.price.toFixed(2)}
                </td>

                <td className="px-4 py-3 font-medium text-slate-700">
                  S/ {(product.quantity * product.price).toFixed(2)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}