import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { CotizacionForm } from "../features/cotizaciones/components/CotizacionForm";
import {
  calcularMontosCotizacion,
  descargarPdfCotizacion,
  obtenerPdfBase64,
} from "../features/cotizaciones/utils/cotizacionPdf";
import "../styles/cotizaciones.css";

export function CotizacionesPage() {
  const { onCreateSale } = useOutletContext();

  const [showForm, setShowForm] = useState(false);
  const [editingQuote, setEditingQuote] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedQuote, setSelectedQuote] = useState(null);

  const [emailModalQuote, setEmailModalQuote] = useState(null);
  const [destinatario, setDestinatario] = useState("");
  const [asuntoCorreo, setAsuntoCorreo] = useState("");
  const [cuerpoCorreo, setCuerpoCorreo] = useState("");
  const [enviandoCorreo, setEnviandoCorreo] = useState(false);

  const handleSaveQuote = (quote) => {
    const montos = calcularMontosCotizacion(quote);
    const guardada = {
      ...quote,
      ...montos,
      status: quote.status || "Pendiente",
    };

    setQuotes((currentQuotes) => {
      const existe = currentQuotes.some((item) => item.id === guardada.id);
      if (existe) {
        return currentQuotes.map((item) =>
          item.id === guardada.id ? guardada : item
        );
      }
      return [...currentQuotes, guardada];
    });

    setShowForm(false);
    setEditingQuote(null);
    setSelectedQuote(guardada);
  };

  const handleOpenEdit = (quote) => {
    setEditingQuote(quote);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingQuote(null);
  };

  const handleGenerarPdf = (quote) => {
    descargarPdfCotizacion(quote);
  };

  const abrirModalCorreo = (quote) => {
    const { total } = calcularMontosCotizacion(quote);
    setEmailModalQuote(quote);
    setDestinatario(quote.client?.email || "");
    setAsuntoCorreo(`Cotización ${quote.number} — ${quote.client?.name || "Cliente"}`);
    setCuerpoCorreo(
      `Estimado/a ${quote.client?.name || "cliente"},\n\nAdjuntamos en PDF el detalle de la cotización ${quote.number} por un total de S/ ${total.toFixed(2)} (incluye IGV).\n\nSaludos cordiales.`
    );
  };

  const handleEnviarCorreo = async (e) => {
    e.preventDefault();
    if (!destinatario.trim() || !emailModalQuote) return;

    setEnviandoCorreo(true);
    const pdfBase64 = obtenerPdfBase64(emailModalQuote);
    const pdfFileName = `${emailModalQuote.number || "cotizacion"}.pdf`;

    try {
      const resp = await fetch(
        `/api/cotizaciones/${emailModalQuote.id}/enviar-correo`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: destinatario.trim(),
            subject: asuntoCorreo,
            body: cuerpoCorreo,
            pdfFileName,
            pdfBase64,
            quote: emailModalQuote,
          }),
        }
      );

      if (!resp.ok) {
        throw new Error("Endpoint no disponible");
      }

      setMessage(
        `Cotización ${emailModalQuote.number} enviada con el PDF (${pdfFileName}) a ${destinatario.trim()}.`
      );
      setEmailModalQuote(null);
    } catch {
      descargarPdfCotizacion(emailModalQuote);
      const mailto = `mailto:${encodeURIComponent(
        destinatario.trim()
      )}?subject=${encodeURIComponent(asuntoCorreo)}&body=${encodeURIComponent(
        `${cuerpoCorreo}\n\n(Se descargó ${pdfFileName} para adjuntarlo al correo.)`
      )}`;
      window.location.href = mailto;
      setMessage(
        `Se descargó ${pdfFileName} y se abrió tu correo para enviarlo a ${destinatario.trim()}.`
      );
      setEmailModalQuote(null);
    } finally {
      setEnviandoCorreo(false);
    }
  };

  const handleAcceptQuote = (quoteId) => {
    setQuotes((currentQuotes) =>
      currentQuotes.map((quote) =>
        quote.id === quoteId ? { ...quote, status: "Aceptada" } : quote
      )
    );
  };

  const handleConvertToSale = (quote) => {
    const { total } = calcularMontosCotizacion(quote);
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
      total,
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

  const detalleMontos = calcularMontosCotizacion(selectedQuote);

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
            onClick={() => {
              setEditingQuote(null);
              setShowForm(true);
            }}
            className="cotizaciones-btn-primary"
            style={{
              backgroundColor: "#17324c",
              borderColor: "#17324c",
              color: "#ffffff",
            }}
          >
            Nueva Cotización
          </button>
        </div>
      )}

      {showForm && (
        <CotizacionForm
          initialQuote={editingQuote}
          onCancel={handleCancelForm}
          onGenerate={handleSaveQuote}
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
                  {quotes.map((quote) => {
                    const { total } = calcularMontosCotizacion(quote);
                    return (
                      <tr key={quote.id}>
                        <td style={{ fontWeight: 500 }}>{quote.number}</td>
                        <td>{quote.client.name}</td>
                        <td style={{ color: "#64748b" }}>{quote.date}</td>
                        <td style={{ fontWeight: 500 }}>
                          S/ {total.toFixed(2)}
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
                          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                            <button
                              type="button"
                              onClick={() => setSelectedQuote(quote)}
                              className="cotizaciones-btn-secondary"
                              style={{ padding: "6px 12px", fontSize: "12px" }}
                            >
                              Ver detalle
                            </button>

                            {quote.status !== "Convertida" && (
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(quote)}
                                className="cotizaciones-btn-secondary"
                                style={{ padding: "6px 12px", fontSize: "12px" }}
                              >
                                Editar
                              </button>
                            )}

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
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {selectedQuote && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            zIndex: 50,
          }}
          onClick={() => setSelectedQuote(null)}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              maxWidth: "820px",
              width: "100%",
              padding: "24px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h4 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#17324c" }}>
                Detalle de Cotización — {selectedQuote.number}
              </h4>
              <button
                type="button"
                onClick={() => setSelectedQuote(null)}
                style={{ border: "none", background: "transparent", fontSize: "18px", cursor: "pointer", color: "#64748b" }}
              >
                ✕
              </button>
            </div>

            <div style={{ fontSize: "13px", color: "#475569", marginBottom: "16px", display: "grid", gap: "4px" }}>
              <div><strong>Cliente:</strong> {selectedQuote.client?.name || "-"}</div>
              <div><strong>Correo del cliente:</strong> {selectedQuote.client?.email || "No registrado"}</div>
              <div><strong>Fecha:</strong> {selectedQuote.date || "-"}</div>
            </div>

            <div style={{ overflowX: "auto", border: "1px solid #e2e8f0", borderRadius: "8px", marginBottom: "18px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f1f5f9", borderBottom: "1px solid #cbd5e1", textAlign: "left" }}>
                    <th style={{ padding: "10px 12px" }}>Item</th>
                    <th style={{ padding: "10px 12px" }}>Cant. requerida</th>
                    <th style={{ padding: "10px 12px" }}>Unidad de medida</th>
                    <th style={{ padding: "10px 12px" }}>Producto</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedQuote.products || []).map((prod, idx) => (
                    <tr key={prod.id ?? idx} style={{ borderBottom: "1px solid #e2e8f0" }}>
                      <td style={{ padding: "10px 12px", fontWeight: 600 }}>{prod.item ?? idx + 1}</td>
                      <td style={{ padding: "10px 12px" }}>{prod.quantity}</td>
                      <td style={{ padding: "10px 12px" }}>{prod.unit || prod.unidadMedida || "UNIDAD"}</td>
                      <td style={{ padding: "10px 12px" }}>{prod.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
              <div
                style={{
                  minWidth: "240px",
                  backgroundColor: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  display: "grid",
                  gap: "6px",
                  fontSize: "14px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748b" }}>Subtotal:</span>
                  <strong>S/ {detalleMontos.subtotal.toFixed(2)}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748b" }}>IGV (18%):</span>
                  <strong>S/ {detalleMontos.igv.toFixed(2)}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", borderTop: "1px solid #e2e8f0", paddingTop: "6px" }}>
                  <span style={{ color: "#17324c", fontWeight: 700 }}>Total:</span>
                  <strong style={{ color: "#17324c" }}>S/ {detalleMontos.total.toFixed(2)}</strong>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => handleGenerarPdf(selectedQuote)}
                  className="cotizaciones-btn-secondary"
                >
                  Generar PDF
                </button>
                <button
                  type="button"
                  onClick={() => abrirModalCorreo(selectedQuote)}
                  className="cotizaciones-btn-primary"
                >
                  Enviar por correo
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedQuote(null)}
                className="cotizaciones-btn-secondary"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {emailModalQuote && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            zIndex: 60,
          }}
          onClick={() => setEmailModalQuote(null)}
        >
          <form
            onSubmit={handleEnviarCorreo}
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              maxWidth: "520px",
              width: "100%",
              padding: "24px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
              display: "grid",
              gap: "12px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h4 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#17324c" }}>
              Enviar cotización {emailModalQuote.number} por correo
            </h4>

            <div>
              <label className="cotizaciones-label">Correo del cliente</label>
              <input
                type="email"
                required
                value={destinatario}
                onChange={(e) => setDestinatario(e.target.value)}
                placeholder="cliente@empresa.com"
                className="cotizaciones-input"
              />
            </div>

            <div>
              <label className="cotizaciones-label">Asunto</label>
              <input
                type="text"
                required
                value={asuntoCorreo}
                onChange={(e) => setAsuntoCorreo(e.target.value)}
                className="cotizaciones-input"
              />
            </div>

            <div>
              <label className="cotizaciones-label">Mensaje</label>
              <textarea
                rows="4"
                value={cuerpoCorreo}
                onChange={(e) => setCuerpoCorreo(e.target.value)}
                className="cotizaciones-input"
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "6px" }}>
              <button
                type="button"
                onClick={() => setEmailModalQuote(null)}
                className="cotizaciones-btn-secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={enviandoCorreo}
                className="cotizaciones-btn-primary"
              >
                {enviandoCorreo ? "Enviando..." : "Enviar correo"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}