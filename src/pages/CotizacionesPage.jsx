import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { CotizacionForm } from "../features/cotizaciones/components/CotizacionForm";
import "../styles/cotizaciones.css";

export function CotizacionesPage() {
  const { onCreateSale } = useOutletContext();

  const [showForm, setShowForm] = useState(false);
  const [quotes, setQuotes] = useState([]);
  const [message, setMessage] = useState("");

  const handleCreateQuote = (quote) => {
    setQuotes((currentQuotes) => [
      ...currentQuotes,
      { ...quote, status: "Pendiente" },
    ]);
    setShowForm(false);
  };

  const handleAcceptQuote = (quoteId) => {
    setQuotes((currentQuotes) =>
      currentQuotes.map((quote) =>
        quote.id === quoteId ? { ...quote, status: "Aceptada" } : quote
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
    <div className="cotizaciones-container">
      <div>
        <h2 className="cotizaciones-header-title">Gestión de Cotizaciones</h2>
        <p className="cotizaciones-header-subtitle">
          Consulta y gestiona las cotizaciones de los clientes.
        </p>
      </div>

      {message && <div className="cotizaciones-alert">{message}</div>}

      {!showForm && (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="cotizaciones-btn-primary"
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
        <div className="cotizaciones-card">
          <div style={{ marginBottom: "16px" }}>
            <h3 className="cotizaciones-card-title">Cotizaciones registradas</h3>
          </div>

          {quotes.length === 0 ? (
            <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
              No hay cotizaciones registradas.
            </p>
          ) : (
            <div className="cotizaciones-table-wrapper">
              <table className="cotizaciones-table">
                <thead>
                  <tr>
                    <th>Cotización</th>
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {quotes.map((quote) => (
                    <tr key={quote.id}>
                      <td style={{ fontWeight: 500 }}>{quote.number}</td>
                      <td>{quote.client.name}</td>
                      <td style={{ color: "#64748b" }}>{quote.date}</td>
                      <td style={{ fontWeight: 500 }}>
                        S/ {quote.total.toFixed(2)}
                      </td>
                      <td>
                        <span
                          className={`badge-estado ${
                            quote.status === "Aceptada"
                              ? "badge-aceptada"
                              : quote.status === "Convertida"
                              ? "badge-convertida"
                              : "badge-pendiente"
                          }`}
                        >
                          {quote.status}
                        </span>
                      </td>
                      <td>
                        {quote.status === "Pendiente" ? (
                          <button
                            type="button"
                            onClick={() => handleAcceptQuote(quote.id)}
                            className="cotizaciones-btn-secondary"
                            style={{ padding: "6px 12px", fontSize: "12px", color: "#047857", borderColor: "#a7f3d0" }}
                          >
                            Aceptar
                          </button>
                        ) : quote.status === "Aceptada" ? (
                          <button
                            type="button"
                            onClick={() => handleConvertToSale(quote)}
                            className="cotizaciones-btn-primary"
                            style={{ padding: "6px 12px", fontSize: "12px" }}
                          >
                            Convertir en venta
                          </button>
                        ) : (
                          <span style={{ fontSize: "12px", color: "#64748b" }}>
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