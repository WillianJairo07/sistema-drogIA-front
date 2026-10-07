import { useState } from "react";
import { useOutletContext } from "react-router-dom";

import { CotizacionForm } from "../features/cotizaciones/components/CotizacionForm";

export function CotizacionesPage() {
  const { onCreateSale } = useOutletContext();

  const [showForm, setShowForm] = useState(false);
  const [quotes, setQuotes] = useState([]);
  const [message, setMessage] = useState("");

  const handleCreateQuote = (quote) => {
    setQuotes((currentQuotes) => [
      ...currentQuotes,
      {
        ...quote,
        status: "Pendiente",
      },
    ]);

    setShowForm(false);
  };

  const handleAcceptQuote = (quoteId) => {
    setQuotes((currentQuotes) =>
      currentQuotes.map((quote) =>
        quote.id === quoteId
          ? { ...quote, status: "Aceptada" }
          : quote
      )
    );
  };

  const handleConvertToSale = (quote) => {
    const sale = {
      id: Date.now(),
      number: `VEN-${String(Date.now()).slice(-4)}`,
      quoteNumber: quote.number,
      client: quote.client,
      date: quote.date,
      items: quote.products.map((product) => ({
        product,
        quantity: product.quantity,
        price: product.price,
      })),
      total: quote.total,
      status: "Pendiente de compra",
    };

    onCreateSale(sale);

    setQuotes((currentQuotes) =>
      currentQuotes.map((currentQuote) =>
        currentQuote.id === quote.id
          ? { ...currentQuote, status: "Convertida" }
          : currentQuote
      )
    );

    setMessage(
      `La cotización ${quote.number} fue convertida en venta correctamente.`
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-[#17324c]">
          Gestión de Cotizaciones
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Consulta y gestiona las cotizaciones de los clientes.
        </p>
      </div>

      {message && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      )}

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

      {showForm && (
        <CotizacionForm
          onCancel={() => setShowForm(false)}
          onGenerate={handleCreateQuote}
        />
      )}

      {!showForm && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-[#17324c]">
              Cotizaciones registradas
            </h3>
          </div>

          {quotes.length === 0 ? (
            <p className="p-6 text-sm text-slate-500">
              No hay cotizaciones registradas.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-sm">
                <thead className="bg-slate-50">
                  <tr className="text-left text-slate-600">
                    <th className="px-6 py-3 font-medium">Cotización</th>
                    <th className="px-6 py-3 font-medium">Cliente</th>
                    <th className="px-6 py-3 font-medium">Fecha</th>
                    <th className="px-6 py-3 font-medium">Total</th>
                    <th className="px-6 py-3 font-medium">Estado</th>
                    <th className="px-6 py-3 font-medium">Acción</th>
                  </tr>
                </thead>

                <tbody>
                  {quotes.map((quote) => (
                    <tr
                      key={quote.id}
                      className="border-t border-slate-200"
                    >
                      <td className="px-6 py-4 font-medium text-slate-700">
                        {quote.number}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {quote.client.name}
                      </td>

                      <td className="px-6 py-4 text-slate-500">
                        {quote.date}
                      </td>

                      <td className="px-6 py-4 font-medium text-slate-700">
                        S/ {quote.total.toFixed(2)}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                            quote.status === "Aceptada"
                              ? "bg-emerald-100 text-emerald-700"
                              : quote.status === "Convertida"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {quote.status}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {quote.status === "Pendiente" ? (
                          <button
                            type="button"
                            onClick={() =>
                              handleAcceptQuote(quote.id)
                            }
                            className="rounded-lg border border-emerald-300 px-3 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-50"
                          >
                            Aceptar
                          </button>
                        ) : quote.status === "Aceptada" ? (
                          <button
                            type="button"
                            onClick={() =>
                              handleConvertToSale(quote)
                            }
                            className="rounded-lg bg-[#17324c] px-3 py-2 text-xs font-medium text-white hover:bg-[#234968]"
                          >
                            Convertir en venta
                          </button>
                        ) : (
                          <span className="text-xs font-medium text-slate-500">
                            Venta generada
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}