import { Edit, Trash2 } from "lucide-react";

export function ProductList({ products, onEdit, onDelete }) {
  if (products.length === 0) {
    return (
      <div className="productos-card" style={{ textAlign: "center", padding: "32px" }}>
        <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
          No se encontraron productos.
        </p>
      </div>
    );
  }

  return (
    <div className="productos-table-wrapper">
      <table className="productos-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Registro sanitario</th>
            <th>Precio</th>
            <th style={{ textAlign: "right" }}>Acción</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td style={{ fontWeight: 500, color: "#1e293b" }}>
                {product.name}
              </td>

              <td style={{ color: "#64748b" }}>
                {product.healthRegistration}
              </td>

              <td style={{ whiteSpace: "nowrap", color: "#334155" }}>
                S/ {product.price.toFixed(2)}
              </td>

              <td style={{ whiteSpace: "nowrap", textAlign: "right" }}>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                  {/* Botón Editar con Icono */}
                  <button
                    type="button"
                    onClick={() => onEdit(product)}
                    title="Editar producto"
                    className="productos-action-btn"
                  >
                    <Edit className="h-4 w-4" />
                  </button>

                  {/* Botón Eliminar con Icono */}
                  <button
                    type="button"
                    onClick={() => onDelete(product.id)}
                    title="Eliminar producto"
                    className="productos-action-btn productos-action-btn-danger"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}