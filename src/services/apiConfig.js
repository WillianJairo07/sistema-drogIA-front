import axios from "axios";

export const API_BASE_URL = "http://localhost:8080/api";

export function getToken() {
  return localStorage.getItem("token");
}

export function setToken(token) {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
}

function unwrapPayload(data) {
  if (
    data &&
    typeof data === "object" &&
    !Array.isArray(data) &&
    Object.prototype.hasOwnProperty.call(data, "content")
  ) {
    return data.content;
  }
  return data ?? null;
}

export function normalizeApiError(error) {
  const response = error?.response;
  const data = response?.data;
  let message = "";

  if (typeof data === "string") {
    message = data;
  } else if (data && typeof data === "object") {
    if (typeof data.message === "string") {
      message = data.message;
    } else if (Array.isArray(data.errors)) {
      message = data.errors.join(", ");
    } else {
      const fields = Object.entries(data).filter(([key]) => key !== "content");
      if (fields.length > 0) {
        message = fields.map(([key, value]) => `${key}: ${value}`).join(", ");
      }
    }
  }

  if (!message && error?.code === "ERR_NETWORK") {
    message = "No se pudo conectar con el servidor.";
  }
  if (!message) {
    message = error?.message || "Ocurrió un error inesperado.";
  }

  const normalized = new Error(message);
  normalized.status = response?.status;
  normalized.response = response;
  return normalized;
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { Accept: "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    response.data = unwrapPayload(response.data);
    return response;
  },
  (error) => Promise.reject(normalizeApiError(error))
);

export async function apiGet(path, config) {
  const response = await apiClient.get(path, config);
  return response.data;
}

export async function apiPost(path, body, config) {
  const response = await apiClient.post(path, body, config);
  return response.data;
}

export async function apiPut(path, body, config) {
  const response = await apiClient.put(path, body, config);
  return response.data;
}

export async function apiPatch(path, body, config) {
  const response = await apiClient.patch(path, body, config);
  return response.data;
}

export async function apiDelete(path, config) {
  const response = await apiClient.delete(path, config);
  return response.data;
}

export default apiClient;
