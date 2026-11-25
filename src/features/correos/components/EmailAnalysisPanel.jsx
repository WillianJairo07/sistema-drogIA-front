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
import { listarCasos, tomarCaso } from "../../casos/services/casoService";
import { extraerDatosCorreo } from "../utils/extraerDatosCorreo";

export function EmailAnalysisPanel() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const rol = normalizeRole(user?.role);
  const puedeCotizar = rol === "Vendedor";
  const puedeValidarOrden = rol === "Administrador" || rol === "Vendedor";
  const [emails, setEmails] = useState([]);
  const [casos, setCasos] = useState([]);
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
      const [historial, casosDisponibles] = await Promise.all([
        listarHistorial(),
        listarCasos().catch(() => []),
      ]);
      setEmails(historial);
      setCasos(casosDisponibles);
    } catch {
      setError("No se pudo cargar el historial de correos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarHistorial();
  }, []);

  const formatearFecha = (valor) => {
    if (!valor) return "-";
    const fecha = new Date(valor);
    return Number.isNaN(fecha.getTime()) ? String(valor) : fecha.toLocaleString();
  };

  const nombreUsuarioActual = String(
    user?.name || user?.username || ""
  )
    .trim()
    .toLowerCase();
  const idUsuarioActual = user?.id ?? user?.userId ?? null;

  const casoDelCorreo = (email, lista = casos) =>
    lista.find(
      (caso) =>
        (email?.caseId != null && String(caso.id) === String(email.caseId)) ||
        (email?.id != null &&
          caso.correoId != null &&
          String(caso.correoId) === String(email.id))
    ) || null;

  const casoEstaAsignado = (caso) =>
    Boolean(caso?.asignadoAId || caso?.asignadoANombre);

  const casoEsDelUsuario = (caso) => {
    if (!casoEstaAsignado(caso)) return false;
    if (idUsuarioActual != null && caso.asignadoAId != null) {
      return String(idUsuarioActual) === String(caso.asignadoAId);
    }
    if (caso.asignadoANombre) {
      return (
        String(caso.asignadoANombre).trim().toLowerCase() ===
        nombreUsuarioActual
      );
    }
    return false;
  };

  const estadoSolicitud = (email, caso = casoDelCorreo(email)) => {
    if (casoEstaAsignado(caso)) {
      if (casoEsDelUsuario(caso)) {
        return {
          texto: "En cotización",
          clase: "badge-correo-asignado",
          boton: "Continuar cotización",
          deshabilitado: false,
        };
      }
      const nombre = caso.asignadoANombre || "otro usuario";
      return {
        texto: `Tomado por ${nombre}`,
        clase: "badge-correo-tomado",
        boton: `Tomado por ${nombre}`,
        deshabilitado: true,
      };
    }

    if (email?.status === "Analizado" && email?.area === "Ventas") {
      return {
        texto: "Pendiente de tomar",
        clase: "badge-correo-pendiente",
        boton: "Cotizar",
        deshabilitado: false,
      };
    }

    return null;
  };

  const areas = [...new Set(emails.map((email) => email.area).filter(Boolean))];
  const correosVisibles =
    carpeta === "Todos"
      ? emails
      : emails.filter((email) => email.area === carpeta);

  const casoSeleccionado = casoDelCorreo(correoSeleccionado);
  const solicitudSeleccionada = estadoSolicitud(
    correoSeleccionado,
    casoSeleccionado
  );
  const datosCorreoSeleccionado = correoSeleccionado
    ? extraerDatosCorreo(correoSeleccionado, casoSeleccionado)
    : null;

  const handleAnalyze = async (id) => {
    setProcesandoId(id);
    setError("");
    try {
      const actualizado = await clasificarCorreo(id);
      setEmails((currentEmails) =>
        currentEmails.map((email) => (email.id === id ? actualizado : email))
      );
      if (correoSeleccionado?.id === id) {
        setCorreoSeleccionado(actualizado);
      }
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

  const handleCotizar = async (email) => {
    setCorreoSeleccionado(null);
    setProcesandoId(email.id);
    setError("");
    try {
      const casosActuales = await listarCasos();
      setCasos(casosActuales);
      const caso = casoDelCorreo(email, casosActuales);
      if (!caso) {
        throw new Error("No hay un caso asociado a este correo. Analízalo primero.");
      }

      const tomado = await tomarCaso(caso.id);
      setCasos((actuales) =>
        actuales.some((item) => item.id === tomado.id)
          ? actuales.map((item) => (item.id === tomado.id ? tomado : item))
          : [tomado, ...actuales]
      );
      setEmails((actuales) =>
        actuales.map((item) =>
          item.id === email.id ? { ...item, caseId: tomado.id } : item
        )
      );

      navigate("/dashboard/cotizaciones", {
        state: {
          casoId: tomado.id,
          codigoSolicitud: tomado.codigoSolicitud,
          fechaLimiteCotizacion: tomado.fechaLimiteCotizacion,
          correo: { ...email, caseId: tomado.id },
        },
      });
    } catch (error) {
      await cargarHistorial();
      setError(error.message || "No se pudo tomar el caso para cotizar.");
    } finally {
      setProcesandoId(null);
    }
  };

  const handleValidarOrden = (email) => {
    setCorreoSeleccionado(null);
    navigate("/dashboard/cotizaciones", {
      state: {
        ordenCorreoId: email.id,
        codigoCotizacion:
          email.codigoCotizacionDetectado || email.codigoReferencia || null,
        correo: email,
      },
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
              correosVisibles.map((email) => {
                const caso = casoDelCorreo(email);
                const solicitud = estadoSolicitud(email, caso);
                const metaSolicitud = caso?.codigoSolicitud
                  ? `${caso.codigoSolicitud} · límite ${formatearFecha(
                      caso.fechaLimiteCotizacion
                    )}`
                  : "";

                return (
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
                    {metaSolicitud && (
                      <div
                        className="correos-solicitud-meta"
                        title={metaSolicitud}
                      >
                        {metaSolicitud}
                      </div>
                    )}
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
                        solicitud?.clase ||
                        (email.status === "Pendiente"
                          ? "badge-correo-pendiente"
                          : email.status === "Analizado"
                          ? "badge-correo-analizado"
                          : "badge-correo-revision")
                      }`}
                    >
                      {solicitud?.texto || email.status}
                    </span>
                  </td>

                  <td style={{ textAlign: "right" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        flexWrap: "wrap",
                        gap: "6px",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => handleVerDetalle(email)}
                        className="correos-btn-secondary"
                      >
                        Ver contenido
                      </button>

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

                      {email.status === "Analizado" && (
                        <button
                          type="button"
                          onClick={() => handleAnalyze(email.id)}
                          disabled={procesandoId === email.id}
                          className="correos-btn-secondary"
                        >
                          {procesandoId === email.id ? "Reanalizando..." : "Reanalizar"}
                        </button>
                      )}

                      {email.status === "Analizado" &&
                        puedeCotizar &&
                        email.area === "Ventas" && (
                        <button
                          type="button"
                          onClick={() => handleCotizar(email)}
                          disabled={
                            procesandoId === email.id || solicitud?.deshabilitado
                          }
                          className="correos-btn-primary"
                        >
                          {procesandoId === email.id
                            ? "Tomando..."
                            : solicitud?.boton || "Cotizar"}
                        </button>
                      )}

                      {puedeValidarOrden &&
                        (email.tipoRespuesta === "ORDEN_COMPRA" ||
                          email.tipoClasificacion === "ORDEN_COMPRA") && (
                          <button
                            type="button"
                            onClick={() => handleValidarOrden(email)}
                            className="correos-btn-primary"
                          >
                            Validar orden
                          </button>
                        )}

                      {email.status !== "Revisión manual" && (
                        <button
                          type="button"
                          onClick={() => handleMarcarRevision(email)}
                          disabled={procesandoId === email.id}
                          className="correos-btn-secondary"
                          style={{ color: "#475569" }}
                        >
                          Marcar revisión
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
                );
              })
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
              maxWidth: "820px",
              maxHeight: "90vh",
              overflowY: "auto",
              width: "100%",
              padding: "24px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h4 style={{ margin: 0, fontSize: "18px", fontWeight: 600, color: "#17324c" }}>
                Contenido completo del correo
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
              <div>
                <strong>Estado de la solicitud:</strong>{" "}
                {solicitudSeleccionada?.texto || "-"}
              </div>
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

            <div className="correos-modal-section">
              <strong className="correos-modal-section-title">Cliente extraído</strong>
              <div className="correos-modal-grid">
                <div><strong>Nombre:</strong> {datosCorreoSeleccionado?.cliente?.name || "No detectado"}</div>
                <div><strong>Documento:</strong> {datosCorreoSeleccionado?.cliente?.document || "No detectado"}</div>
                <div><strong>Correo:</strong> {datosCorreoSeleccionado?.cliente?.email || "No detectado"}</div>
              </div>
            </div>

            <div className="correos-modal-section">
              <strong className="correos-modal-section-title">
                Productos solicitados
                <span className="correos-modal-origen">
                  Origen: {datosCorreoSeleccionado?.origen || "sin datos"}
                </span>
              </strong>
              {datosCorreoSeleccionado?.productos?.length ? (
                <ul className="correos-modal-productos">
                  {datosCorreoSeleccionado.productos.map((producto, indice) => (
                    <li key={`${producto.name}-${indice}`}>
                      <span>{producto.name}</span>
                      <span className="correos-modal-cantidad">
                        {producto.quantity ?? producto.cantidad ?? "-"} {producto.unit ?? producto.unidad ?? ""}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="correos-modal-vacio">No se detectaron productos en este correo.</p>
              )}
            </div>

            <div style={{ marginBottom: "20px" }}>
              <strong style={{ display: "block", fontSize: "14px", color: "#17324c", marginBottom: "6px" }}>
                Cuerpo completo del correo:
              </strong>
              <div
                style={{
                  maxHeight: "320px",
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

              <button
                type="button"
                onClick={() => handleAnalyze(correoSeleccionado.id)}
                disabled={procesandoId === correoSeleccionado.id}
                className="correos-btn-secondary"
              >
                {procesandoId === correoSeleccionado.id ? "Reanalizando..." : "Reanalizar"}
              </button>

              {puedeCotizar &&
                correoSeleccionado.status === "Analizado" &&
                correoSeleccionado.area === "Ventas" && (
                <button
                  type="button"
                  onClick={() => handleCotizar(correoSeleccionado)}
                  disabled={
                    procesandoId === correoSeleccionado.id ||
                    solicitudSeleccionada?.deshabilitado
                  }
                  className="correos-btn-primary"
                >
                  {procesandoId === correoSeleccionado.id
                    ? "Tomando..."
                    : solicitudSeleccionada?.boton || "Cotizar"}
                </button>
              )}

              {puedeValidarOrden &&
                (correoSeleccionado.tipoRespuesta === "ORDEN_COMPRA" ||
                  correoSeleccionado.tipoClasificacion === "ORDEN_COMPRA") && (
                  <button
                    type="button"
                    onClick={() => handleValidarOrden(correoSeleccionado)}
                    className="correos-btn-primary"
                  >
                    Validar orden
                  </button>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}