import { useEffect, useMemo, useState } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { normalizeRole } from "../features/auth/services/authService";
import { DespachoForm } from "../features/despacho/components/DespachoForm";
import { DespachoList } from "../features/despacho/components/DespachoList";
import "../styles/despacho.css";

const ESTADOS_PEDIDO = [
  "Pendiente",
  "Asignado",
  "Verificado",
  "En despacho",
  "En tránsito",
  "Entregado",
];

function textoPlano(valor, campos = []) {
  if (valor == null || valor === "") return "-";
  if (typeof valor !== "object") return String(valor);
  for (const campo of campos) {
    const encontrado = valor[campo];
    if (encontrado != null && encontrado !== "") return String(encontrado);
  }
  return "-";
}

function nombreProducto(item) {
  return textoPlano(item, ["product", "name", "nombre", "producto"]);
}

function cantidadProducto(item) {
  return Number(item?.quantity ?? item?.cantidad ?? 0) || 0;
}

function clienteTexto(client) {
  return textoPlano(client, [
    "nombre",
    "razonSocial",
    "cliente",
    "name",
    "documento",
    "numeroDocumento",
  ]);
}

function destinoTexto(destino) {
  const directo = textoPlano(destino, [
    "direccion",
    "address",
    "descripcion",
    "detalle",
  ]);
  if (directo !== "-") return directo;
  if (!destino || typeof destino !== "object") return "-";
  const partes = [
    destino.departamento,
    destino.provincia,
    destino.distrito,
    destino.ciudad,
  ].filter(Boolean);
  return partes.join(" / ") || "-";
}

function productosTexto(items = []) {
  if (!Array.isArray(items) || items.length === 0) return "-";
  return items
    .map(
      (item) =>
        `${nombreProducto(item)} × ${cantidadProducto(item)} ${
          item.unit || item.unidad || ""
        }`.trim()
    )
    .join("; ");
}

