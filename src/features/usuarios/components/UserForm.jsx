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
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-5 text-lg font-semibold text-[#17324c]">
        {user ? "Editar Usuario" : "Nuevo Usuario"}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Nombre
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#17324c]"
              placeholder="Nombre completo"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Correo
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#17324c]"
              placeholder="correo@drogia.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Rol
            </label>

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#17324c]"
            >
              <option value="Administrador">Administrador</option>
              <option value="Vendedor">Vendedor</option>
              <option value="Comprador">Comprador</option>
              <option value="Almacenero">Almacenero</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Contraseña
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required={!user}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#17324c]"
              placeholder={user ? "Dejar vacío para mantenerla" : "Contraseña"}
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            name="active"
            checked={form.active}
            onChange={handleChange}
            className="h-4 w-4"
          />

          Usuario activo
        </label>

        <div className="flex justify-end gap-3">
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
            {user ? "Guardar Cambios" : "Crear Usuario"}
          </button>
        </div>
      </form>
    </div>
  );
}