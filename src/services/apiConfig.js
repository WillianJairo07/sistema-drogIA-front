export const API_BASE_URL = "http://localhost:8080/api";

export function getToken() {
  return localStorage.getItem("token");
}
