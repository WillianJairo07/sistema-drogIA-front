import { Edit, UserCheck, UserX } from "lucide-react";

export function UserList({ users, onEdit, onToggleStatus }) {
  return (
    <div className="usuarios-table-wrapper">
      <table className="usuarios-table">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Estado</th>
            <th style={{ textAlign: "right" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td style={{ fontWeight: 500, color: "#1e293b" }}>{user.name}</td>
              <td style={{ color: "#64748b" }}>{user.email}</td>
              <td style={{ color: "#64748b" }}>{user.role}</td>
              <td>
                <span
                  className={`badge-usuario ${
                    user.active ? "badge-activo" : "badge-inactivo"
                  }`}
                >
                  {user.active ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td style={{ textAlign: "right" }}>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                  {/* Editar */}
                  <button
                    type="button"
                    onClick={() => onEdit(user)}
                    title="Editar usuario"
                    className="usuarios-action-btn"
                  >
                    <Edit className="h-4 w-4" />
                  </button>

                  {/* Activar / Desactivar */}
                  <button
                    type="button"
                    onClick={() => onToggleStatus(user.id)}
                    title={user.active ? "Desactivar" : "Activar"}
                    className="usuarios-action-btn"
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
              <td colSpan="5" style={{ textAlign: "center", color: "#64748b", padding: "32px" }}>
                No se encontraron usuarios.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}