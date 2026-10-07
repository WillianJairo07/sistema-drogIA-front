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
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div>
        <h3 className="text-lg font-semibold text-[#17324c]">
          Nuevo plazo de entrega
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Registra el plazo acordado para una orden de compra.
        </p>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Orden de compra
          </label>

          <select
            value={orderId}
            onChange={(event) => setOrderId(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#17324c]"
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
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Fecha límite de entrega
          </label>

          <input
            type="date"
            value={deadline}
            onChange={(event) => setDeadline(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#17324c]"
          />
        </div>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="rounded-lg bg-[#17324c] px-4 py-2 text-sm font-medium text-white hover:bg-[#234968]"
        >
          Registrar Plazo
        </button>
      </div>
    </form>
  );
}