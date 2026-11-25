import { apiGet, apiPatch, apiPost } from "../../../services/apiConfig";
import { firstDefined, normalizeEntity, toIsoDate, toNumber } from "../../../services/mappers";
import { mapClienteCotizacion } from "../../cotizaciones/services/cotizacionService";

export function mapVenta(data = {}) {
  const items = (Array.isArray(data.items) ? data.items : []).map((item, index) => {
    const id = item.id ?? item.productId ?? item.productoId ?? index + 1;
    const name = firstDefined(item.name, item.producto, item.product, "");
    return {
      ...item,
      id,
      name,
      productId: item.productId ?? item.id ?? null,
      product: normalizeEntity(item.product, { id, name }),
      unit: firstDefined(item.unit, item.unidad, "UNIDAD"),
      quantity: toNumber(firstDefined(item.quantity, item.cantidad), 0),
      price: toNumber(firstDefined(item.price, item.precioUnitario, item.precio), 0),
      subtotal: toNumber(item.subtotal),
    };
  });

  return {
    ...data,
    id: data.id ?? null,
    number: firstDefined(data.number, data.numero, ""),
    quoteNumber: firstDefined(data.quoteNumber, data.cotizacionNumero, ""),
    client: mapClienteCotizacion(firstDefined(data.client, data.cliente), data.clienteNombre || ""),
    date: toIsoDate(firstDefined(data.date, data.fecha)) || "",
    items,
    subtotal: toNumber(data.subtotal),
    igv: toNumber(data.igv),
    total: toNumber(data.total),
    status: firstDefined(data.status, data.estado, "Pendiente de compra"),
  };
}

function toRequest(sale = {}) {
  return {
    client: sale.client || sale.cliente || null,
    cotizacionId: sale.cotizacionId ?? null,
    casoId: sale.casoId ?? null,
    date: toIsoDate(sale.date),
    items: (Array.isArray(sale.items) ? sale.items : []).map((item, index) => {
      const product = item.product || {};
      return {
        id: item.productId ?? item.id ?? product.id ?? null,
        name: firstDefined(item.name, product.name, ""),
        unit: firstDefined(item.unit, product.unit, "UNIDAD"),
        quantity: toNumber(firstDefined(item.quantity, item.cantidad), 1),
        price: toNumber(firstDefined(item.price, product.price), 0),
        subtotal: toNumber(item.subtotal, 0),
        item: index + 1,
      };
    }),
    subtotal: toNumber(sale.subtotal),
    igv: toNumber(sale.igv),
    total: toNumber(sale.total),
  };
}

export function listarVentas() {
  return apiGet("/ventas").then((data) => (Array.isArray(data) ? data : []).map(mapVenta));
}

export function obtenerVenta(id) {
  return apiGet(`/ventas/${id}`).then(mapVenta);
}

export function crearVenta(sale) {
  return apiPost("/ventas", toRequest(sale)).then(mapVenta);
}

export function convertirCotizacionEnVenta(cotizacionId) {
  return apiPost(`/ventas/desde-cotizacion/${cotizacionId}`).then(mapVenta);
}

export function cambiarEstadoVenta(id, estado) {
  return apiPatch(`/ventas/${id}/estado`, { estado }).then(mapVenta);
}
