export function ProductList({ products, onEdit, onDelete }) {
  if (products.length === 0) {
    return (
      <div className="rounded-xl bg-white p-8 text-center shadow-sm">
        <p className="text-sm text-slate-500">
          No se encontraron productos.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[600px] w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                Producto
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                Registro sanitario
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                Precio
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-slate-500">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50">
                <td className="px-5 py-4 text-sm font-medium text-slate-800">
                  {product.name}
                </td>

                <td className="px-5 py-4 text-sm text-slate-600">
                  {product.healthRegistration}
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                  S/ {product.price.toFixed(2)}
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-right">
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}