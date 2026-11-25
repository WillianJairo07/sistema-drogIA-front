import { apiGet, apiPatch, apiPost } from "../../../services/apiConfig";
import { firstDefined, normalizeEntity } from "../../../services/mappers";

/** Adapta CorreoResponse al modelo usado por EmailAnalysisPanel. */
export function mapCorreo(data = {}) {
  return {
    ...data,
    id: data.id ?? data.correoId ?? null,
    caseId: data.casoId ?? data.caseId ?? null,
    sender: firstDefined(data.sender, data.remitente, ""),
    subject: firstDefined(data.subject, data.asunto, ""),
    date: firstDefined(data.date, data.fecha, ""),
    area: firstDefined(data.area, ""),
    status: firstDefined(data.status, data.estado, "Pendiente"),
    cliente: normalizeEntity(data.cliente),
    productos: data.productos ?? null,
    destino: data.destino ?? null,
    cuerpoTexto: firstDefined(data.cuerpoTexto, data.cuerpo_texto, data.snippet, ""),
  };
}

function mapList(data) {
  return (Array.isArray(data) ? data : []).map(mapCorreo);
}

export function listarHistorial() {
  return apiGet("/correos/historial").then(mapList);
}

export function obtenerCorreo(id) {
  return apiGet(`/correos/${id}`).then(mapCorreo);
}

export function clasificarCorreo(id) {
  return apiPost(`/correos/${id}/clasificar`).then(mapCorreo);
}

export function actualizarEstadoCorreo(id, estado, area) {
  return apiPatch(`/correos/${id}`, { estado, area: area || null }).then(mapCorreo);
}

export function ejecutarIngesta() {
  return apiPost("/correos/ingesta/ejecutar");
}
