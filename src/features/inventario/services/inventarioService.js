import { apiGet, apiPost, apiPut } from "../../../services/apiConfig";
import { firstDefined, toIsoDate, toNumber } from "../../../services/mappers";

export function mapInventario(data = {}) {
  return {
    ...data,
    id: data.id ?? null,
    productoId: data.productoId ?? data.productId ?? null,
    product: firstDefined(data.product, data.producto, ""),
    purchaseOrderCode: firstDefined(data.purchaseOrderCode, data.ordenCompraCodigo, ""),
    lot: firstDefined(data.lot, data.lote, ""),
    stock: toNumber(firstDefined(data.stock, data.cantidad), 0),
    minimumStock: toNumber(firstDefined(data.minimumStock, data.stockMinimo), 0),
    expiration: toIsoDate(data.expiration) || "",
  };
}

function toRequest(item = {}) {
  return {
    productoId: item.productoId ?? item.productId ?? null,
    product: item.product || "",
    purchaseOrderCode: item.purchaseOrderCode || null,
    lot: item.lot || null,
    stock: toNumber(item.stock, 0),
    minimumStock: toNumber(item.minimumStock, 0),
    expiration: toIsoDate(item.expiration),
  };
}

export function listarInventario() {
  return apiGet("/inventario").then((data) =>
    (Array.isArray(data) ? data : []).map(mapInventario)
  );
}

export function crearInventario(item) {
  return apiPost("/inventario", toRequest(item)).then(mapInventario);
}

export function actualizarInventario(id, item) {
  return apiPut(`/inventario/${id}`, toRequest(item)).then(mapInventario);
}
