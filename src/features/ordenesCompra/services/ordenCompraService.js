import { apiGet, apiPatch, apiPost } from "../../../services/apiConfig";
import {
  firstDefined,
  normalizeEntity,
  toIsoDate,
  toNumber,
} from "../../../services/mappers";

function mapSupplier(value) {
  const supplier = normalizeEntity(value, { name: "", document: "" });
  return {
    id: supplier.id ?? null,
    name: firstDefined(supplier.name, supplier.proveedor, ""),
    document: firstDefined(supplier.document, supplier.ruc, ""),
    phone: firstDefined(supplier.phone, supplier.telefono, ""),
    email: firstDefined(supplier.email, supplier.correo, ""),
  };
}

export function mapOrdenCompra(data = {}) {
  const status = firstDefined(data.status, data.estado, "Pendiente");
  return {
    ...data,
    id: data.id ?? null,
    number: firstDefined(data.number, data.numero, ""),
    supplier: mapSupplier(data.supplier ?? data.proveedor),
    date: toIsoDate(firstDefined(data.date, data.fecha)) || "",
    items: (Array.isArray(data.items) ? data.items : []).map((item, index) => ({
      ...item,
      productId: item.productId ?? item.productoId ?? null,
      product: firstDefined(item.product, item.producto, ""),
      unit: firstDefined(item.unit, item.unidad, "UNIDAD"),
      quantity: toNumber(firstDefined(item.quantity, item.cantidad), 0),
      price: toNumber(firstDefined(item.price, item.precioUnitario, item.precio), 0),
      subtotal: toNumber(item.subtotal),
      item: item.item ?? index + 1,
    })),
    subtotal: toNumber(data.subtotal),
    igv: toNumber(data.igv),
    total: toNumber(data.total),
    status,
    requestIds: Array.isArray(data.requestIds)
      ? data.requestIds
      : Array.isArray(data.solicitudIds)
      ? data.solicitudIds
      : [],
    saleNumber: firstDefined(data.saleNumber, data.ventaNumero, ""),
    casoId: data.casoId ?? null,
    receiptRegistered: status === "Cerrado",
  };
}

function toRequest(order = {}) {
  return {
    proveedorId: order.supplier?.id ?? order.proveedorId ?? null,
    casoId: order.casoId ?? null,
    solicitudIds: order.requestIds ?? order.solicitudIds ?? [],
    date: toIsoDate(order.date),
    items: (Array.isArray(order.items) ? order.items : []).map((item, index) => ({
      productId: item.productId ?? item.id ?? null,
      product: firstDefined(item.product, item.name, ""),
      unit: firstDefined(item.unit, "UNIDAD"),
      quantity: toNumber(firstDefined(item.quantity, item.cantidad), 0),
      price: toNumber(firstDefined(item.price, item.precio), 0),
      subtotal: toNumber(item.subtotal),
      item: index + 1,
    })),
    subtotal: toNumber(order.subtotal),
    igv: toNumber(order.igv),
    total: toNumber(order.total),
  };
}

export function listarOrdenes() {
  return apiGet("/ordenes-compra").then((data) =>
    (Array.isArray(data) ? data : []).map(mapOrdenCompra)
  );
}

export function obtenerOrden(id) {
  return apiGet(`/ordenes-compra/${id}`).then(mapOrdenCompra);
}

export function crearOrdenCompra(order) {
  return apiPost("/ordenes-compra", toRequest(order)).then(mapOrdenCompra);
}

export function cambiarEstadoOrden(id, estado) {
  return apiPatch(`/ordenes-compra/${id}/estado`, { estado }).then(mapOrdenCompra);
}

export function registrarRecepcionOrden(id) {
  return apiPost(`/ordenes-compra/${id}/recepcion`).then(mapOrdenCompra);
}
