import { useState } from "react";

export function ProductForm({ product, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    healthRegistration: product?.healthRegistration || "",
    price: product?.price || "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.healthRegistration.trim() ||
      !formData.price
    ) {
      return;
    }

    onSave({
      id: product?.id || Date.now(),
      name: formData.name.trim(),
      healthRegistration: formData.healthRegistration.trim(),
      price: Number(formData.price),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="productos-card">
      <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#17324c", marginBottom: "20px", marginTop: 0 }}>
        {product ? "Editar producto" : "Nuevo producto"}
      </h2>

      <div className="productos-form-grid">
        <div>
          <label className="productos-label">Nombre</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="productos-input"
            placeholder="Ej. Paracetamol"
          />
        </div>

        <div>
          <label className="productos-label">Registro sanitario</label>
          <input
            type="text"
            name="healthRegistration"
            value={formData.healthRegistration}
            onChange={handleChange}
            className="productos-input"
            placeholder="Ej. RSA-12345"
          />
        </div>

        <div>
          <label className="productos-label">Precio</label>
          <input
            type="number"
            name="price"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            className="productos-input"
            placeholder="0.00"
          />
        </div>
      </div>

      <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
        <button
          type="button"
          onClick={onCancel}
          className="productos-btn-secondary"
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="productos-btn-primary"
        >
          Guardar producto
        </button>
      </div>
    </form>
  );
}