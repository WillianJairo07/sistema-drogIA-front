import { useEffect, useMemo, useState } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import { CotizacionForm } from "../features/cotizaciones/components/CotizacionForm";
import {
  actualizarCotizacion,
  cambiarEstadoCotizacion,
  crearCotizacion,
  enriquecerProductosDesdeCatalogo,
  guardarProveedores,
  listarCotizaciones,
  listarProveedores,
  enviarCotizacion,
  mapClienteCotizacion,
  validarOrdenCompra,
} from "../features/cotizaciones/services/cotizacionService";
import { obtenerCorreo } from "../features/correos/services/correoService";
import { extraerDatosCorreo } from "../features/correos/utils/extraerDatosCorreo";
import { resolverProductosMock } from "../features/cotizaciones/data/proveedoresMock";
import { listarProductos } from "../features/productos/services/productoService";
import {
  listarCasos,
  obtenerCaso,
  tomarCaso,
} from "../features/casos/services/casoService";
import { convertirCotizacionEnVenta } from "../features/ventas/services/ventaService";
import { firstDefined, toIsoDate } from "../services/mappers";
import { useAuth } from "../context/AuthContext";
import { normalizeRole } from "../features/auth/services/authService";
import {
  calcularMontosCotizacion,
  descargarPdfCotizacion,
  obtenerPdfBase64,
} from "../features/cotizaciones/utils/cotizacionPdf";
import "../styles/cotizaciones.css";

function encontrarCotizacionPorCodigo(cotizaciones, codigo) {
  if (!codigo) return null;
  const texto = String(codigo).trim().toUpperCase();
  return (
    cotizaciones.find(
      (cotizacion) =>
        String(cotizacion.id) === texto ||
        String(cotizacion.number || cotizacion.numero || "").trim().toUpperCase() === texto
    ) || null
  );
}

function formatearFecha(valor) {
  if (!valor) return "-";
  const fecha = new Date(valor);
  return Number.isNaN(fecha.getTime()) ? String(valor) : fecha.toLocaleString();
}

