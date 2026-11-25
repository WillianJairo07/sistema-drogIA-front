import { API_BASE_URL } from "../../../services/apiConfig";

export function login(username, password) {
  const request = new XMLHttpRequest();
  request.open("POST", `${API_BASE_URL}/auth/login`, false);
  request.setRequestHeader("Content-Type", "application/json");
  request.setRequestHeader("Accept", "application/json");

  try {
    request.send(JSON.stringify({ username, password }));
  } catch {
    return null;
  }

  if (request.status < 200 || request.status >= 300) {
    return null;
  }

  let response;
  try {
    response = JSON.parse(request.responseText);
  } catch {
    return null;
  }

  if (!response || !response.token) {
    return null;
  }

  return {
    name: response.name,
    username: response.username,
    role: response.role,
    token: response.token,
  };
}
