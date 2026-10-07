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
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div>
        <h3 className="text-lg font-semibold text-[#17324c]">
          {supplier ? "Editar Proveedor" : "Nuevo Proveedor"}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Registra la información del proveedor.
        </p>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Nombre o razón social
          </label>

          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ej. Laboratorios del Sur S.A.C."
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#17324c]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            RUC
          </label>

          <input
            type="text"
            value={document}
            onChange={(event) => setDocument(event.target.value)}
            placeholder="Ej. 20123456789"
            maxLength={11}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#17324c]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Teléfono
          </label>

          <input
            type="text"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Ej. 987654321"
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#17324c]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Correo electrónico
          </label>

          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Ej. contacto@proveedor.com"
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
          {supplier ? "Guardar Cambios" : "Registrar Proveedor"}
        </button>
      </div>
    </form>
  );
}