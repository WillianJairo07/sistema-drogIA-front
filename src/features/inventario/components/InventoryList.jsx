const initialInventory = [
  {
    id: 1,
    product: "Paracetamol 500 mg",
    lot: "LOT-PAR-001",
    stock: 120,
    minimumStock: 50,
    expiration: "2027-08-15",
  },
  {
    id: 2,
    product: "Alcohol 70%",
    lot: "LOT-ALC-002",
    stock: 20,
    minimumStock: 30,
    expiration: "2027-05-20",
  },
  {
    id: 3,
    product: "Ibuprofeno 400 mg",
    lot: "LOT-IBU-003",
    stock: 45,
    minimumStock: 20,
    expiration: "2026-12-10",
  },
];

export function InventoryList() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-[#17324c]">
          Inventario actual
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Consulta el stock, lotes y fechas de vencimiento de los productos.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-slate-600">
              <th className="px-6 py-3 font-medium">Producto</th>
              <th className="px-6 py-3 font-medium">Lote</th>
              <th className="px-6 py-3 font-medium">Stock</th>
              <th className="px-6 py-3 font-medium">Stock mínimo</th>
              <th className="px-6 py-3 font-medium">Vencimiento</th>
              <th className="px-6 py-3 font-medium">Estado</th>
            </tr>
          </thead>

          <tbody>
            {initialInventory.map((item) => {
              const lowStock = item.stock < item.minimumStock;

              return (
                <tr key={item.id} className="border-t border-slate-200">
                  <td className="px-6 py-4 font-medium text-slate-700">
                    {item.product}
                  </td>

                  <td className="px-6 py-4 text-slate-500">
                    {item.lot}
                  </td>

                  <td className="px-6 py-4 font-medium text-slate-700">
                    {item.stock}
                  </td>

                  <td className="px-6 py-4 text-slate-500">
                    {item.minimumStock}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                    {item.expiration}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        lowStock
                          ? "bg-red-100 text-red-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {lowStock ? "Stock bajo" : "Disponible"}
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