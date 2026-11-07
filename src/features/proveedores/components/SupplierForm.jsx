import { useState } from "react";

export function SupplierForm({ supplier, onSave, onCancel }) {
  const [name, setName] = useState(supplier?.name || "");
  const [document, setDocument] = useState(supplier?.document || "");
  const [phone, setPhone] = useState(supplier?.phone || "");
  const [email, setEmail] = useState(supplier?.email || "");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!name.trim()) {
      setError("Ingresa el nombre o razón social.");
      return;
    }

    if (!document.trim()) {
      setError("Ingresa el RUC del proveedor.");
      return;
    }

    if (document.trim().length !== 11) {
      setError("El RUC debe tener 11 dígitos.");
      return;
    }

    if (!phone.trim()) {
      setError("Ingresa el teléfono del proveedor.");
      return;
    }

    if (!email.trim()) {
      setError("Ingresa el correo del proveedor.");
      return;
    }

    onSave({
      id: supplier?.id || Date.now(),
      name: name.trim(),
      document: document.trim(),
      phone: phone.trim(),
      email: email.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="proveedores-card">
      <div>
        <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#17324c", margin: 0 }}>
          {supplier ? "Editar Proveedor" : "Nuevo Proveedor"}
        </h3>

        <p className="proveedores-header-subtitle">
          Registra la información del proveedor.
        </p>
      </div>

      <div className="proveedores-form-grid">
        <div>
          <label className="proveedores-label">Nombre o razón social</label>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ej. Laboratorios del Sur S.A.C."
            className="proveedores-input"
          />
        </div>

        <div>
          <label className="proveedores-label">RUC</label>
          <input
            type="text"
            value={document}
            onChange={(event) => setDocument(event.target.value)}
            placeholder="Ej. 20123456789"
            maxLength={11}
            className="proveedores-input"
          />
        </div>

        <div>
          <label className="proveedores-label">Teléfono</label>
          <input
            type="text"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Ej. 987654321"
            className="proveedores-input"
          />
        </div>

        <div>
          <label className="proveedores-label">Correo electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Ej. contacto@proveedor.com"
            className="proveedores-input"
          />
        </div>
      </div>

      {error && <p className="proveedores-error-text">{error}</p>}

      <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
        <button
          type="button"
          onClick={onCancel}
          className="proveedores-btn-secondary"
        >
          Cancelar
        </button>

        <button type="submit" className="proveedores-btn-primary">
          {supplier ? "Guardar Cambios" : "Registrar Proveedor"}
        </button>
      </div>
    </form>
  );
}