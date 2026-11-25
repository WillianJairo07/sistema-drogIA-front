import { apiGet } from "../../../services/apiConfig";
import { firstDefined, normalizeList, toIsoDate, toNumber } from "../../../services/mappers";

export function mapInventarioAlmacen(data = {}) {
  return {
    ...data,
    pedidoId: data.pedidoId ?? null,
    ordenCompraId: data.ordenCompraId ?? null,
    ordenCompraNumero: firstDefined(
      data.ordenCompraNumero,
      data.ordenCompraCodigo,
      ""
    ),
    ventaNumero: firstDefined(data.ventaNumero, ""),
    cliente: data.cliente ?? null,
    destino: data.destino ?? null,
    tipoDespacho: firstDefined(data.tipoDespacho, "LOCAL"),
    productos: normalizeList(data.productos),
    cantidadLotes: toNumber(firstDefined(data.cantidadLotes, 0), 0),
    unidades: toNumber(firstDefined(data.unidades, 0), 0),
    fechaLimiteEntrega: toIsoDate(data.fechaLimiteEntrega) || "",
    diasRestantes: toNumber(firstDefined(data.diasRestantes, 0), 0),
    estado: firstDefined(data.estado, ""),
    prioridad: firstDefined(data.prioridad, "Normal"),
    motivo: firstDefined(data.motivo, ""),
  };
}

export function listarInventarioAlmacen() {
  return apiGet("/pedidos-almacen/inventario-pendiente").then((data) =>
    (Array.isArray(data) ? data : []).map(mapInventarioAlmacen)
  );
}
