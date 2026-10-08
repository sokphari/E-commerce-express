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
  getBrands: (query = "") => apiRequest(`/brands${query}`),
  getProduct: (slug) => apiRequest(`/products/${slug}`),
  login: (input) => apiRequest("/auth/login", { method: "POST", body: JSON.stringify(input) }),
  register: (input) => apiRequest("/auth/register", { method: "POST", body: JSON.stringify(input) }),
  getCart: () => apiRequest("/cart"),
  addToCart: (input) => apiRequest("/cart/items", { method: "POST", body: JSON.stringify(input) }),
  updateCartItem: (id, input) => apiRequest(`/cart/items/${id}`, { method: "PATCH", body: JSON.stringify(input) }),
  removeCartItem: (id) => apiRequest(`/cart/items/${id}`, { method: "DELETE" }),
  clearCart: () => apiRequest("/cart", { method: "DELETE" }),
  getAddresses: () => apiRequest("/addresses"),
  createAddress: (input) => apiRequest("/addresses", { method: "POST", body: JSON.stringify(input) }),
  updateAddress: (id, input) => apiRequest(`/addresses/${id}`, { method: "PATCH", body: JSON.stringify(input) }),
  setDefaultAddress: (id) => apiRequest(`/addresses/${id}/default`, { method: "PATCH" }),
  deleteAddress: (id) => apiRequest(`/addresses/${id}`, { method: "DELETE" }),
  checkout: (input) => apiRequest("/checkout", { method: "POST", body: JSON.stringify(input) }),
  getWishlist: () => apiRequest("/wishlist"),
  addToWishlist: (productId) => apiRequest(`/wishlist/${productId}`, { method: "POST" }),
  removeFromWishlist: (productId) => apiRequest(`/wishlist/${productId}`, { method: "DELETE" }),
  getOrders: (query = "") => apiRequest(`/orders${query}`),
  getOrder: (id) => apiRequest(`/orders/${id}`),
  cancelOrder: (id) => apiRequest(`/orders/${id}/cancel`, { method: "POST" }),
  getProductReviews: (productId, query = "") => apiRequest(`/products/${productId}/reviews${query}`),
  createReview: (productId, input) => apiRequest(`/products/${productId}/reviews`, { method: "POST", body: JSON.stringify(input) }),
  updateReview: (id, input) => apiRequest(`/reviews/${id}`, { method: "PATCH", body: JSON.stringify(input) }),
  deleteReview: (id) => apiRequest(`/reviews/${id}`, { method: "DELETE" }),
  getAdminProducts: (query = "") => apiRequest(`/admin/products${query}`),
  getAdminVariants: (query = "") => apiRequest(`/admin/variants${query}`),
  getAdminOrders: (query = "") => apiRequest(`/admin/orders${query}`),
  getAdminPayments: (query = "") => apiRequest(`/admin/payments${query}`),
  getAdminInventoryMovements: (query = "") => apiRequest(`/admin/inventory-movements${query}`),
  getAdminReviews: (query = "") => apiRequest(`/admin/reviews${query}`),
};
