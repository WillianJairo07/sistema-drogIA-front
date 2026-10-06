import { useState } from "react";
import { CotizacionForm } from "../features/cotizaciones/components/CotizacionForm";

export function CotizacionesPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div>
        <h2 className="text-2xl font-semibold text-[#17324c]">
          Gestión de Cotizaciones
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Consulta y gestiona las cotizaciones de los clientes.
        </p>
      </div>

      {/* Botón Nueva Cotización */}
      {!showForm && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="rounded-lg bg-[#17324c] px-4 py-2 text-sm font-medium text-white hover:bg-[#234968]"
          >
            Nueva Cotización
          </button>
        </div>
      )}

      {/* Formulario */}
      {showForm && (
        <CotizacionForm onCancel={() => setShowForm(false)} />
      )}

      {/* Lista de cotizaciones */}
      {!showForm && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            No hay cotizaciones registradas.
          </p>
        </div>
      )}
    </div>
  );
}