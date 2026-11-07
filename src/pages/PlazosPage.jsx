import { useState } from "react";
import { DeliveryDeadlineForm } from "../features/plazos/components/DeliveryDeadlineForm";
import { DeliveryDeadlineList } from "../features/plazos/components/DeliveryDeadlineList";
import "../styles/plazos.css";

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
    <div className="plazos-container">
      <div className="plazos-header-wrapper">
        <div>
          <h2 className="plazos-header-title">Plazos y Penalidades</h2>

          <p className="plazos-header-subtitle">
            Controla los plazos de entrega y los incumplimientos de los proveedores.
          </p>
        </div>

        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="plazos-btn-primary"
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