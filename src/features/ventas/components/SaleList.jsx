

export function SaleList({ sales, onSelect }) {
  return (
    <div className="ventas-card">
      <div className="ventas-card-header">
        <h3 className="ventas-header-title" style={{ fontSize: "18px" }}>
          Ventas registradas
        </h3>
        <p className="ventas-header-subtitle">
          Consulta las ventas generadas a partir de las cotizaciones aceptadas.
        </p>
      </div>

      <div className="ventas-table-wrapper">
        <table className="ventas-table">
          <thead>
            <tr>
              <th>Venta</th>
              <th>Cotización</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {sales.length > 0 ? (
              sales.map((sale) => (
                <tr key={sale.id}>
                  <td style={{ fontWeight: 500 }}>{sale.number}</td>
                  <td>{sale.quoteNumber}</td>
                  <td>{sale.client.name}</td>
                  <td>{sale.date}</td>
                  <td style={{ fontWeight: 500 }}>
                    S/ {sale.total.toFixed(2)}
                  </td>
                  <td>
                    <span
                      className={`badge-venta ${
                        sale.status === "En proceso"
                          ? "badge-proceso"
                          : sale.status === "Disponible"
                          ? "badge-disponible"
                          : sale.status === "Entregada"
                          ? "badge-entregada"
                          : ""
                      }`}
                    >
                      {sale.status}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => onSelect(sale)}
                      className="ventas-btn-primary"
                      style={{ padding: "6px 12px", fontSize: "12px" }}
                    >
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", color: "#64748b", padding: "32px" }}>
                  No hay ventas registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}