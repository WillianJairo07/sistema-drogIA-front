

export function SaleDetail({ sale, onClose, onStatusChange }) {
  const handleRegisterDelivery = () => {
    onStatusChange(sale.id, "Entregada");
  };

  return (
    <div className="ventas-card">
      {/* Cabecera */}
      <div className="ventas-card-header" style={{ display: "flex", justifyContent: "space-linejoin", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h3 className="ventas-header-title" style={{ fontSize: "18px" }}>
            {sale.number}
          </h3>
          <p className="ventas-header-subtitle">
            Generada desde la cotización {sale.quoteNumber}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="ventas-btn-secondary"
        >
          Volver
        </button>
      </div>

      {/* Cliente y Fecha */}
      <div className="ventas-detail-grid">
        <div>
          <p className="ventas-detail-label">Cliente</p>
          <p className="ventas-detail-value">{sale.client.name}</p>
        </div>

        <div>
          <p className="ventas-detail-label">Fecha</p>
          <p className="ventas-detail-value">{sale.date}</p>
        </div>
      </div>

      {/* Tabla de ítems */}
      <div className="ventas-table-wrapper">
        <table className="ventas-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th style={{ textAlign: "right" }}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {sale.items.map((item) => (
              <tr key={item.product.id}>
                <td>{item.product.name}</td>
                <td style={{ color: "#64748b" }}>{item.quantity}</td>
                <td style={{ color: "#64748b" }}>S/ {item.price.toFixed(2)}</td>
                <td style={{ textAlign: "right", fontWeight: 500 }}>
                  S/ {(item.quantity * item.price).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pie con Estado y Total alineados correctamente */}
      <div className="ventas-detail-footer">
        <div>
          <p className="ventas-detail-label">Estado</p>
          <span
            className={`badge-venta ${
              sale.status === "En proceso"
                ? "badge-proceso"
                : sale.status === "Disponible"
                ? "badge-disponible"
                : "badge-entregada"
            }`}
          >
            {sale.status}
          </span>
        </div>

        <div>
          <p className="ventas-total-label">Total</p>
          <p className="ventas-total-amount">S/ {sale.total.toFixed(2)}</p>
        </div>
      </div>

      {/* Botón de acción */}
      {sale.status === "Disponible" && (
        <div className="ventas-actions-footer">
          <button
            type="button"
            onClick={handleRegisterDelivery}
            className="ventas-btn-primary"
          >
            Registrar entrega
          </button>
        </div>
      )}

      {sale.status === "Entregada" && (
        <div className="ventas-alert-success">
          La venta fue entregada al cliente.
        </div>
      )}
    </div>
  );
}