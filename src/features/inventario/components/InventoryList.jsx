export function InventoryList({ inventory = [] }) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                Producto
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                Lote
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                Stock
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                Stock mínimo
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                Vencimiento
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                Estado
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {inventory.map((item) => {
              const lowStock =
                item.stock <= item.minimumStock;

              return (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50"
                >
                  <td className="px-5 py-4 text-sm font-medium text-slate-800">
                    {item.product}
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {item.lot}
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {item.stock}
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {item.minimumStock}
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {item.expiration}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        lowStock
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {lowStock
                        ? "Stock bajo"
                        : "Disponible"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}