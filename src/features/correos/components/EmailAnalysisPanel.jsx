import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { normalizeRole } from "../../auth/services/authService";
import {
  actualizarEstadoCorreo,
  clasificarCorreo,
  ejecutarIngesta,
  listarHistorial,
  obtenerCorreo,
} from "../services/correoService";

export function EmailAnalysisPanel() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const puedeCotizar = normalizeRole(user?.role) === "Vendedor";
  const [emails, setEmails] = useState([]);
  const [carpeta, setCarpeta] = useState("Todos");
  const [loading, setLoading] = useState(true);
  const [procesandoId, setProcesandoId] = useState(null);
  const [error, setError] = useState("");
  const [ingesta, setIngesta] = useState("");
  const [correoSeleccionado, setCorreoSeleccionado] = useState(null);

  const cargarHistorial = async () => {
    setLoading(true);
    setError("");
    try {
      setEmails(await listarHistorial());
    } catch {
      setError("No se pudo cargar el historial de correos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarHistorial();
  }, []);

  const areas = [...new Set(emails.map((email) => email.area).filter(Boolean))];
  const correosVisibles =
    carpeta === "Todos"
      ? emails
      : emails.filter((email) => email.area === carpeta);

  const handleAnalyze = async (id) => {
    setProcesandoId(id);
    setError("");
    try {
      const actualizado = await clasificarCorreo(id);
      setEmails((currentEmails) =>
        currentEmails.map((email) => (email.id === id ? actualizado : email))
      );
    } catch {
      setError("No se pudo clasificar el correo.");
    } finally {
      setProcesandoId(null);
    }
  };

  const handleMarcarRevision = async (email) => {
    setProcesandoId(email.id);
    setError("");
    try {
      const actualizado = await actualizarEstadoCorreo(
        email.id,
        "Revisión manual",
        email.area || null
      );
      setEmails((currentEmails) =>
        currentEmails.map((item) => (item.id === email.id ? actualizado : item))
      );
      if (correoSeleccionado?.id === email.id) {
        setCorreoSeleccionado(actualizado);
      }
    } catch {
      setError("No se pudo actualizar el estado del correo.");
    } finally {
      setProcesandoId(null);
    }
  };

  const handleMarcarAnalizado = async (email) => {
    setProcesandoId(email.id);
    setError("");
    try {
      const actualizado = await actualizarEstadoCorreo(
        email.id,
        "Analizado",
        email.area || "Ventas"
      );
      setEmails((currentEmails) =>
        currentEmails.map((item) => (item.id === email.id ? actualizado : item))
      );
      setCorreoSeleccionado(null);
    } catch {
      setError("No se pudo actualizar el estado del correo.");
    } finally {
      setProcesandoId(null);
    }
  };

  const handleVerDetalle = async (email) => {
    setProcesandoId(email.id);
    setError("");
    try {
      setCorreoSeleccionado(await obtenerCorreo(email.id));
    } catch {
      setCorreoSeleccionado(email);
      setError("No se pudo cargar el detalle completo del correo.");
    } finally {
      setProcesandoId(null);
    }
  };

  const handleCotizar = (email) => {
    setCorreoSeleccionado(null);
    navigate("/dashboard/cotizaciones", {
      state: { casoId: email.caseId ?? null, correo: email },
    });
  };

  const handleIngesta = async () => {
    setLoading(true);
    setError("");
    try {
      const resultado = await ejecutarIngesta();
      setIngesta(`Correos procesados: ${resultado.procesados}`);
      await cargarHistorial();
    } catch {
      setError("No se pudo ejecutar la ingesta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="correos-card">
      <div className="correos-card-header">
        <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#17324c", margin: 0 }}>
          Correos recibidos
        </h3>

        <p className="correos-header-subtitle">
          Revisa y analiza las solicitudes recibidas por correo.
        </p>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center", marginTop: "12px" }}>
          <select
            value={carpeta}
            onChange={(event) => setCarpeta(event.target.value)}
            style={{ padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", color: "#17324c" }}
          >
            <option value="Todos">Todos</option>
            {areas.map((nombre) => (
              <option key={nombre} value={nombre}>
                {nombre}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={cargarHistorial}
            className="correos-btn-primary"
          >
            Actualizar
          </button>

          <button
            type="button"
            onClick={handleIngesta}
            className="correos-btn-primary"
          >
            Ejecutar ingesta
          </button>
        </div>

        {error && <p style={{ color: "#b91c1c", marginTop: "8px" }}>{error}</p>}
        {ingesta && <p style={{ color: "#15803d", marginTop: "8px" }}>{ingesta}</p>}
      </div>

      <div className="correos-table-wrapper">
        <table className="correos-table">
          <thead>
            <tr>
              <th>Remitente</th>
              <th>Asunto</th>
              <th className="hidden md:table-cell">Fecha</th>
              <th className="hidden lg:table-cell">Área</th>
              <th>Estado</th>
              <th style={{ textAlign: "right" }}>Acción</th>
            </tr>
          </thead>

          <tbody>
            {correosVisibles.length > 0 ? (
              correosVisibles.map((email) => (
                <tr key={email.id}>
                  <td>
                    <div className="correos-truncate-sender" title={email.sender}>
                      {email.sender}
                    </div>
                  </td>

                  <td>
                    <div className="correos-truncate-subject" title={email.subject}>
                      {email.subject}
                    </div>
                  </td>

                  <td style={{ color: "#64748b" }} className="hidden md:table-cell">
                    {email.date}
                  </td>

                  <td style={{ color: "#64748b" }} className="hidden lg:table-cell">
                    {email.area}
                  </td>

                  <td>
                    <span
                      className={`badge-correo ${
                        email.status === "Pendiente"
                          ? "badge-correo-pendiente"
                          : email.status === "Analizado"
                          ? "badge-correo-analizado"
                          : "badge-correo-revision"
                      }`}
                    >
                      {email.status}
                    </span>
                  </td>

                  <td style={{ textAlign: "right" }}>
                    {email.status === "Pendiente" && (
                      <button
                        type="button"
                        onClick={() => handleAnalyze(email.id)}
                        disabled={procesandoId === email.id}
                        className="correos-btn-primary"
                      >
                        {procesandoId === email.id ? "Analizando..." : "Analizar"}
                      </button>
                    )}

                    {email.status === "Analizado" && puedeCotizar && (
                      <button
                        type="button"
                        onClick={() => handleCotizar(email)}
                        className="correos-btn-primary"
                      >
                        Cotizar
                      </button>
                    )}

                    {email.status === "Revisión manual" && (
                      <button
                        type="button"
                        onClick={() => handleVerDetalle(email)}
                        style={{
                          padding: "6px 10px",
                          border: "1px solid #cbd5e1",
                          borderRadius: "6px",
                          background: "#ffffff",
                          color: "#17324c",
                          cursor: "pointer",
                        }}
                      >
                        Ver detalle
                      </button>
                    )}

                    {email.status !== "Revisión manual" && (
                      <button
                        type="button"
                        onClick={() => handleMarcarRevision(email)}
                        disabled={procesandoId === email.id}
                        style={{
                          marginLeft: "8px",
                          padding: "6px 10px",
                          border: "1px solid #cbd5e1",
                          borderRadius: "6px",
                          background: "#ffffff",
                          color: "#475569",
                          cursor: "pointer",
                        }}
                      >
                        Marcar revisión
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", color: "#64748b", padding: "32px" }}>
                  {loading ? "Cargando correos..." : "No hay correos registrados."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {correoSeleccionado && (
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
          onClick={() => setCorreoSeleccionado(null)}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "10px",
              maxWidth: "640px",
              width: "100%",
              padding: "24px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h4 style={{ margin: 0, fontSize: "18px", fontWeight: 600, color: "#17324c" }}>
                Detalle del correo — Revisión manual
              </h4>
              <button
                type="button"
                onClick={() => setCorreoSeleccionado(null)}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: "18px",
                  cursor: "pointer",
                  color: "#64748b",
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "grid", gap: "8px", fontSize: "14px", color: "#334155", marginBottom: "16px" }}>
              <div><strong>Remitente:</strong> {correoSeleccionado.sender}</div>
              <div><strong>Asunto:</strong> {correoSeleccionado.subject}</div>
              <div><strong>Fecha:</strong> {correoSeleccionado.date || "-"}</div>
              <div><strong>Área:</strong> {correoSeleccionado.area || "Sin asignar"}</div>
              <div><strong>Estado:</strong> {correoSeleccionado.status}</div>
              {correoSeleccionado.codigoCotizacionDetectado && (
                <div><strong>Código detectado:</strong> {correoSeleccionado.codigoCotizacionDetectado}</div>
              )}
              {correoSeleccionado.resumenProductos && (
                <div><strong>Resumen productos:</strong> {correoSeleccionado.resumenProductos}</div>
              )}
              {correoSeleccionado.errorDetalle && (
                <div style={{ color: "#b91c1c" }}>
                  <strong>Detalle / Error:</strong> {correoSeleccionado.errorDetalle}
                </div>
              )}
            </div>

            <div style={{ marginBottom: "20px" }}>
              <strong style={{ display: "block", fontSize: "14px", color: "#17324c", marginBottom: "6px" }}>
                Contenido / Snippet:
              </strong>
              <div
                style={{
                  maxHeight: "220px",
                  overflowY: "auto",
                  padding: "12px",
                  borderRadius: "6px",
                  border: "1px solid #e2e8f0",
                  backgroundColor: "#f8fafc",
                  fontSize: "13px",
                  color: "#1e293b",
                  whiteSpace: "pre-wrap",
                }}
              >
                {correoSeleccionado.cuerpoTexto ||
                  correoSeleccionado.cuerpo_texto ||
                  correoSeleccionado.snippet ||
                  "Sin contenido adicional disponible."}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => setCorreoSeleccionado(null)}
                style={{
                  padding: "8px 14px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "6px",
                  background: "#ffffff",
                  color: "#475569",
                  cursor: "pointer",
                }}
              >
                Cerrar
              </button>

              <button
                type="button"
                onClick={() => handleMarcarAnalizado(correoSeleccionado)}
                disabled={procesandoId === correoSeleccionado.id}
                style={{
                  padding: "8px 14px",
                  border: "1px solid #17324c",
                  borderRadius: "6px",
                  background: "#ffffff",
                  color: "#17324c",
                  cursor: "pointer",
                }}
              >
                Marcar como Analizado
              </button>

              {puedeCotizar && (
                <button
                  type="button"
                  onClick={() => handleCotizar(correoSeleccionado)}
                  className="correos-btn-primary"
                >
                  Cotizar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}