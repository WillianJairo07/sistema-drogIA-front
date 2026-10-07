import { Edit, UserCheck, UserX } from "lucide-react";

export function UserList({ users, onEdit, onToggleStatus }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-6 py-4 font-semibold">Usuario</th>
              <th className="px-6 py-4 font-semibold">Correo</th>
              <th className="px-6 py-4 font-semibold">Rol</th>
              <th className="px-6 py-4 font-semibold">Estado</th>
              <th className="px-6 py-4 text-right font-semibold">Acción</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-800">
                  {user.name}
                </td>

                <td className="px-6 py-4 text-slate-600">
                  {user.email}
                </td>

                <td className="px-6 py-4 text-slate-600">
                  {user.role}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      user.active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.active ? "Activo" : "Inactivo"}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">

                    {/* Editar */}
                    <button
                      type="button"
                      onClick={() => onEdit(user)}
                      title="Editar usuario"
                      className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-[#17324c]"
                    >
                      <Edit className="h-4 w-4" />
                    </button>

                    {/* Activar / Desactivar */}
                    <button
                      type="button"
                      onClick={() => onToggleStatus(user.id)}
                      title={user.active ? "Desactivar" : "Activar"}
                      className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                    >
                      {user.active ? (
                        <UserX className="h-4 w-4" />
                      ) : (
                        <UserCheck className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-8 text-center text-slate-500"
                >
                  No se encontraron usuarios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}