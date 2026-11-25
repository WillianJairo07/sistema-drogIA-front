import { apiGet, apiPatch, apiPost } from "../../../services/apiConfig";
import { firstDefined, normalizeEntity, normalizeList } from "../../../services/mappers";

export function mapCaso(data = {}) {
  return {
    ...data,
    id: data.id ?? data.casoId ?? null,
    casoId: data.casoId ?? data.id ?? null,
    correoId: data.correoId ?? null,
    remitente: firstDefined(data.remitente, data.sender, ""),
    asunto: firstDefined(data.asunto, data.subject, ""),
    area: firstDefined(data.area, ""),
    estado: firstDefined(data.estado, ""),
    status: firstDefined(data.status, data.estado, ""),
    asignadoAId: data.asignadoAId ?? null,
    asignadoANombre: firstDefined(data.asignadoANombre, ""),
    codigoSolicitud: firstDefined(data.codigoSolicitud, ""),
    cliente: normalizeEntity(data.cliente),
    productos: normalizeList(data.productos),
    destino: data.destino ?? null,
    ventaId: data.ventaId ?? null,
    ordenCompraId: data.ordenCompraId ?? null,
    pedidoAlmacenId: data.pedidoAlmacenId ?? null,
    cotizacionId: data.cotizacionId ?? null,
  };
}

export function estaTomadoPor(caso, nombreUsuario) {
  if (!caso || !nombreUsuario) return false;
  if (caso.asignadoAId) return true;
  return String(caso.asignadoANombre || "").trim().toLowerCase() ===
    String(nombreUsuario).trim().toLowerCase();
}

export function listarCasos() {
  return apiGet("/casos").then((data) => (Array.isArray(data) ? data : []).map(mapCaso));
}

export function obtenerCaso(id) {
  return apiGet(`/casos/${id}`).then(mapCaso);
}

export function tomarCaso(id) {
  return apiPost(`/casos/${id}/tomar`).then(mapCaso);
}

export function actualizarEstadoCaso(id, estado, observaciones) {
  return apiPatch(`/casos/${id}/estado`, { estado, observaciones: observaciones || null }).then(mapCaso);
}
