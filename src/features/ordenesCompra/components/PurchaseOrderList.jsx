const IGV_RATE = 0.18;

function calcularTotalesOrden(order) {
  const subtotalCalculado = (order?.items || []).reduce(
    (sum, item) =>
      sum +
      (Number(item.subtotal) ||
        (Number(item.quantity) || 0) * (Number(item.price) || 0)),
    0
  );
  const subtotal = Number(order?.subtotal ?? subtotalCalculado);
  const igv = Number(order?.igv ?? subtotal * IGV_RATE);
  const total = Number(order?.total ?? subtotal + igv);
  return { subtotal, igv, total };
}

export function PurchaseOrderList({
  orders,
  onStatusChange,
  onRegisterReceipt,
}) {
  return (
    <div className="ordenes-card" style={{ padding: 0, overflow: "hidden" }}>
      <div className="ordenes-card-header" style={{ padding: "24px", margin: 0 }}>
        <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#17324c", margin: 0 }}>
          Órdenes de compra
        </h3>

        <p className="ordenes-header-subtitle">
          Consulta y controla las órdenes realizadas a los proveedores.
        </p>
      </div>

      <div className="ordenes-table-wrapper" style={{ margin: 0, border: "none", borderRadius: 0 }}>
        <table className="ordenes-table">
          <thead>
            <tr>
              <th>Orden</th>
              <th>Proveedor</th>
              <th>Fecha</th>
              <th>Productos</th>
              <th>Subtotal</th>
              <th>IGV (18%)</th>
              <th>Total</th>
              <th>Estado</th>
              <th style={{ textAlign: "right" }}>Acción</th>
            </tr>
          </thead>

          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => {
                const { subtotal, igv, total } = calcularTotalesOrden(order);
                return (
                  <tr key={order.id}>
                    <td style={{ fontWeight: 500, color: "#334155", whiteSpace: "nowrap" }}>
                      {order.number}
                    </td>

                    <td style={{ color: "#475569" }}>
                      {order.supplier?.name || "-"}
                    </td>

                    <td style={{ color: "#64748b", whiteSpace: "nowrap" }}>
                      {order.date}
                    </td>

                    <td style={{ color: "#64748b" }}>
                      {order.items?.length || 0}
                    </td>

                    <td style={{ color: "#64748b", whiteSpace: "nowrap" }}>
                      S/ {subtotal.toFixed(2)}
                    </td>

                    <td style={{ color: "#64748b", whiteSpace: "nowrap" }}>
                      S/ {igv.toFixed(2)}
                    </td>

                    <td style={{ fontWeight: 500, color: "#334155", whiteSpace: "nowrap" }}>
                      S/ {total.toFixed(2)}
                    </td>

                    <td>
                      <select
                        value={order.status}
                        onChange={(event) =>
                          onStatusChange(
                            order.id,
                            event.target.value
                          )
                        }
                        className={`ordenes-status-select ${
                          order.status === "Pendiente"
                            ? "badge-orden-pendiente"
                            : order.status === "Enviada"
                            ? "badge-orden-enviada"
                            : order.status === "Recibida"
                            ? "badge-orden-recibida"
                            : "badge-orden-cancelada"
                        }`}
                      >
                        <option value="Pendiente">Pendiente</option>
                        <option value="Enviada">Enviada</option>
                        <option value="Recibida">Recibida</option>
                        <option value="Cancelada">Cancelada</option>
                      </select>
                    </td>

                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      {order.status === "Recibida" &&
                      !order.receiptRegistered ? (
                        <button
                          type="button"
                          onClick={() =>
                            onRegisterReceipt(order.id)
                          }
                          className="ordenes-btn-primary"
                          style={{ padding: "6px 12px", fontSize: "12px" }}
                        >
                          Registrar recepción
                        </button>
                      ) : order.receiptRegistered ? (
                        <span style={{ fontSize: "12px", fontWeight: 500, color: "#059669" }}>
                          Recepción registrada
                        </span>
                      ) : (
                        <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                          —
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="9"
                  style={{ textAlign: "center", color: "#64748b", padding: "32px" }}
                >
                  No hay órdenes de compra registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}