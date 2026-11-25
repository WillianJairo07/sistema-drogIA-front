import { apiGet, apiPost } from "../../../services/apiConfig";
import { firstDefined, toIsoDate, toNumber } from "../../../services/mappers";

export function mapDespacho(data = {}) {
  return {
    ...data,
    id: data.id ?? null,
    code: firstDefined(data.code, data.numeroGuia, ""),
    pedidoId: data.pedidoId ?? null,
    pedidoNumero: data.pedidoNumero ?? null,
    orderNumber: firstDefined(data.purchaseOrderCode, data.ordenCompraNumero, ""),
    product: firstDefined(data.product, data.producto, ""),
    quantity: toNumber(firstDefined(data.quantity, data.cantidad), 0),
    date: toIsoDate(firstDefined(data.date, data.fecha)) || "",
    courier: firstDefined(data.courierEmpresa, data.courier, ""),
    thirdPartyName: firstDefined(data.thirdPartyName, data.courierEmpresa, ""),
    thirdPartyDoc: firstDefined(data.thirdPartyDoc, ""),
    status: firstDefined(data.status, data.estado, "Programado"),
  };
}

function toRequest(record = {}) {
  return {
    pedidoId: record.pedidoId ?? null,
    thirdPartyName: record.thirdPartyName || "",
    thirdPartyDoc: record.thirdPartyDoc || null,
    product: record.product || "",
    purchaseOrderCode: record.purchaseOrderCode || null,
    quantity: toNumber(record.quantity, 0),
    date: toIsoDate(record.date),
    courierEmpresa: record.thirdPartyName || null,
    courierServicio: record.courierServicio || null,
    numeroGuia: record.code || record.numeroGuia || null,
    costoEnvio: record.costoEnvio ?? null,
  };
}

export function listarDespachos() {
  return apiGet("/despachos").then((data) =>
    (Array.isArray(data) ? data : []).map(mapDespacho)
  );
}

export function crearDespacho(record) {
  return apiPost("/despachos", toRequest(record)).then(mapDespacho);
}
