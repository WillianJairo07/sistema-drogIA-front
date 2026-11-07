
export function InventoryList({ inventory = [] }) {
  return (
    <div className="inventario-card">
      <div className="inventario-table-wrapper">
        <table className="inventario-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Lote</th>
              <th>Stock</th>
              <th>Vencimiento</th>
              <th>Estado</th>
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

                    <td style={{ color: "#64748b" }}>
                      {item.lot}
                    </td>

                    <td style={{ color: "#64748b" }}>
                      {item.stock}
                    </td>

                    <td style={{ color: "#64748b" }}>
                      {item.expiration}
                    </td>

                    <td>
                      <span
                        className={`badge-inventario ${
                          lowStock ? "badge-stock-bajo" : "badge-disponible"
                        }`}
                      >
                        {lowStock ? "Stock bajo" : "Disponible"}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="5"
                  style={{ textAlign: "center", color: "#64748b", padding: "32px" }}
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