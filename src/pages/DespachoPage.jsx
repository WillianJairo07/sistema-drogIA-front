import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { DespachoForm } from "../features/despacho/components/DespachoForm";
import { DespachoList } from "../features/despacho/components/DespachoList";
import "../styles/despacho.css";

const ESTADOS_PEDIDO = [
  "Pendiente",
  "Asignado",
  "Verificado",
  "En despacho",
  "En tránsito",
  "Entregado",
];

export function DespachoPage() {
  const {
    inventory = [],
    dispatches = [],
    onCreateDispatch,
    pedidos = [],
    onTomarPedido,
    onVerificarPedido,
    onPedidoStatusChange,
  } = useOutletContext();
  const [showForm, setShowForm] = useState(false);

  const handleSave = async (record) => {
    try {
      if (onCreateDispatch) {
        await onCreateDispatch(record);
      }
      setShowForm(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleTomar = async (pedidoId) => {
    try {
      await onTomarPedido?.(pedidoId);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleVerificar = async (pedido) => {
    try {
      await onVerificarPedido?.(pedido.id, true, true);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEstado = async (pedidoId, estado) => {
    try {
      await onPedidoStatusChange?.(pedidoId, estado);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="despacho-container">
      <div className="despacho-header">
        <div>
          <h1 className="despacho-title">Gestión de Despacho</h1>
          <p className="despacho-subtitle">
            Registra y controla los despachos asignados a tercerizadores.
          </p>
        </div>

        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="despacho-btn-primary"
          >
            Nuevo Despacho
          </button>
        )}
      </div>

      <div className="despacho-card">
        <h3 className="despacho-card-title">Pedidos de almacén</h3>

        {pedidos.length === 0 ? (
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
            No hay pedidos registrados.
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ backgroundColor: "#f1f5f9", textAlign: "left" }}>
                  <th style={{ padding: "10px 12px" }}>Pedido</th>
                  <th style={{ padding: "10px 12px" }}>Productos</th>
                  <th style={{ padding: "10px 12px" }}>Estado</th>
                  <th style={{ padding: "10px 12px" }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((pedido) => (
                  <tr key={pedido.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "10px 12px", fontWeight: 500 }}>
                      {pedido.number || `#${pedido.id}`}
                    </td>
                    <td style={{ padding: "10px 12px", color: "#64748b" }}>
                      {pedido.product || "-"}
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <select
                        value={pedido.status}
                        onChange={(event) => handleEstado(pedido.id, event.target.value)}
                        style={{ padding: "6px 8px", border: "1px solid #cbd5e1", borderRadius: "6px" }}
                      >
                        {ESTADOS_PEDIDO.map((estado) => (
                          <option key={estado} value={estado}>
                            {estado}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {pedido.status === "Pendiente" && (
                          <button
                            type="button"
                            onClick={() => handleTomar(pedido.id)}
                            className="despacho-btn-primary"
                            style={{ padding: "6px 10px", fontSize: "12px" }}
                          >
                            Tomar
                          </button>
                        )}
                        {(pedido.status === "Asignado" ||
                          pedido.status === "Verificado") && (
                          <button
                            type="button"
                            onClick={() => handleVerificar(pedido)}
                            className="despacho-btn-secondary"
                            style={{ padding: "6px 10px", fontSize: "12px" }}
                          >
                            Verificar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <DespachoForm
          inventory={inventory}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}

      <DespachoList dispatches={dispatches} />
    </div>
  );
}
