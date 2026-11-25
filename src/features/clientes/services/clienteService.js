import { apiDelete, apiGet, apiPost, apiPut } from "../../../services/apiConfig";
import { firstDefined } from "../../../services/mappers";

export function mapCliente(data = {}) {
  return {
    ...data,
    id: data.id ?? null,
    name: firstDefined(data.name, data.nombre, ""),
    document: firstDefined(data.document, data.documento, ""),
    email: firstDefined(data.email, data.correo, ""),
  };
}

function toRequest(client = {}) {
  return {
    name: client.name || "",
    document: client.document || "",
    email: client.email || null,
  };
}

export function listarClientes() {
  return apiGet("/clientes").then((data) =>
    (Array.isArray(data) ? data : []).map(mapCliente)
  );
}

export function obtenerCliente(id) {
  return apiGet(`/clientes/${id}`).then(mapCliente);
}

export function crearCliente(client) {
  return apiPost("/clientes", toRequest(client)).then(mapCliente);
}

export function actualizarCliente(id, client) {
  return apiPut(`/clientes/${id}`, toRequest(client)).then(mapCliente);
}

export function eliminarCliente(id) {
  return apiDelete(`/clientes/${id}`);
}
