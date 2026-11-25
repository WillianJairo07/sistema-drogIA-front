import { Edit, Trash2 } from "lucide-react";

export function ClientList({ clients, onEdit, onDelete }) {
  return (
    <div className="clientes-table-wrapper">
      <table className="clientes-table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>RUC</th>
            <th style={{ textAlign: "right" }}>Acción</th>
          </tr>
        </thead>
        <tbody>
          {clients.length > 0 ? (
            clients.map((client) => (
              <tr key={client.id}>
                <td style={{ fontWeight: 500 }}>{client.name}</td>
                <td style={{ color: "#64748b" }}>{client.document}</td>
                <td style={{ textAlign: "right" }}>
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                    {/* Botón Editar con Icono */}
                    <button
                      type="button"
                      onClick={() => onEdit(client)}
                      title="Editar cliente"
                      className="clientes-action-btn"
                    >
                      <Edit className="h-4 w-4" />
                    </button>

                    {/* Botón Eliminar con Icono */}
                    <button
                      type="button"
                      onClick={() => onDelete(client.id)}
                      title="Eliminar cliente"
                      className="clientes-action-btn clientes-action-btn-danger"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center", color: "#64748b", padding: "32px" }}>
                No se encontraron clientes.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}