export function CotizacionesPage() {
  const { onCreateSale } = useOutletContext();
  const { user } = useAuth();
  const rol = normalizeRole(user?.role);
  const puedeGestionar = rol === "Vendedor";
  const puedeVerCasos = puedeGestionar || rol === "Administrador";
  const location = useLocation();

  const [showForm, setShowForm] = useState(false);
  const [editingQuote, setEditingQuote] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [catalogoProductos, setCatalogoProductos] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [casoActivo, setCasoActivo] = useState(null);
  const [correoActivo, setCorreoActivo] = useState(location.state?.correo || null);
  const [misSolicitudes, setMisSolicitudes] = useState([]);
  const [ordenCorreo, setOrdenCorreo] = useState(location.state?.correo || null);
  const [validacionOrden, setValidacionOrden] = useState(null);

  const [emailModalQuote, setEmailModalQuote] = useState(null);
  const [modalModo, setModalModo] = useState("cotizacion");
  const [destinatario, setDestinatario] = useState("");
  const [asuntoCorreo, setAsuntoCorreo] = useState("");
  const [cuerpoCorreo, setCuerpoCorreo] = useState("");
  const [enviandoCorreo, setEnviandoCorreo] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      setMessage("");
      setValidacionOrden(null);
      setShowForm(false);
      setOrdenCorreo(location.state?.correo || null);
      setCorreoActivo(location.state?.correo || null);
      setCasoActivo(null);
      setMisSolicitudes([]);

      const correoBase = location.state?.correo || null;

      try {
        const [cotizaciones, catalogo] = await Promise.all([
          listarCotizaciones(),
          listarProductos().catch(() => []),
        ]);
        setQuotes(cotizaciones);
        setCatalogoProductos(catalogo);

        if (location.state?.ordenCorreoId) {
          let correoOrden = correoBase;
          try {
            correoOrden = {
              ...correoOrden,
              ...(await obtenerCorreo(location.state.ordenCorreoId)),
            };
          } catch {
            // Se conserva el correo enviado desde la bandeja si el detalle falla.
          }
          setCorreoActivo(correoOrden);
          setOrdenCorreo(correoOrden);
          const codigo = firstDefined(
            location.state.codigoCotizacion,
            correoOrden?.codigoCotizacionDetectado,
            correoOrden?.codigoReferencia,
            ""
          );
          const cotizacion = encontrarCotizacionPorCodigo(cotizaciones, codigo);
          setValidacionOrden(validarOrdenCompra({ correo: correoOrden, cotizacion }));
          return;
        }

        let correoCompleto = correoBase;
        if (correoBase?.id) {
          try {
            correoCompleto = {
              ...correoBase,
              ...(await obtenerCorreo(correoBase.id)),
            };
          } catch {
            // Se conserva el correo de la bandeja si el detalle falla.
          }
        }
        setCorreoActivo(correoCompleto);

        if (!puedeVerCasos) {
          return;
        }

        const nombreUsuario = String(
          user?.name || user?.username || ""
        ).trim().toLowerCase();
        const esDelUsuario = (caso) =>
          Boolean(caso) &&
          ((caso.asignadoANombre &&
            String(caso.asignadoANombre).trim().toLowerCase() === nombreUsuario) ||
            (!caso.asignadoANombre && Boolean(caso.asignadoAId)));

        const casos = await listarCasos();
        const casosVentas = casos.filter((caso) => caso.area === "Ventas");
        const casosAbiertos = casosVentas.filter(
          (caso) =>
            (puedeGestionar ? esDelUsuario(caso) : true) &&
            !["CERRADO", "Cerrado", "CONVERTIDO", "Convertido"].includes(
              caso.status || caso.estado
            )
        );
        setMisSolicitudes(casosAbiertos);

        let caso = null;
        if (location.state?.casoId) {
          caso = await obtenerCaso(location.state.casoId);
          if (!esDelUsuario(caso)) {
            caso = await tomarCaso(caso.id);
          }
        } else {
          const idCaso = correoCompleto?.caseId ?? correoCompleto?.casoId;
          caso =
            (idCaso ? casosVentas.find((item) => item.id === idCaso) : null) ||
            (correoCompleto?.id
              ? casosVentas.find((item) => item.correoId === correoCompleto.id)
              : null) ||
            casosVentas.find(esDelUsuario);
          if (caso && !esDelUsuario(caso)) {
            caso = await tomarCaso(caso.id);
          }
        }

        setCasoActivo(caso);
        if (caso) {
          setMisSolicitudes((actuales) =>
            actuales.some((item) => item.id === caso.id)
              ? actuales.map((item) => (item.id === caso.id ? caso : item))
              : [caso, ...actuales]
          );
          if (location.state?.casoId && puedeGestionar) {
            setShowForm(true);
          }
        } else if (!editingQuote && puedeGestionar) {
          setMessage("Debe tomar un caso antes de crear una cotización.");
        }
      } catch (error) {
        setMessage(error.message);
        setCasoActivo(null);
      }
    };
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state, user?.name, puedeGestionar, puedeVerCasos]);

  const datosCorreo = useMemo(
    () => extraerDatosCorreo(correoActivo, casoActivo),
    [correoActivo, casoActivo]
  );
  const clienteInicial = datosCorreo.cliente;
  const nombreClienteInicial = clienteInicial.name || "";
  const productosIniciales = datosCorreo.productos;
  const destinoInicial = datosCorreo.destino;

  const datosIniciales = useMemo(
    () =>
      casoActivo
        ? {
            casoId: casoActivo.id,
            client: mapClienteCotizacion(clienteInicial, nombreClienteInicial),
            date:
              toIsoDate(
                firstDefined(correoActivo?.date, casoActivo.fechaCreacion)
              ) || new Date().toISOString().slice(0, 10),
            products: enriquecerProductosDesdeCatalogo(
              resolverProductosMock(productosIniciales),
              catalogoProductos
            ),
            destino: destinoInicial,
            proveedores: [],
          }
        : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [casoActivo, correoActivo, datosCorreo, catalogoProductos]
  );

  const handleSaveQuote = async (quote) => {
    const casoId = quote.casoId ?? casoActivo?.id;
    if (!casoId) {
      setMessage("Debe tomar un caso antes de crear una cotización.");
      return;
    }

    try {
      const esEdicion = quotes.some((item) => item.id === quote.id);
      const guardada = esEdicion
        ? await actualizarCotizacion(quote.id, quote)
        : await crearCotizacion({ ...quote, casoId }, casoId);

      if (quote.proveedores?.length) {
        await guardarProveedores(guardada.id, quote.proveedores);
      }

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
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleOpenEdit = (quote) => {
    setEditingQuote(quote);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingQuote(null);
  };

  const handleSeleccionarSolicitud = async (caso) => {
    setMessage("");
    try {
      let casoTomado = caso;
      if (!caso.asignadoAId && !caso.asignadoANombre) {
        casoTomado = await tomarCaso(caso.id);
      }
      const correoDelCaso = casoTomado.correoId
        ? await obtenerCorreo(casoTomado.correoId).catch(() => null)
        : null;

      setCasoActivo(casoTomado);
      setCorreoActivo(correoDelCaso);
      setMisSolicitudes((actuales) =>
        actuales.map((item) => (item.id === casoTomado.id ? casoTomado : item))
      );
      setEditingQuote(null);
      setShowForm(true);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleVerDetalle = async (quote) => {
    setSelectedQuote(quote);
    try {
      const proveedores = await listarProveedores(quote.id);
      setSelectedQuote({ ...quote, proveedores });
    } catch {
      // El detalle sigue disponible aunque no se puedan consultar los proveedores.
    }
  };

  const handleGenerarPdf = (quote) => {
    descargarPdfCotizacion(quote);
  };

  const abrirModalCorreo = (quote) => {
    const { total } = calcularMontosCotizacion(quote);
    setModalModo("cotizacion");
    setEmailModalQuote(quote);
    setDestinatario(quote.client?.email || "");
    setAsuntoCorreo(`Cotización ${quote.number} — ${quote.client?.name || "Cliente"}`);
    setCuerpoCorreo(
      `Estimado/a ${quote.client?.name || "cliente"},\n\nAdjuntamos en PDF el detalle de la cotización ${quote.number} por un total de S/ ${total.toFixed(2)} (incluye IGV).\n\nSaludos cordiales.`
    );
  };

  const abrirModalRechazo = (validacion) => {
    const cotizacion = validacion.cotizacion;
    if (!cotizacion) return;
    setModalModo("rechazo");
    setEmailModalQuote(cotizacion);
    setDestinatario(
      firstDefined(ordenCorreo?.sender, cotizacion.client?.email, "")
    );
    setAsuntoCorreo(
      `No se efectuó la compra — Orden ${validacion.codigo || cotizacion.number}`
    );
    setCuerpoCorreo(
      `Estimado/a ${cotizacion.client?.name || "cliente"},\n\nHemos revisado la orden de compra enviada. No se efectuará la compra porque ${validacion.motivo.charAt(0).toLowerCase()}${validacion.motivo.slice(1)}\n\nSi deseas una nueva cotización, responde a este correo con los productos y cantidades requeridos.\n\nSaludos cordiales.`
    );
  };

  const handleEnviarCorreo = async (e) => {
    e.preventDefault();
    if (!destinatario.trim() || !emailModalQuote) return;

    setEnviandoCorreo(true);
    const esRechazo = modalModo === "rechazo";
    const pdfBase64 = esRechazo ? "" : obtenerPdfBase64(emailModalQuote);
    const pdfFileName = esRechazo
      ? null
      : `${emailModalQuote.number || "cotizacion"}.pdf`;

    try {
      await enviarCotizacion(emailModalQuote.id, {
        to: destinatario.trim(),
        subject: asuntoCorreo,
        body: cuerpoCorreo,
        pdfFileName,
        pdfBase64,
        quote: emailModalQuote,
      });

      setQuotes((currentQuotes) =>
        currentQuotes.map((quote) =>
          quote.id === emailModalQuote.id ? { ...quote, status: "Enviada" } : quote
        )
      );
      setSelectedQuote((current) =>
        current?.id === emailModalQuote.id ? { ...current, status: "Enviada" } : current
      );
      setMessage(
        esRechazo
          ? `Rechazo de la orden enviado a ${destinatario.trim()}.`
          : `Cotización ${emailModalQuote.number} enviada con el PDF (${pdfFileName}) a ${destinatario.trim()}.`
      );
      setEmailModalQuote(null);
      setModalModo("cotizacion");
    } catch (error) {
      if (!esRechazo) {
        descargarPdfCotizacion(emailModalQuote);
      }
      const notaAdjunto = esRechazo
        ? ""
        : `\n\n(Se descargó ${pdfFileName} para adjuntarlo al correo.)`;
      const mailto = `mailto:${encodeURIComponent(
        destinatario.trim()
      )}?subject=${encodeURIComponent(asuntoCorreo)}&body=${encodeURIComponent(
        `${cuerpoCorreo}${notaAdjunto}`
      )}`;
      window.location.href = mailto;
      setMessage(
        esRechazo
          ? `${error.message} Se abrió tu correo para enviar el rechazo a ${destinatario.trim()}.`
          : `${error.message} Se descargó ${pdfFileName} y se abrió tu correo para enviarlo a ${destinatario.trim()}.`
      );
      setEmailModalQuote(null);
      setModalModo("cotizacion");
    } finally {
      setEnviandoCorreo(false);
    }
  };

  const handleAcceptQuote = async (quoteId) => {
    try {
      const actualizada = await cambiarEstadoCotizacion(quoteId, "Aceptada");
      setQuotes((currentQuotes) =>
        currentQuotes.map((quote) =>
          quote.id === quoteId ? actualizada : quote
        )
      );
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleConvertToSale = async (quote) => {
    let exito = false;
    try {
      const venta = await convertirCotizacionEnVenta(quote.id);
      if (onCreateSale) {
        await onCreateSale(venta);
      }
      setQuotes((currentQuotes) =>
        currentQuotes.map((currentQuote) =>
          currentQuote.id === quote.id
            ? { ...currentQuote, status: "Convertida" }
            : currentQuote
        )
      );
      setSelectedQuote(null);
      setMessage(
        `La cotización ${quote.number} fue convertida en venta correctamente.`
      );
      exito = true;
    } catch (error) {
      setMessage(error.message);
    }
    return exito;
  };

  const handleConvertirOrdenValidada = async () => {
    if (!validacionOrden?.valida || !validacionOrden.cotizacion) return;

    let cotizacion = validacionOrden.cotizacion;
    if (cotizacion.status === "Pendiente") {
      try {
        cotizacion = await cambiarEstadoCotizacion(cotizacion.id, "Aceptada");
        setQuotes((currentQuotes) =>
          currentQuotes.map((quote) =>
            quote.id === cotizacion.id ? cotizacion : quote
          )
        );
      } catch (error) {
        setMessage(error.message);
        return;
      }
    }

    const convertida = await handleConvertToSale(cotizacion);
    if (convertida) {
      setValidacionOrden(null);
    }
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

      {!showForm && puedeVerCasos && misSolicitudes.length > 0 && !validacionOrden && (
        <div className="cotizaciones-card" style={{ marginBottom: "16px" }}>
          <h3 className="cotizaciones-card-title">Mis solicitudes</h3>

          <div style={{ overflowX: "auto", marginTop: "12px" }}>
            <table
              className="cotizaciones-table"
              style={{ width: "100%", fontSize: "13px" }}
            >
              <thead>
                <tr>
                  <th>Código solicitud</th>
                  <th>Fecha límite</th>
                  <th>Cliente</th>
                  <th>Productos</th>
                  <th>Estado</th>
                  <th style={{ textAlign: "right" }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {misSolicitudes.map((caso) => (
                  <tr key={caso.id}>
                    <td style={{ fontWeight: 500 }}>
                      {caso.codigoSolicitud || "Pendiente de tomar"}
                    </td>
                    <td style={{ color: "#64748b" }}>
                      {formatearFecha(caso.fechaLimiteCotizacion)}
                    </td>
                    <td>
                      {firstDefined(
                        caso.cliente?.name,
                        caso.cliente?.nombre,
                        "-"
                      )}
                    </td>
                    <td style={{ color: "#475569" }}>
                      {(caso.productos || [])
                        .map((producto) =>
                          firstDefined(producto.name, producto.nombre, "")
                        )
                        .filter(Boolean)
                        .join(", ") || "-"}
                    </td>
                    <td>{caso.status || caso.estado || "-"}</td>
                    <td style={{ textAlign: "right" }}>
                      {puedeGestionar ? (
                        <button
                          type="button"
                          onClick={() => handleSeleccionarSolicitud(caso)}
                          className="cotizaciones-btn-secondary"
                          style={{ padding: "6px 10px", fontSize: "12px" }}
                        >
                          Continuar cotización
                        </button>
                      ) : (
                        <span style={{ color: "#64748b", fontSize: "12px" }}>
                          Solo lectura
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!showForm && validacionOrden && (
        <div
          className="cotizaciones-card"
          style={{
            marginBottom: "16px",
            borderLeft: `4px solid ${validacionOrden.valida ? "#15803d" : "#b91c1c"}`,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
              marginBottom: "12px",
            }}
          >
            <h3 className="cotizaciones-card-title">
              Validación de orden de compra
            </h3>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: validacionOrden.valida ? "#15803d" : "#b91c1c",
              }}
            >
              {validacionOrden.valida ? "Orden válida" : "Orden observada"}
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "6px",
              fontSize: "13px",
              color: "#475569",
              marginBottom: "10px",
            }}
          >
            <div>
              <strong>Código recibido:</strong> {validacionOrden.codigo || "-"}
            </div>
            <div>
              <strong>Cotización:</strong>{" "}
              {validacionOrden.cotizacion?.number || "-"}
            </div>
            <div>
              <strong>Estado:</strong> {validacionOrden.cotizacion?.status || "-"}
            </div>
            <div>
              <strong>Fecha límite:</strong>{" "}
              {formatearFecha(validacionOrden.cotizacion?.fechaLimiteCotizacion)}
            </div>
          </div>

          <p
            style={{
              margin: "0 0 14px",
              fontSize: "14px",
              fontWeight: 500,
              color: validacionOrden.valida ? "#15803d" : "#b91c1c",
            }}
          >
            {validacionOrden.motivo}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "12px",
              fontSize: "13px",
              color: "#334155",
            }}
          >
            <div>
              <strong>Productos cotizados</strong>
              <ul style={{ margin: "6px 0 0", paddingLeft: "18px" }}>
                {(validacionOrden.productosEsperados || []).map((producto, index) => (
                  <li key={`esperado-${producto.id ?? index}`}>
                    {producto.name} — {producto.quantity} {producto.unit}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <strong>Productos en la orden</strong>
              <ul style={{ margin: "6px 0 0", paddingLeft: "18px" }}>
                {(validacionOrden.productosRecibidos || []).map((producto, index) => (
                  <li key={`recibido-${producto.id ?? index}`}>
                    {producto.name} — {producto.quantity} {producto.unit}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              marginTop: "14px",
              flexWrap: "wrap",
            }}
          >
            {puedeGestionar && validacionOrden.valida && (
              <button
                type="button"
                onClick={handleConvertirOrdenValidada}
                className="cotizaciones-btn-primary"
              >
                Aceptar y convertir en venta
              </button>
            )}

            {puedeGestionar &&
              !validacionOrden.valida &&
              validacionOrden.cotizacion && (
                <button
                  type="button"
                  onClick={() => abrirModalRechazo(validacionOrden)}
                  className="cotizaciones-btn-secondary"
                  style={{ color: "#b91c1c", borderColor: "#fecaca" }}
                >
                  Enviar rechazo al cliente
                </button>
              )}

            {!puedeGestionar && (
              <span style={{ fontSize: "12px", color: "#64748b" }}>
                Validación en solo lectura. Solo Ventas puede convertir o enviar.
              </span>
            )}
          </div>
        </div>
      )}

      {!showForm && puedeGestionar && (
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
          initialQuote={editingQuote || datosIniciales}
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
                    <th>Solicitud</th>
                    <th>Fecha límite</th>
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
                        <td style={{ color: "#475569" }}>
                          {quote.codigoSolicitud || "-"}
                        </td>
                        <td style={{ color: "#64748b" }}>
                          {formatearFecha(quote.fechaLimiteCotizacion)}
                        </td>
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
                              onClick={() => handleVerDetalle(quote)}
                              className="cotizaciones-btn-secondary"
                              style={{ padding: "6px 12px", fontSize: "12px" }}
                            >
                              Ver detalle
                            </button>

                            {puedeGestionar && quote.status !== "Convertida" && (
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(quote)}
                                className="cotizaciones-btn-secondary"
                                style={{ padding: "6px 12px", fontSize: "12px" }}
                              >
                                Editar
                              </button>
                            )}

                            {!puedeGestionar ? (
                              <span style={{ fontSize: "12px", color: "#64748b" }}>
                                Solo lectura
                              </span>
                            ) : quote.status === "Pendiente" ? (
                              <button
                                type="button"
                                onClick={() => handleAcceptQuote(quote.id)}
                                className="cotizaciones-btn-secondary"
                                style={{ padding: "6px 12px", fontSize: "12px", color: "#047857", borderColor: "#a7f3d0" }}
                              >
                                Aceptar
                              </button>
                            ) : quote.status === "Aceptada" || quote.status === "Enviada" ? (
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
              <div>
                <strong>Proveedores:</strong>{" "}
                {(selectedQuote.proveedores || [])
                  .map((proveedor) => proveedor.name || proveedor.nombre || proveedor.proveedor || "")
                  .filter(Boolean)
                  .join(", ") || "-"}
              </div>
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
                {puedeGestionar && (
                  <button
                    type="button"
                    onClick={() => abrirModalCorreo(selectedQuote)}
                    className="cotizaciones-btn-primary"
                  >
                    Enviar por correo
                  </button>
                )}
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
          onClick={() => {
              setEmailModalQuote(null);
              setModalModo("cotizacion");
            }}
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
              {modalModo === "rechazo"
                ? "Enviar rechazo de orden de compra"
                : `Enviar cotización ${emailModalQuote.number} por correo`}
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
                onClick={() => {
              setEmailModalQuote(null);
              setModalModo("cotizacion");
            }}
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
