export function SaleList({
  sales,
  onSelect,
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-[#17324c]">
          Ventas registradas
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Consulta las ventas generadas a partir de las cotizaciones aceptadas.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-slate-600">
              <th className="px-6 py-3 font-medium">
                Venta
              </th>

              <th className="px-6 py-3 font-medium">
                Cotización
              </th>

              <th className="px-6 py-3 font-medium">
                Cliente
              </th>

              <th className="px-6 py-3 font-medium">
                Fecha
              </th>

              <th className="px-6 py-3 font-medium">
                Total
              </th>

              <th className="px-6 py-3 font-medium">
                Estado
              </th>

              <th className="px-6 py-3 font-medium">
                Acción
              </th>
            </tr>
          </thead>

          <tbody>
            {sales.length > 0 ? (
              sales.map((sale) => (
                <tr
                  key={sale.id}
                  className="border-t border-slate-200"
                >
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-700">
                    {sale.number}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                    {sale.quoteNumber}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {sale.client.name}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                    {sale.date}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-700">
                    S/ {sale.total.toFixed(2)}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${
                        sale.status === "En proceso"
                          ? "bg-amber-100 text-amber-700"
                          : sale.status === "Disponible"
                            ? "bg-emerald-100 text-emerald-700"
                            : sale.status === "Entregada"
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {sale.status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => onSelect(sale)}
                      className="rounded-lg bg-[#17324c] px-3 py-2 text-xs font-medium text-white hover:bg-[#234968]"
                    >
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-8 text-center text-slate-500"
                >
                  No hay ventas registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}