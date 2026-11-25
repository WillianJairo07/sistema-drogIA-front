import { useState } from "react";


const initialForm = {
  name: "",
  email: "",
  role: "Vendedor",
  password: "",
  active: true,
};

export function UserForm({ user, onSave, onCancel }) {
  const [form, setForm] = useState(
    user ? { ...user, password: "" } : initialForm
  );

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onSave({
      ...form,
      id: user?.id ?? Date.now(),
    });
  };

  return (
    <div className="usuarios-card">
      <h3 className="usuarios-card-title">
        {user ? "Editar Usuario" : "Nuevo Usuario"}
      </h3>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div className="usuarios-form-grid">
          <div>
            <label className="usuarios-label">Nombre</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="usuarios-input"
              placeholder="Nombre completo"
            />
          </div>

          <div>
            <label className="usuarios-label">Correo</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="usuarios-input"
              placeholder="correo@drogia.com"
            />
          </div>

          <div>
            <label className="usuarios-label">Rol</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="usuarios-select"
            >
              <option value="Administrador">Administrador</option>
              <option value="Vendedor">Vendedor</option>
              <option value="Comprador">Comprador</option>
              <option value="Almacenero">Almacenero</option>
            </select>
          </div>

          <div>
            <label className="usuarios-label">Contraseña</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required={!user}
              className="usuarios-input"
              placeholder={user ? "Dejar vacío para mantenerla" : "Contraseña"}
            />
          </div>
        </div>

        <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#334155", cursor: "pointer" }}>
          <input
            type="checkbox"
            name="active"
            checked={form.active}
            onChange={handleChange}
            style={{ width: "16px", height: "16px", cursor: "pointer" }}
          />
          Usuario activo
        </label>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "8px" }}>
          <button
            type="button"
            onClick={onCancel}
            className="usuarios-btn-secondary"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="usuarios-btn-primary"
          >
            {user ? "Guardar Cambios" : "Crear Usuario"}
          </button>
        </div>
      </form>
    </div>
  );
}