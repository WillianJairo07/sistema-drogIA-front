import { useState } from "react";

import { CotizacionItems } from "./CotizacionItems";
import { ProductSearch } from "../../productos/components/ProductSearch";

export function CotizacionForm({ onCancel }) {
  const [products, setProducts] = useState([]);

  const addProduct = (product) => {
    const newProduct = {
      ...product,
      quantity: 1,
    };

    setProducts((currentProducts) => [
      ...currentProducts,
      newProduct,
    ]);
  };

  const total = products.reduce(
    (sum, product) => sum + product.quantity * product.price,
    0
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Encabezado */}
      <div>
        <h3 className="text-lg font-semibold text-[#17324c]">
          Nueva Cotización
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Registra los datos del cliente y los productos solicitados.
        </p>
      </div>

      {/* Datos de la cotización */}
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Cliente
          </label>

          <input
            type="text"
            placeholder="Buscar cliente..."
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#17324c]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Fecha
          </label>

          <input
            type="date"
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#17324c]"
          />
        </div>
      </div>

      {/* Productos */}
      <div className="mt-8">
        <div className="mb-4">
          <h4 className="text-base font-semibold text-[#17324c]">
            Productos
          </h4>

          <p className="mt-1 text-sm text-slate-500">
            Busca y agrega los productos solicitados por el cliente.
          </p>
        </div>

        <ProductSearch onSelect={addProduct} />

        <CotizacionItems products={products} />
      </div>

      {/* Resumen */}
      <div className="mt-6 flex justify-end">
        <div className="w-full max-w-xs rounded-lg bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600">
              Total
            </span>

            <span className="text-lg font-semibold text-[#17324c]">
              S/ {total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="mt-8 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancelar
        </button>

        <button
          type="button"
          className="rounded-lg bg-[#17324c] px-4 py-2 text-sm font-medium text-white hover:bg-[#234968]"
        >
          Generar Cotización
        </button>
      </div>
    </div>
  );
}