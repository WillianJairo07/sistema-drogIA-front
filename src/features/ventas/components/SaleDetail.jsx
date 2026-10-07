export function SaleDetail({
  sale,
  onClose,
  onStatusChange,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[#17324c]">
            {sale.number}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Generada desde la cotización {sale.quoteNumber}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="text-sm font-medium text-slate-500 hover:text-[#17324c]"
        >
          Volver
        </button>
      </div>

      <div className="grid gap-4 py-5 sm:grid-cols-2">
        <div>
          <p className="text-xs text-slate-500">Cliente</p>
          <p className="mt-1 font-medium text-slate-700">
            {sale.client.name}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500">Fecha</p>
          <p className="mt-1 font-medium text-slate-700">
            {sale.date}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-slate-600">
              <th className="px-4 py-3 font-medium">Producto</th>
              <th className="px-4 py-3 font-medium">Cantidad</th>
              <th className="px-4 py-3 font-medium">Precio</th>
              <th className="px-4 py-3 text-right font-medium">Subtotal</th>
            </tr>
          </thead>

          <tbody>
            {sale.items.map((item) => (
              <tr
                key={item.product.id}
                className="border-t border-slate-200"
              >
                <td className="px-4 py-4 text-slate-700">
                  {item.product.name}
                </td>

                <td className="px-4 py-4 text-slate-600">
                  {item.quantity}
                </td>

                <td className="px-4 py-4 text-slate-600">
                  S/ {item.price.toFixed(2)}
                </td>

                <td className="px-4 py-4 text-right font-medium text-slate-700">
                  S/ {(item.quantity * item.price).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex flex-col gap-4 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">Estado</p>

          <select
            value={sale.status}
            onChange={(event) =>
              onStatusChange(sale.id, event.target.value)
            }
            className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-400"
          >
            <option value="Pendiente de despacho">
              Pendiente de despacho
            </option>
            <option value="En despacho">En despacho</option>
            <option value="Entregada">Entregada</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        </div>

        <div className="text-left sm:text-right">
          <p className="text-sm text-slate-500">Total</p>

          <p className="text-xl font-semibold text-[#17324c]">
            S/ {sale.total.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}