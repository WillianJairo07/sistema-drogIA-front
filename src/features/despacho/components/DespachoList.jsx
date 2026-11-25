export function DespachoList({ dispatches = [] }) {
  return (
    <div className="despacho-card">
      <h3 className="despacho-card-title">Despachos registrados</h3>

      <div className="despacho-table-wrapper">
        <table className="despacho-table">
          <thead>
            <tr>
              <th>Guía / Código</th>
              <th>Tercerizador</th>
              <th>RUC / Doc.</th>
              <th>Producto</th>
              <th>Orden de Compra</th>
              <th>Cantidad</th>
              <th>Fecha</th>
              <th>Estado</th>
            </tr>
          </thead>

          <tbody>
            {dispatches.length > 0 ? (
              dispatches.map((row) => (
                <tr key={row.id}>
                  <td style={{ fontWeight: 600, color: "#17324c", whiteSpace: "nowrap" }}>
                    {row.code}
                  </td>
                  <td style={{ fontWeight: 500, color: "#1e293b" }}>
                    {row.thirdPartyName}
                  </td>
                  <td style={{ color: "#64748b", whiteSpace: "nowrap" }}>
                    {row.thirdPartyDoc}
                  </td>
                  <td style={{ color: "#1e293b" }}>
                    {row.product}
                  </td>
                  <td style={{ color: "#475569", whiteSpace: "nowrap" }}>
                    {row.purchaseOrderCode}
                  </td>
                  <td style={{ color: "#334155", whiteSpace: "nowrap" }}>
                    {row.quantity}
                  </td>
                  <td style={{ color: "#64748b", whiteSpace: "nowrap" }}>
                    {row.date}
                  </td>
                  <td>
                    <span className="despacho-badge">
                      {row.status || "Programado"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="despacho-empty">
                  No hay despachos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}