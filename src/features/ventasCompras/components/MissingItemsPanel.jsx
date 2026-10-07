export function MissingItemsPanel({
  items,
  onStatusChange,
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-[#17324c]">
          Productos faltantes
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Consulta los productos que requieren gestión de Compras por falta de stock.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[750px] text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-slate-600">
              <th className="px-6 py-3 font-medium">Producto</th>
              <th className="px-6 py-3 font-medium">Solicitado</th>
              <th className="px-6 py-3 font-medium">Stock</th>
              <th className="px-6 py-3 font-medium">Faltante</th>
              <th className="px-6 py-3 font-medium">Estado</th>
              <th className="px-6 py-3 text-right font-medium">Acción</th>
            </tr>
          </thead>

          <tbody>
            {items.length > 0 ? (
              items.map((item) => {
                const missing = item.requested - item.stock;

                return (
                  <tr
                    key={item.id}
                    className="border-t border-slate-200"
                  >
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {item.product}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {item.requested}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {item.stock}
                    </td>

                    <td className="px-6 py-4 font-semibold text-red-600">
                      {missing}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          item.status === "Pendiente"
                            ? "bg-amber-100 text-amber-700"
                            : item.status === "En compra"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      {item.status === "Pendiente" && (
                        <button
                          type="button"
                          onClick={() =>
                            onStatusChange(item.id, "En compra")
                          }
                          className="rounded-lg bg-[#17324c] px-3 py-2 text-xs font-medium text-white hover:bg-[#234968]"
                        >
                          Gestionar compra
                        </button>
                      )}

                      {item.status === "En compra" && (
                        <button
                          type="button"
                          onClick={() =>
                            onStatusChange(item.id, "Gestionado")
                          }
                          className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          Marcar gestionado
                        </button>
                      )}

                      {item.status === "Gestionado" && (
                        <span className="text-xs text-slate-500">
                          Compra gestionada
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-8 text-center text-slate-500"
                >
                  No hay productos faltantes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}