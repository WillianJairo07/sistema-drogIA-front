import { useState } from "react";

import { CotizacionForm } from "../features/cotizaciones/components/CotizacionForm";

export function CotizacionesPage() {
  const [showForm, setShowForm] = useState(false);
  const [quotes, setQuotes] = useState([]);

  const handleCreateQuote = (quote) => {
    setQuotes((currentQuotes) => [...currentQuotes, quote]);
    setShowForm(false);
  };

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

      {/* Nueva cotización */}
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
        <CotizacionForm
          onCancel={() => setShowForm(false)}
          onGenerate={handleCreateQuote}
        />
      )}

      {/* Lista */}
      {!showForm && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          {quotes.length === 0 ? (
            <p className="text-sm text-slate-500">
              No hay cotizaciones registradas.
            </p>
          ) : (
            <div className="space-y-3">
              {quotes.map((quote) => (
                <div
                  key={quote.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 p-4"
                >
                  <div>
                    <p className="font-medium text-[#17324c]">
                      {quote.number}
                    </p>

                    <p className="text-sm text-slate-500">
                      {quote.client.name} · {quote.date}
                    </p>
                  </div>

                  <p className="font-semibold text-[#17324c]">
                    S/ {quote.total.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}