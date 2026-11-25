import { apiDelete, apiGet, apiPost, apiPut } from "../../../services/apiConfig";
import { firstDefined, toIsoDate, toNumber } from "../../../services/mappers";

export function mapProducto(data = {}) {
  return {
    ...data,
    id: data.id ?? null,
    name: firstDefined(data.name, data.nombre, ""),
    unit: firstDefined(data.unit, data.unidad, ""),
    lot: firstDefined(data.lot, data.lote, ""),
    healthRegistration: firstDefined(
      data.healthRegistration,
      data.registroSanitario,
      ""
    ),
    price: toNumber(data.price, 0),
    stock: toNumber(data.stock, 0),
    expiration: toIsoDate(data.expiration) || "",
  };
}

function toRequest(product = {}) {
  return {
    name: product.name || "",
    unit: product.unit || null,
    lot: product.lot || null,
    healthRegistration: product.healthRegistration || null,
    price: toNumber(product.price, 0),
    stock: toNumber(product.stock ?? 0, 0),
    expiration: toIsoDate(product.expiration),
  };
}

export function listarProductos() {
  return apiGet("/productos").then((data) =>
    (Array.isArray(data) ? data : []).map(mapProducto)
  );
}

export function buscarProductos(term) {
  return apiGet("/productos", {
    params: term ? { q: term } : undefined,
  }).then((data) => (Array.isArray(data) ? data : []).map(mapProducto));
}

export function obtenerProducto(id) {
  return apiGet(`/productos/${id}`).then(mapProducto);
}

export function crearProducto(product) {
  return apiPost("/productos", toRequest(product)).then(mapProducto);
}

export function actualizarProducto(id, product) {
  return apiPut(`/productos/${id}`, toRequest(product)).then(mapProducto);
}

export function eliminarProducto(id) {
  return apiDelete(`/productos/${id}`);
}
