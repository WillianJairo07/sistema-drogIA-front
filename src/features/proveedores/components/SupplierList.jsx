export function SupplierList({
  suppliers,
  onEdit,
  onDelete,
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-slate-600">
              <th className="px-6 py-3 font-medium">Proveedor</th>
              <th className="px-6 py-3 font-medium">RUC</th>
              <th className="px-6 py-3 font-medium">Teléfono</th>
              <th className="px-6 py-3 font-medium">Correo</th>
              <th className="px-6 py-3 text-right font-medium">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {suppliers.length > 0 ? (
              suppliers.map((supplier) => (
                <tr
                  key={supplier.id}
                  className="border-t border-slate-200"
                >
                  <td className="px-6 py-4 font-medium text-slate-700">
                    {supplier.name}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                    {supplier.document}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                    {supplier.phone}
                  </td>

                  <td className="px-6 py-4 text-slate-500">
                    {supplier.email}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-3 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onEdit(supplier)}
                        className="text-sm font-medium text-[#17324c] hover:underline"
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(supplier.id)}
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
                  colSpan="5"
                  className="px-6 py-8 text-center text-slate-500"
                >
                  No se encontraron proveedores.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}