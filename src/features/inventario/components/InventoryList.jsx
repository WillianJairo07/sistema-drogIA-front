export function InventoryList({ inventory = [], onEdit }) {
  return (
    <div className="inventario-card">
      <div className="inventario-table-wrapper">
        <table className="inventario-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Orden de Compra</th>
              <th>Lote</th>
              <th>Stock</th>
              <th>Vencimiento</th>
              <th>Estado</th>
              {onEdit && <th style={{ textAlign: "right" }}>Acción</th>}
            </tr>
          </thead>

          <tbody>
            {inventory.length > 0 ? (
              inventory.map((item) => {
                const lowStock = item.stock <= item.minimumStock;

                return (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 500, color: "#1e293b" }}>
                      {item.product}
                    </td>

                    <td
                      style={{
                        fontWeight: 500,
                        color: "#17324c",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.purchaseOrderCode || "—"}
                    </td>

                    <td style={{ color: "#64748b" }}>{item.lot}</td>

                    <td style={{ color: "#64748b" }}>{item.stock}</td>

                    <td style={{ color: "#64748b" }}>{item.expiration}</td>

                    <td>
                      <span
                        className={`badge-inventario ${
                          lowStock ? "badge-stock-bajo" : "badge-disponible"
                        }`}
                      >
                        {lowStock ? "Stock bajo" : "Disponible"}
                      </span>
                    </td>

                    {onEdit && (
                      <td style={{ textAlign: "right" }}>
                        <button
                          type="button"
                          onClick={() => onEdit(item)}
                          className="inventario-btn-edit"
                        >
                          Editar
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={onEdit ? "7" : "6"}
                  style={{
                    textAlign: "center",
                    color: "#64748b",
                    padding: "32px",
                  }}
                >
                  No hay productos en el inventario.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}