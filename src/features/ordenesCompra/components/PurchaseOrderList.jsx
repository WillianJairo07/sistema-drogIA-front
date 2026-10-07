export function PurchaseOrderList({
  orders,
  onStatusChange,
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-[#17324c]">
          Órdenes de compra
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Consulta y controla las órdenes realizadas a los proveedores.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-slate-600">
              <th className="px-6 py-3 font-medium">
                Orden
              </th>

              <th className="px-6 py-3 font-medium">
                Proveedor
              </th>

              <th className="px-6 py-3 font-medium">
                Fecha
              </th>

              <th className="px-6 py-3 font-medium">
                Productos
              </th>

              <th className="px-6 py-3 font-medium">
                Total
              </th>

              <th className="px-6 py-3 font-medium">
                Estado
              </th>
            </tr>
          </thead>

          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t border-slate-200"
                >
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-700">
                    {order.number}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {order.supplier.name}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                    {order.date}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {order.items.length}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-700">
                    S/ {order.total.toFixed(2)}
                  </td>

                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(event) =>
                        onStatusChange(
                          order.id,
                          event.target.value
                        )
                      }
                      className={`rounded-full border-0 px-2 py-1 text-xs font-medium outline-none ${
                        order.status === "Pendiente"
                          ? "bg-amber-100 text-amber-700"
                          : order.status === "Enviada"
                            ? "bg-blue-100 text-blue-700"
                            : order.status === "Recibida"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                      }`}
                    >
                      <option value="Pendiente">
                        Pendiente
                      </option>
                      <option value="Enviada">
                        Enviada
                      </option>
                      <option value="Recibida">
                        Recibida
                      </option>
                      <option value="Cancelada">
                        Cancelada
                      </option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-8 text-center text-slate-500"
                >
                  No hay órdenes de compra registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}