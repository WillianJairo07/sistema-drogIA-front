import { apiGet, apiPatch, apiPost } from "../../../services/apiConfig";
import { firstDefined, normalizeList, toNumber } from "../../../services/mappers";

export function mapPedido(data = {}) {
  const productos = normalizeList(data.products ?? data.productos);
  return {
    ...data,
    id: data.id ?? null,
    number: firstDefined(data.saleNumber, data.numero, ""),
    orderId: data.ordenCompraId ?? data.orderId ?? null,
    orderNumber: firstDefined(
      data.ordenCompraNumero,
      data.ordenCompraId,
      data.orderNumber,
      ""
    ),
    date: firstDefined(data.fechaAsignacion, data.date, ""),
    products: productos,
    product: productos.map((item) => item.name || item.producto || item.product || "").filter(Boolean).join(", "),
    quantity: productos.reduce((sum, item) => sum + toNumber(item.quantity ?? item.cantidad, 0), 0),
    status: firstDefined(data.status, data.estado, "Pendiente"),
    saleNumber: firstDefined(data.saleNumber, ""),
    client: data.client ?? null,
    destination: data.destination ?? null,
    tipoDespacho: firstDefined(data.tipoDespacho, "LOCAL"),
    assignedTo: firstDefined(data.assignedTo, ""),
    verificadoInfo: Boolean(data.verificadoInfo),
    verificadoLotes: Boolean(data.verificadoLotes),
  };
}

export function listarPedidos() {
  return apiGet("/pedidos-almacen").then((data) =>
    (Array.isArray(data) ? data : []).map(mapPedido)
  );
}

export function obtenerPedido(id) {
  return apiGet(`/pedidos-almacen/${id}`).then(mapPedido);
}

export function marcarPedidoTomado(id) {
  return apiPost(`/pedidos-almacen/${id}/tomar`).then(mapPedido);
}

export function verificarPedido(id, verificadoInfo, verificadoLotes) {
  return apiPatch(`/pedidos-almacen/${id}/verificacion`, {
    verificadoInfo,
    verificadoLotes,
  }).then(mapPedido);
}

export function cambiarEstadoPedido(id, estado) {
  return apiPatch(`/pedidos-almacen/${id}/estado`, { estado }).then(mapPedido);
}
