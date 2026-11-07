import { useState } from "react";


export function DeliveryDeadlineForm({ orders, onSave, onCancel }) {
  const [orderId, setOrderId] = useState("");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!orderId) {
      setError("Selecciona una orden de compra.");
      return;
    }

    if (!deadline) {
      setError("Selecciona una fecha límite de entrega.");
      return;
    }

    const order = orders.find(
      (item) => item.id === Number(orderId)
    );

    onSave({
      id: Date.now(),
      order,
      deadline,
      status: "Pendiente",
      extension: null,
      penalty: 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="plazos-card">
      <div>
        <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#17324c", margin: 0 }}>
          Nuevo plazo de entrega
        </h3>

        <p className="plazos-header-subtitle">
          Registra el plazo acordado para una orden de compra.
        </p>
      </div>

      <div className="plazos-form-grid">
        <div>
          <label className="plazos-label">Orden de compra</label>

          <select
            value={orderId}
            onChange={(event) => setOrderId(event.target.value)}
            className="plazos-select"
          >
            <option value="">Seleccionar orden...</option>

            {orders.map((order) => (
              <option key={order.id} value={order.id}>
                {order.number} - {order.supplier.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="plazos-label">Fecha límite de entrega</label>

          <input
            type="date"
            value={deadline}
            onChange={(event) => setDeadline(event.target.value)}
            className="plazos-input"
          />
        </div>
      </div>

      {error && <p className="plazos-error-text">{error}</p>}

      <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
        <button
          type="button"
          onClick={onCancel}
          className="plazos-btn-secondary"
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="plazos-btn-primary"
        >
          Registrar Plazo
        </button>
      </div>
    </form>
  );
}