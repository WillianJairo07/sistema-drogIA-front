import { useState } from "react";


export function ClientForm({ client, onSave, onCancel }) {
  const [name, setName] = useState(client?.name || "");
  const [document, setDocument] = useState(client?.document || "");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!name.trim()) {
      setError("Ingresa el nombre o razón social.");
      return;
    }

    if (!document.trim()) {
      setError("Ingresa el RUC del cliente.");
      return;
    }

    if (document.trim().length !== 11) {
      setError("El RUC debe tener 11 dígitos.");
      return;
    }

    onSave({
      id: client?.id || Date.now(),
      name: name.trim(),
      document: document.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="clientes-card">
      <div>
        <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#17324c", margin: 0 }}>
          {client ? "Editar Cliente" : "Nuevo Cliente"}
        </h3>
        <p className="clientes-header-subtitle">
          Registra la información del cliente.
        </p>
      </div>

      <div className="clientes-form-grid">
        <div>
          <label className="clientes-label">Nombre o razón social</label>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ej. Rodríguez S.A.C."
            className="clientes-input"
          />
        </div>

        <div>
          <label className="clientes-label">RUC</label>
          <input
            type="text"
            value={document}
            onChange={(event) => setDocument(event.target.value)}
            placeholder="Ej. 20123456789"
            maxLength={11}
            className="clientes-input"
          />
        </div>
      </div>

      {error && <p className="clientes-error-text">{error}</p>}

      <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
        <button
          type="button"
          onClick={onCancel}
          className="clientes-btn-secondary"
        >
          Cancelar
        </button>

        <button type="submit" className="clientes-btn-primary">
          {client ? "Guardar Cambios" : "Registrar Cliente"}
        </button>
      </div>
    </form>
  );
}