export function DespachoPage() {
  const location = useLocation();
  const { user } = useAuth();
  const puedeGestionar = normalizeRole(user?.role) === "Almacenero";

  const {
    inventory = [],
    inventarioAlmacen = [],
    dispatches = [],
    onCreateDispatch,
    pedidos = [],
    purchaseOrders = [],
    onTomarPedido,
    onVerificarPedido,
    onPedidoStatusChange,
    onDespachoStatusChange,
  } = useOutletContext();

  const [showForm, setShowForm] = useState(false);
  const [pedidoFormInicial, setPedidoFormInicial] = useState("");
  const [inventarioFormInicial, setInventarioFormInicial] = useState(null);

  const indiceOrdenes = useMemo(() => {
    const mapa = new Map();
    purchaseOrders.forEach((orden) => {
      if (orden.id != null) mapa.set(String(orden.id), orden);
      if (orden.number) mapa.set(String(orden.number), orden);
    });
    return mapa;
  }, [purchaseOrders]);

  const datosPedidos = useMemo(
    () =>
      pedidos.map((pedido) => {
        const orden =
          indiceOrdenes.get(String(pedido.orderId)) ||
          indiceOrdenes.get(String(pedido.orderNumber)) ||
          null;
        const habilitado = orden
          ? orden.status === "Cerrado" || orden.receiptRegistered
          : true;
        const codigoOrden =
          orden?.number || pedido.orderNumber || pedido.orderId || "";
        const lotes = inventory.filter((lote) => {
          const codigoLote = String(lote.purchaseOrderCode || "");
          return (
            codigoLote !== "" &&
            (codigoLote === String(codigoOrden) ||
              codigoLote === String(pedido.orderId))
          );
        });
        return { pedido, orden, habilitado, lotes };
      }),
    [pedidos, indiceOrdenes, inventory]
  );

  const pedidosHabilitados = datosPedidos
    .filter((dato) => dato.habilitado)
    .map(({ pedido, orden }) => ({
      ...pedido,
      orderNumber: orden?.number || pedido.orderNumber,
      ordenCompraNumero: orden?.number || pedido.orderNumber,
    }));

  const abrirFormulario = (pedidoId = "", inventario = null) => {
    setPedidoFormInicial(pedidoId);
    setInventarioFormInicial(inventario);
    setShowForm(true);
  };

  const cerrarFormulario = () => {
    setPedidoFormInicial("");
    setInventarioFormInicial(null);
    setShowForm(false);
  };

  useEffect(() => {
    if (!puedeGestionar) return;
    const desdeInventario = location.state?.despachoInventario;
    if (desdeInventario) {
      abrirFormulario("", desdeInventario);
      return;
    }
    const pedidoId = location.state?.pedidoIdInicial;
    if (pedidoId) {
      abrirFormulario(String(pedidoId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    location.state?.despachoInventario,
    location.state?.pedidoIdInicial,
    puedeGestionar,
  ]);

  const handleSave = async (record) => {
    try {
      await onCreateDispatch?.(record);
      cerrarFormulario();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleTomar = async (pedidoId) => {
    try {
      await onTomarPedido?.(pedidoId);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleVerificar = async (pedido) => {
    try {
      await onVerificarPedido?.(pedido.id, true, true);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEstado = async (pedidoId, estado) => {
    try {
      await onPedidoStatusChange?.(pedidoId, estado);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEstadoDespacho = async (despacho, estado) => {
    try {
      await onDespachoStatusChange?.(despacho.id, estado);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="despacho-container">
      <div className="despacho-header">
        <div>
          <h1 className="despacho-title">Gestión de Despacho</h1>
          <p className="despacho-subtitle">
            Mercadería recibida de Compras, lista para entrega local o por courier.
          </p>
        </div>

        {!showForm && puedeGestionar && (
          <button
            type="button"
            onClick={() => abrirFormulario()}
            className="despacho-btn-primary"
            disabled={
              pedidosHabilitados.length === 0 && inventarioAlmacen.length === 0
            }
          >
            Nuevo Despacho
          </button>
        )}
      </div>

      <div className="despacho-card">
        <h3 className="despacho-card-title">Mercadería recibida</h3>
        <p
          style={{
            fontSize: "12px",
            color: "#64748b",
            margin: "-6px 0 16px",
          }}
        >
          El trabajo se habilita cuando Compras registra la recepción: la orden
          queda Cerrada, el backend calcula estado y prioridad, y Almacén ve el
          stock real de la base de datos.
        </p>

        {datosPedidos.length === 0 ? (
          <>
            <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
              No hay mercadería pendiente en el almacén. Cuando Compras
              registre la recepción, aparecerá aquí con sus lotes reales.
            </p>
          </>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}
            >
              <thead>
                <tr style={{ backgroundColor: "#f1f5f9", textAlign: "left" }}>
                  <th style={{ padding: "10px 12px" }}>Pedido</th>
                  <th style={{ padding: "10px 12px" }}>Orden de compra</th>
                  <th style={{ padding: "10px 12px" }}>Cliente</th>
                  <th style={{ padding: "10px 12px" }}>Destino / tipo</th>
                  <th style={{ padding: "10px 12px" }}>Productos de la orden</th>
                  <th style={{ padding: "10px 12px" }}>Lotes recibidos</th>
                  <th style={{ padding: "10px 12px" }}>Estado</th>
                  <th style={{ padding: "10px 12px" }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {datosPedidos.map(({ pedido, orden, habilitado, lotes }) => {
                  const unidades = lotes.reduce(
                    (suma, lote) => suma + (Number(lote.stock) || 0),
                    0
                  );
                  const productosOrden = orden?.items?.length
                    ? orden.items
                    : pedido.products;
                  const verificado =
                    Boolean(pedido.verificadoInfo && pedido.verificadoLotes) ||
                    pedido.status === "Verificado";
                  const puedeCrearDespacho =
                    !pedido.despachoId &&
                    pedido.status !== "Entregado" &&
                    (verificado || pedido.status === "En despacho");

                  return (
                    <tr
                      key={pedido.id}
                      style={{ borderBottom: "1px solid #e2e8f0" }}
                    >
                      <td style={{ padding: "10px 12px", fontWeight: 500 }}>
                        {pedido.number || `#${pedido.id}`}
                        <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                          {pedido.saleNumber || "-"}
                        </div>
                      </td>

                      <td style={{ padding: "10px 12px", color: "#475569" }}>
                        {orden?.number || pedido.orderNumber || "-"}
                        <div style={{ fontSize: "11px", color: "#059669" }}>
                          {habilitado ? "Cerrada" : "Pendiente de cierre"}
                        </div>
                        <div style={{ fontSize: "11px", color: "#64748b" }}>
                          {orden?.supplier?.name || "-"}
                        </div>
                        <div style={{ fontSize: "11px", color: "#64748b" }}>
                          {orden?.date || "-"} · S/ {orden?.subtotal ?? "-"} + S/{" "}
                          {orden?.igv ?? "-"} = S/ {orden?.total ?? "-"}
                        </div>
                      </td>

                      <td style={{ padding: "10px 12px", color: "#475569" }}>
                        {clienteTexto(pedido.client)}
                      </td>

                      <td style={{ padding: "10px 12px", color: "#64748b" }}>
                        {destinoTexto(pedido.destination)}
                        <div style={{ fontSize: "11px", color: "#475569" }}>
                          {pedido.tipoDespacho || "LOCAL"}
                        </div>
                      </td>

                      <td style={{ padding: "10px 12px", color: "#64748b" }}>
                        {productosTexto(productosOrden)}
                      </td>

                      <td style={{ padding: "10px 12px", color: "#64748b" }}>
                        {lotes.length} lotes · {unidades} und.
                        {lotes.length > 0 && (
                          <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                            {lotes
                              .map(
                                (lote) =>
                                  `${lote.product || "-"}: ${lote.stock || 0} ${
                                    lote.lot ? `(${lote.lot})` : ""
                                  }`
                              )
                              .join("; ")}
                          </div>
                        )}
                      </td>

                      <td style={{ padding: "10px 12px" }}>
                        {puedeGestionar && habilitado ? (
                          <select
                            value={pedido.status}
                            onChange={(event) =>
                              handleEstado(pedido.id, event.target.value)
                            }
                            style={{
                              padding: "6px 8px",
                              border: "1px solid #cbd5e1",
                              borderRadius: "6px",
                            }}
                          >
                            {ESTADOS_PEDIDO.map((estado) => (
                              <option key={estado} value={estado}>
                                {estado}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span>{pedido.status}</span>
                        )}
                        {!habilitado && (
                          <div style={{ fontSize: "11px", color: "#b45309" }}>
                            Esperando cierre de Compras
                          </div>
                        )}
                      </td>

                      <td style={{ padding: "10px 12px" }}>
                        {puedeGestionar && habilitado ? (
                          <div
                            style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
                          >
                            {pedido.status === "Pendiente" && (
                              <button
                                type="button"
                                onClick={() => handleTomar(pedido.id)}
                                className="despacho-btn-primary"
                                style={{ padding: "6px 10px", fontSize: "12px" }}
                              >
                                Tomar
                              </button>
                            )}
                            {(pedido.status === "Asignado" ||
                              pedido.status === "Verificado") && (
                              <button
                                type="button"
                                onClick={() => handleVerificar(pedido)}
                                className="despacho-btn-secondary"
                                style={{ padding: "6px 10px", fontSize: "12px" }}
                              >
                                Verificar
                              </button>
                            )}
                            {puedeCrearDespacho && (
                              <button
                                type="button"
                                onClick={() => abrirFormulario(pedido.id)}
                                className="despacho-btn-primary"
                                style={{ padding: "6px 10px", fontSize: "12px" }}
                              >
                                Crear despacho
                              </button>
                            )}
                          </div>
                        ) : (
                          <span style={{ fontSize: "12px", color: "#64748b" }}>
                            {puedeGestionar ? "Sin acciones disponibles" : "Solo lectura"}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && puedeGestionar && (
        <DespachoForm
          pedidos={pedidosHabilitados}
          inventory={inventory}
          pedidoIdInicial={pedidoFormInicial}
          inventarioInicial={inventarioFormInicial}
          onSave={handleSave}
          onCancel={cerrarFormulario}
        />
      )}

      <DespachoList
        dispatches={dispatches}
        puedeGestionar={puedeGestionar}
        onDespachoStatusChange={handleEstadoDespacho}
      />
    </div>
  );
}
