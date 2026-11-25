import { apiGet, apiPatch, apiPost, apiPut } from "../../../services/apiConfig";
import { normalizeRole } from "../../auth/services/authService";
import { firstDefined } from "../../../services/mappers";

export function mapUsuario(data = {}) {
  return {
    ...data,
    id: data.id ?? null,
    name: firstDefined(data.nombre, data.name, data.username, ""),
    username: firstDefined(data.username, ""),
    email: firstDefined(data.email, data.correo, ""),
    role: normalizeRole(firstDefined(data.role, data.rol, "")),
    active: data.active ?? data.activo ?? true,
  };
}

function toRequest(user = {}) {
  return {
    name: user.name || "",
    email: user.email || "",
    role: user.role || "Vendedor",
    password: user.password || null,
    active: user.active !== false,
  };
}

export function listarUsuarios() {
  return apiGet("/usuarios").then((data) =>
    (Array.isArray(data) ? data : []).map(mapUsuario)
  );
}

export function obtenerUsuario(id) {
  return apiGet(`/usuarios/${id}`).then(mapUsuario);
}

export function crearUsuario(user) {
  return apiPost("/usuarios", toRequest(user)).then(mapUsuario);
}

export function actualizarUsuario(id, user) {
  return apiPut(`/usuarios/${id}`, toRequest(user)).then(mapUsuario);
}

export function cambiarEstadoUsuario(id, active) {
  return apiPatch(`/usuarios/${id}/estado`, { active }).then(mapUsuario);
}
