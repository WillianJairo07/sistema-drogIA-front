export function ProductList({
  products,
  onEdit,
  onDelete,
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px] text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-slate-600">
              <th className="px-6 py-3 font-medium">
                Producto
              </th>

              <th className="px-6 py-3 font-medium">
                Lote
              </th>

              <th className="px-6 py-3 font-medium">
                Registro sanitario
              </th>

              <th className="w-32 whitespace-nowrap px-6 py-3 font-medium">
                Precio
              </th>

              <th className="px-6 py-3 font-medium">
                Stock
              </th>

              <th className="px-6 py-3 font-medium">
                Vencimiento
              </th>

              <th className="px-6 py-3 text-right font-medium">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr
                  key={product.id}
                  className="border-t border-slate-200"
                >
                  <td className="px-6 py-4 font-medium text-slate-700">
                    {product.name}
                  </td>

                  <td className="px-6 py-4 text-slate-500">
                    {product.lot}
                  </td>

                  <td className="px-6 py-4 text-slate-500">
                    {product.healthRegistration}
                  </td>

                  <td className="w-32 whitespace-nowrap px-6 py-4 text-slate-700">
                    S/ {product.price.toFixed(2)}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={
                        product.stock > 0
                          ? "text-emerald-600"
                          : "text-red-600"
                      }
                    >
                      {product.stock}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                    {product.expiration}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => onEdit(product)}
                        className="text-sm font-medium text-[#17324c] hover:underline"
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(product.id)}
                        className="text-sm font-medium text-red-600 hover:underline"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-8 text-center text-slate-500"
                >
                  No se encontraron productos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}