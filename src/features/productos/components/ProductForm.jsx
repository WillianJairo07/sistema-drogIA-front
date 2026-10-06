import { useState } from "react";

export function ProductForm({ product, onSave, onCancel }) {
  const [name, setName] = useState(product?.name || "");
  const [lot, setLot] = useState(product?.lot || "");
  const [healthRegistration, setHealthRegistration] = useState(
    product?.healthRegistration || ""
  );
  const [price, setPrice] = useState(product?.price || "");
  const [stock, setStock] = useState(product?.stock || "");
  const [expiration, setExpiration] = useState(product?.expiration || "");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!name.trim()) {
      setError("Ingresa el nombre del producto.");
      return;
    }

    if (!lot.trim()) {
      setError("Ingresa el lote del producto.");
      return;
    }

    if (!healthRegistration.trim()) {
      setError("Ingresa el registro sanitario.");
      return;
    }

    if (price === "" || Number(price) < 0) {
      setError("Ingresa un precio válido.");
      return;
    }

    if (stock === "" || Number(stock) < 0) {
      setError("Ingresa un stock válido.");
      return;
    }

    if (!expiration) {
      setError("Selecciona la fecha de vencimiento.");
      return;
    }

    onSave({
      id: product?.id || Date.now(),
      name: name.trim(),
      lot: lot.trim(),
      healthRegistration: healthRegistration.trim(),
      price: Number(price),
      stock: Number(stock),
      expiration,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div>
        <h3 className="text-lg font-semibold text-[#17324c]">
          {product ? "Editar Producto" : "Nuevo Producto"}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Registra la información principal del producto.
        </p>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Nombre del producto
          </label>

          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ej. Paracetamol 500 mg"
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#17324c]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Lote
          </label>

          <input
            type="text"
            value={lot}
            onChange={(event) => setLot(event.target.value)}
            placeholder="Ej. LOT-PAR-001"
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#17324c]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Registro sanitario
          </label>

          <input
            type="text"
            value={healthRegistration}
            onChange={(event) =>
              setHealthRegistration(event.target.value)
            }
            placeholder="Ej. RSA-12345"
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#17324c]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Precio
          </label>

          <input
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            placeholder="0.00"
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#17324c]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Stock
          </label>

          <input
            type="number"
            min="0"
            value={stock}
            onChange={(event) => setStock(event.target.value)}
            placeholder="0"
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#17324c]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Fecha de vencimiento
          </label>

          <input
            type="date"
            value={expiration}
            onChange={(event) => setExpiration(event.target.value)}
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
          {product ? "Guardar Cambios" : "Registrar Producto"}
        </button>
      </div>
    </form>
  );
}