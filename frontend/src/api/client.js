const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(
  /\/$/,
  ""
);

const TOKEN_KEY = "tm_token";

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = tokenStore.get();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Cannot reach the server. Check your connection and try again.");
  }

  if (res.status === 204) return null;

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* no JSON body */
  }

  if (!res.ok) {
    const detail = data?.detail;
    const message =
      typeof detail === "string"
        ? detail
        : Array.isArray(detail)
        ? detail.map((d) => d.msg).join(", ")
        : "Something went wrong. Please try again.";
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  register: (payload) =>
    request("/auth/register", { method: "POST", body: payload, auth: false }),
  login: (payload) =>
    request("/auth/login", { method: "POST", body: payload, auth: false }),
  me: () => request("/auth/me"),

  listTasks: () => request("/tasks"),
  createTask: (payload) => request("/tasks", { method: "POST", body: payload }),
  updateTask: (id, payload) =>
    request(`/tasks/${id}`, { method: "PUT", body: payload }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: "DELETE" }),
};
