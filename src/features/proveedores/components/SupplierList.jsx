import { Edit, Trash2 } from "lucide-react";


export function SupplierList({ suppliers, onEdit, onDelete }) {
  return (
    <div className="proveedores-table-wrapper">
      <table className="proveedores-table">
        <thead>
          <tr>
            <th>Proveedor</th>
            <th>RUC</th>
            <th>Teléfono</th>
            <th>Correo</th>
            <th style={{ textAlign: "right" }}>Acción</th>
          </tr>
        </thead>

        <tbody>
          {suppliers.length > 0 ? (
            suppliers.map((supplier) => (
              <tr key={supplier.id}>
                <td style={{ fontWeight: 500, color: "#334155" }}>
                  {supplier.name}
                </td>

                <td style={{ whiteSpace: "nowrap", color: "#64748b" }}>
                  {supplier.document}
                </td>

                <td style={{ whiteSpace: "nowrap", color: "#64748b" }}>
                  {supplier.phone}
                </td>

                <td style={{ color: "#64748b" }}>
                  {supplier.email}
                </td>

                <td style={{ textAlign: "right" }}>
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                    <button
                      type="button"
                      onClick={() => onEdit(supplier)}
                      title="Editar proveedor"
                      className="proveedores-action-btn"
                    >
                      <Edit className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(supplier.id)}
                      title="Eliminar proveedor"
                      className="proveedores-action-btn proveedores-action-btn-danger"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", color: "#64748b", padding: "32px" }}>
                No se encontraron proveedores.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}