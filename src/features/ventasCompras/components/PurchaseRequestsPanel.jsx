
import { useNavigate } from "react-router-dom";

export function PurchaseRequestsPanel({
  items,
}) {
  const navigate = useNavigate();

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-[#17324c]">
          Solicitudes de compra
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Productos de ventas aceptadas que deben ser adquiridos por Compras.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[750px] text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-slate-600">
              <th className="px-6 py-3 font-medium">
                Venta
              </th>

              <th className="px-6 py-3 font-medium">
                Producto
              </th>

              <th className="px-6 py-3 font-medium">
                Cantidad
              </th>

              <th className="px-6 py-3 font-medium">
                Estado
              </th>

              <th className="px-6 py-3 text-right font-medium">
                Acción
              </th>
            </tr>
          </thead>

          <tbody>
            {items.length > 0 ? (
              items.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-slate-200"
                >
                  <td className="px-6 py-4 font-medium text-slate-700">
                    {item.saleNumber}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {item.product}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {item.quantity}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        item.status === "Pendiente de compra"
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
                    {item.status === "Pendiente de compra" && (
                      <button
                        type="button"
                        onClick={() =>
                          navigate("/dashboard/ordenes-compra", {
                            state: {
                              request: item,
                            },
                          })
                        }
                        className="rounded-lg bg-[#17324c] px-3 py-2 text-xs font-medium text-white hover:bg-[#234968]"
                      >
                        Crear orden de compra
                      </button>
                    )}

                    {item.status === "En compra" && (
                      <span className="text-xs text-blue-600">
                        Orden en proceso
                      </span>
                    )}

                    {item.status === "Recibido" && (
                      <span className="text-xs text-emerald-600">
                        Producto recibido
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-8 text-center text-slate-500"
                >
                  No hay solicitudes de compra.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
