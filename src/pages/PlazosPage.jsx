import { useState } from "react";

import { DeliveryDeadlineForm } from "../features/plazos/components/DeliveryDeadlineForm";
import { DeliveryDeadlineList } from "../features/plazos/components/DeliveryDeadlineList";

const initialOrders = [
  {
    id: 1,
    number: "OC-000101",
    supplier: {
      name: "Laboratorios del Sur S.A.C.",
    },
  },
  {
    id: 2,
    number: "OC-000102",
    supplier: {
      name: "Distribuidora Médica Perú S.A.C.",
    },
  },
];

export function PlazosPage() {
  const [deadlines, setDeadlines] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const handleSave = (deadline) => {
    setDeadlines((currentDeadlines) => [
      ...currentDeadlines,
      deadline,
    ]);

    setShowForm(false);
  };

  const handleExtension = (deadlineId) => {
    setDeadlines((currentDeadlines) =>
      currentDeadlines.map((item) =>
        item.id === deadlineId
          ? {
              ...item,
              extension: 5,
              status: "Con extensión",
            }
          : item
      )
    );
  };

  const handlePenalty = (deadlineId) => {
    setDeadlines((currentDeadlines) =>
      currentDeadlines.map((item) =>
        item.id === deadlineId
          ? {
              ...item,
              penalty: 10,
              status: "Incumplido",
            }
          : item
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#17324c]">
            Plazos y Penalidades
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Controla los plazos de entrega y los incumplimientos de los proveedores.
          </p>
        </div>

        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="rounded-lg bg-[#17324c] px-4 py-2 text-sm font-medium text-white hover:bg-[#234968]"
          >
            Nuevo Plazo
          </button>
        )}
      </div>

      {showForm ? (
        <DeliveryDeadlineForm
          orders={initialOrders}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <DeliveryDeadlineList
          deadlines={deadlines}
          onExtension={handleExtension}
          onPenalty={handlePenalty}
        />
      )}
    </div>
  );
}