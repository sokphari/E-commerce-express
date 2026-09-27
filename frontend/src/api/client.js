const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

function getToken() {
  return localStorage.getItem("phonehub_access_token");
}

export function setStoredSession(session) {
  if (!session) {
    localStorage.removeItem("phonehub_access_token");
    localStorage.removeItem("phonehub_refresh_token");
    localStorage.removeItem("phonehub_user");
    return;
  }

  localStorage.setItem("phonehub_access_token", session.tokens.accessToken);
  localStorage.setItem("phonehub_refresh_token", session.tokens.refreshToken);
  localStorage.setItem("phonehub_user", JSON.stringify(session.user));
}

export function getStoredUser() {
  const raw = localStorage.getItem("phonehub_user");
  return raw ? JSON.parse(raw) : null;
}

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers);

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const token = getToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || "Request failed");
  }

  return payload;
}

export const api = {
  getProducts: (query = "") => apiRequest(`/products${query}`),
  getProduct: (slug) => apiRequest(`/products/${slug}`),
  login: (input) => apiRequest("/auth/login", { method: "POST", body: JSON.stringify(input) }),
  register: (input) => apiRequest("/auth/register", { method: "POST", body: JSON.stringify(input) }),
  getCart: () => apiRequest("/cart"),
  addToCart: (input) => apiRequest("/cart/items", { method: "POST", body: JSON.stringify(input) }),
};
