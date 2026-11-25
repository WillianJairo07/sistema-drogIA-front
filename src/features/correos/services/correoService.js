import axios from "axios";
import { API_BASE_URL, getToken } from "../../../services/apiConfig";

function http() {
  const token = getToken();

  return axios.create({
    baseURL: `${API_BASE_URL}/correos`,
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

export function listarCorreos(carpeta = "INBOX", limite = 20) {
  return http().get("", { params: { carpeta, limite } }).then((response) => response.data);
}

export function listarHistorial() {
  return http().get("/historial").then((response) => response.data);
}

export function listarCarpetas() {
  return http().get("/carpetas").then((response) => response.data);
}

export function clasificarCorreo(id) {
  return http().post(`/${id}/clasificar`).then((response) => response.data);
}

export function actualizarEstadoCorreo(id, estado, area) {
  return http().patch(`/${id}`, { estado, area }).then((response) => response.data);
}

export function ejecutarIngesta() {
  return http().post("/ingesta/ejecutar").then((response) => response.data);
}
