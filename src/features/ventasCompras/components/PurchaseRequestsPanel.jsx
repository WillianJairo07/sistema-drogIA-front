import { useNavigate } from "react-router-dom";


export function PurchaseRequestsPanel({ items }) {
  const navigate = useNavigate();

  return (
    <div className="compras-card">
      <div className="compras-card-header">
        <h3 className="compras-header-title" style={{ fontSize: "18px" }}>
          Solicitudes de compra
        </h3>

        <p className="compras-header-subtitle">
          Productos de ventas aceptadas que deben ser adquiridos por Compras.
        </p>
      </div>

      <div className="compras-table-wrapper">
        <table className="compras-table">
          <thead>
            <tr>
              <th>Venta</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th style={{textAlign: "center"}}>Estado</th>
              <th style={{ textAlign: "center" }}>Acción</th>
            </tr>
          </thead>

          <tbody>
            {items.length > 0 ? (
              items.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 500 }}>{item.saleNumber}</td>
                  <td style={{ color: "#475569" }}>{item.product}</td>
                  <td style={{ color: "#475569" }}>{item.quantity}</td>
                  <td style={{textAlign: "center"}}>
                    <span
                      className={`badge-compra ${
                        item.status === "Pendiente de compra"
                          ? "badge-pendiente"
                          : item.status === "En compra"
                          ? "badge-en-compra"
                          : "badge-recibido"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td style={{ textAlign: "center" }}>
                    {item.status === "Pendiente de compra" && (
                      <button
                        type="button"
                        onClick={() =>
                          navigate("/dashboard/ordenes-compra", {
                            state: {
                              request: item,
                            },
                          })
                        }
                        className="compras-btn-primary"
                      >
                        Crear orden de compra
                      </button>
                    )}

                    {item.status === "En compra" && (
                      <span className="compras-text-en-proceso">
                        Orden en proceso
                      </span>
                    )}

                    {item.status === "Recibido" && (
                      <span className="compras-text-recibido">
                        Producto recibido
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  style={{ textAlign: "center", color: "#64748b", padding: "32px" }}
                >
                  No hay solicitudes de compra.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}