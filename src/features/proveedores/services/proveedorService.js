import { apiDelete, apiGet, apiPost, apiPut } from "../../../services/apiConfig";
import { firstDefined } from "../../../services/mappers";

export function mapProveedor(data = {}) {
  return {
    ...data,
    id: data.id ?? null,
    name: firstDefined(data.name, data.nombre, ""),
    document: firstDefined(data.document, data.documento, ""),
    phone: firstDefined(data.phone, data.telefono, ""),
    email: firstDefined(data.email, data.correo, ""),
  };
}

function toRequest(supplier = {}) {
  return {
    name: supplier.name || "",
    document: supplier.document || "",
    phone: supplier.phone || null,
    email: supplier.email || null,
  };
}

export function listarProveedores() {
  return apiGet("/proveedores").then((data) =>
    (Array.isArray(data) ? data : []).map(mapProveedor)
  );
}

export function obtenerProveedor(id) {
  return apiGet(`/proveedores/${id}`).then(mapProveedor);
}

export function crearProveedor(supplier) {
  return apiPost("/proveedores", toRequest(supplier)).then(mapProveedor);
}

export function actualizarProveedor(id, supplier) {
  return apiPut(`/proveedores/${id}`, toRequest(supplier)).then(mapProveedor);
}

export function eliminarProveedor(id) {
  return apiDelete(`/proveedores/${id}`);
}
