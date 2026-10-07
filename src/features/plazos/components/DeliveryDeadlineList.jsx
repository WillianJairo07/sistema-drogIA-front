export function DeliveryDeadlineList({
  deadlines,
  onExtension,
  onPenalty,
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-[#17324c]">
          Seguimiento de entregas
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Controla los plazos acordados y los incumplimientos de los proveedores.
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
                Fecha límite
              </th>

              <th className="px-6 py-3 font-medium">
                Estado
              </th>

              <th className="px-6 py-3 font-medium">
                Extensión
              </th>

              <th className="px-6 py-3 font-medium">
                Penalidad
              </th>

              <th className="px-6 py-3 text-right font-medium">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {deadlines.length > 0 ? (
              deadlines.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-slate-200"
                >
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-700">
                    {item.order.number}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {item.order.supplier.name}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                    {item.deadline}
                  </td>

                  <td className="px-6 py-4">
                    <span className="whitespace-nowrap rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                      {item.status}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                    {item.extension
                      ? `${item.extension} días`
                      : "Sin extensión"}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                    {item.penalty > 0
                      ? `${item.penalty}%`
                      : "Sin penalidad"}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-3 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onExtension(item.id)}
                        className="text-sm font-medium text-[#17324c] hover:underline"
                      >
                        Extensión
                      </button>

                      <button
                        type="button"
                        onClick={() => onPenalty(item.id)}
                        className="text-sm font-medium text-red-600 hover:underline"
                      >
                        Penalidad
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
                  No hay plazos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}