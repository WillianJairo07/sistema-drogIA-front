import { apiPost } from "../../../services/apiConfig";

const ROLE_LABELS = {
  ADMINISTRACION: "Administrador",
  ADMINISTRADOR: "Administrador",
  VENTAS: "Vendedor",
  VENDEDOR: "Vendedor",
  COMPRAS: "Comprador",
  COMPRADOR: "Comprador",
  ALMACEN: "Almacenero",
  ALMACENERO: "Almacenero",
};

export function normalizeRole(role) {
  if (!role) return "";
  const key = String(role).trim().toUpperCase();
  return ROLE_LABELS[key] || ROLE_LABELS[String(role).trim()] || role;
}

/** Inicia sesión en el backend. No guarda el token: lo hace AuthContext. */
export async function login(username, password) {
  const response = await apiPost("/auth/login", { username, password });

  if (!response || !response.token) {
    return null;
  }

  return {
    name: response.nombre || response.name || response.username || "",
    username: response.username || username,
    role: normalizeRole(response.role || response.rol),
    token: response.token,
  };
}
