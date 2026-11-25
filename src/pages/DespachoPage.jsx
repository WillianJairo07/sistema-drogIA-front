import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { DespachoForm } from "../features/despacho/components/DespachoForm";
import { DespachoList } from "../features/despacho/components/DespachoList";
import "../styles/despacho.css";

export function DespachoPage() {
  const { inventory = [], dispatches = [], onCreateDispatch } = useOutletContext();
  const [showForm, setShowForm] = useState(false);

  const handleSave = (record) => {
    if (onCreateDispatch) {
      onCreateDispatch(record);
    }
    setShowForm(false);
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