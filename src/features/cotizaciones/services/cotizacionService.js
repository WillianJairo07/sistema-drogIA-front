import { apiGet, apiPatch, apiPost, apiPut } from "../../../services/apiConfig";
import {
  firstDefined,
  normalizeEntity,
  normalizeList,
  toIsoDate,
  toNumber,
} from "../../../services/mappers";

export function mapClienteCotizacion(value, fallbackName = "") {
  const cliente = normalizeEntity(value, {
    name: fallbackName,
    document: "",
    email: "",
  });
  const nombre = firstDefined(cliente.name, cliente.nombre, fallbackName, "");
  let email = firstDefined(cliente.email, cliente.correo, "");
  if (!email && String(nombre).includes("@")) email = nombre;
  return {
    id: cliente.id ?? cliente.clienteId ?? null,
    name: nombre,
    document: firstDefined(cliente.document, cliente.documento, ""),
    email,
  };
}

export function mapProductoCotizacion(product = {}, index = 0) {
  return {
    ...product,
    id: product.id ?? product.productId ?? null,
    productId: product.productId ?? product.id ?? null,
    name: firstDefined(product.name, product.producto, product.product, ""),
    unit: firstDefined(product.unit, product.unidad, product.unidadMedida, "UNIDAD"),
    quantity: toNumber(firstDefined(product.quantity, product.cantidad), 0),
    price: toNumber(firstDefined(product.price, product.precioUnitario, product.precio), 0),
    subtotal: toNumber(product.subtotal, 0),
    item: toNumber(product.item, index + 1),
  };
}

/** Convierte los productos extraídos de un caso/correo al modelo de CotizacionForm. */
export function productosDesdeCaso(value) {
  return normalizeList(value).map((product, index) => mapProductoCotizacion(product, index));
}

export function mapCotizacion(data = {}) {
  const cliente = mapClienteCotizacion(
    firstDefined(data.client, data.cliente),
    typeof data.cliente === "string" ? data.cliente : data.clienteNombre || ""
  );
  const productos = normalizeList(firstDefined(data.products, data.items, []))
    .map((product, index) => mapProductoCotizacion(product, index));

  return {
    ...data,
    id: data.id ?? null,
    number: firstDefined(data.number, data.numero, ""),
    numero: firstDefined(data.numero, data.number, ""),
    casoId: data.casoId ?? null,
    correoId: data.correoId ?? null,
    client: cliente,
    cliente: cliente,
    status: firstDefined(data.status, data.estado, "Pendiente"),
    estado: firstDefined(data.estado, data.status, "Pendiente"),
    date: toIsoDate(firstDefined(data.date, data.fechaCreacion)) || "",
    fechaCreacion: data.fechaCreacion ?? null,
    products: productos,
    items: data.items ?? [],
    destino: data.destino ?? null,
    proveedores: normalizeList(data.proveedores),
    subtotal: toNumber(data.subtotal),
    igv: toNumber(data.igv),
    total: toNumber(data.total),
  };
}

function toRequest(quote = {}) {
  const client = quote.client || quote.cliente || {};
  const productos = normalizeList(firstDefined(quote.products, quote.items, []))
    .map((product, index) => ({
      productoId: product.productId ?? product.id ?? null,
      producto: firstDefined(product.name, product.producto, product.product, ""),
      unidad: firstDefined(product.unit, product.unidad, product.unidadMedida, "UNIDAD"),
      cantidad: toNumber(firstDefined(product.quantity, product.cantidad), 0),
      precioUnitario: toNumber(firstDefined(product.price, product.precioUnitario, product.precio), 0),
      subtotal: toNumber(product.subtotal, 0),
      item: index + 1,
    }));

  return {
    casoId: quote.casoId ?? null,
    clienteId: client.id ?? null,
    cliente: client.name || "",
    clienteDocumento: client.document || "",
    clienteEmail: client.email || "",
    fecha: toIsoDate(quote.date),
    condicionesPago: quote.condicionesPago || null,
    vigencia: quote.vigencia || null,
    items: productos,
    subtotal: toNumber(quote.subtotal),
    igv: toNumber(quote.igv),
    destino: quote.destino ?? null,
    proveedores: quote.proveedores ?? [],
    observaciones: quote.observaciones || null,
  };
}

export function listarCotizaciones() {
  return apiGet("/cotizaciones").then((data) =>
    (Array.isArray(data) ? data : []).map(mapCotizacion)
  );
}

export function obtenerCotizacion(id) {
  return apiGet(`/cotizaciones/${id}`).then(mapCotizacion);
}

export function crearCotizacion(quote, casoId) {
  return apiPost("/cotizaciones", toRequest({ ...quote, casoId: casoId ?? quote.casoId })).then(
    mapCotizacion
  );
}

export function actualizarCotizacion(id, quote) {
  return apiPut(`/cotizaciones/${id}`, toRequest(quote)).then(mapCotizacion);
}

export function cambiarEstadoCotizacion(id, estado) {
  return apiPatch(`/cotizaciones/${id}/estado`, { estado }).then(mapCotizacion);
}

export function listarProveedores(id) {
  return apiGet(`/cotizaciones/${id}/proveedores`).then((data) => normalizeList(data));
}

export function guardarProveedores(id, proveedores) {
  return apiPost(`/cotizaciones/${id}/proveedores`, proveedores || []).then((data) =>
    normalizeList(data)
  );
}

export function enviarCotizacion(id, payload) {
  return apiPost(`/cotizaciones/${id}/enviar-correo`, payload);
}
