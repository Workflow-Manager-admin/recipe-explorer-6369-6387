const BACKEND_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

/** 
 * Helper to handle (and parse) JSON/fetch errors.
 */
async function handleResponse(r) {
  if (!r.ok) throw new Error(await r.text() || r.statusText);
  return await r.json();
}

// PUBLIC_INTERFACE
export const recipeApi = {
  async login({ username, password }) {
    const res = await fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password })
    });
    return await handleResponse(res);
  },
  async register({ username, password }) {
    const res = await fetch(`${BACKEND_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password })
    });
    return await handleResponse(res);
  },
  async logout() {
    await fetch(`${BACKEND_URL}/auth/logout`, {
      method: "POST",
      credentials: "include"
    });
    // No response expected
  },
  async getCurrentUser() {
    const res = await fetch(`${BACKEND_URL}/auth/me`, {
      credentials: "include"
    });
    if (res.status === 401) return null;
    return await handleResponse(res);
  },
  async listRecipes({ search, showFavorites } = {}) {
    let url = `${BACKEND_URL}/recipes`;
    const params = [];
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    if (showFavorites) params.push(`favorites=true`);
    if (params.length) url += `?${params.join('&')}`;
    const res = await fetch(url, { credentials: "include" });
    return await handleResponse(res);
  },
  async getRecipe(id) {
    const res = await fetch(`${BACKEND_URL}/recipes/${id}`, { credentials: "include" });
    return await handleResponse(res);
  },
  async createRecipe(data) {
    const res = await fetch(`${BACKEND_URL}/recipes`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return await handleResponse(res);
  },
  async updateRecipe(id, data) {
    const res = await fetch(`${BACKEND_URL}/recipes/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return await handleResponse(res);
  },
  async deleteRecipe(id) {
    const res = await fetch(`${BACKEND_URL}/recipes/${id}`, {
      method: "DELETE",
      credentials: "include"
    });
    if (res.status !== 204) throw new Error("Failed to delete");
  },
  async toggleFavorite(id) {
    const res = await fetch(`${BACKEND_URL}/recipes/${id}/favorite`, {
      method: "POST",
      credentials: "include"
    });
    return await handleResponse(res);
  },
  async getFavorites() {
    const res = await fetch(`${BACKEND_URL}/recipes/favorites`, {
      credentials: "include"
    });
    return await handleResponse(res);
  }
};
