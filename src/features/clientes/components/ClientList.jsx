export function ClientList({
  clients,
  onEdit,
  onDelete,
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-slate-600">
              <th className="px-6 py-3 font-medium">
                Cliente
              </th>

              <th className="px-6 py-3 font-medium">
                RUC
              </th>

              <th className="px-6 py-3 text-right font-medium">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {clients.length > 0 ? (
              clients.map((client) => (
                <tr
                  key={client.id}
                  className="border-t border-slate-200"
                >
                  <td className="px-6 py-4 font-medium text-slate-700">
                    {client.name}
                  </td>

                  <td className="px-6 py-4 text-slate-500">
                    {client.document}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => onEdit(client)}
                        className="text-sm font-medium text-[#17324c] hover:underline"
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(client.id)}
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
                  colSpan="3"
                  className="px-6 py-8 text-center text-slate-500"
                >
                  No se encontraron clientes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}