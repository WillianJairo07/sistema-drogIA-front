import { apiGet, apiPatch } from "../../../services/apiConfig";
import { firstDefined, toNumber } from "../../../services/mappers";

export function mapSolicitud(data = {}) {
  return {
    ...data,
    id: data.id ?? null,
    saleId: data.saleId ?? data.ventaId ?? null,
    saleNumber: firstDefined(data.saleNumber, data.ventaNumero, ""),
    productId: data.productId ?? data.productoId ?? null,
    product: firstDefined(data.product, data.producto, ""),
    quantity: toNumber(firstDefined(data.quantity, data.cantidad), 0),
    status: firstDefined(data.status, data.estado, "Pendiente de compra"),
    orderId: data.orderId ?? data.ordenCompraId ?? null,
  };
}

export function listarSolicitudes() {
  return apiGet("/solicitudes-compra").then((data) =>
    (Array.isArray(data) ? data : []).map(mapSolicitud)
  );
}

export function obtenerSolicitud(id) {
  return apiGet(`/solicitudes-compra/${id}`).then(mapSolicitud);
}

export function cambiarEstadoSolicitud(id, estado) {
  return apiPatch(`/solicitudes-compra/${id}/estado`, { estado }).then(mapSolicitud);
}
