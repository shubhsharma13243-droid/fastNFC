const API = import.meta.env.VITE_API_URL || "";
export const assetUrl = (p) => (p && !p.startsWith("http") ? API + p : p || "");
export const getToken = () => localStorage.getItem("token");
export const setToken = (t) => (t ? localStorage.setItem("token", t) : localStorage.removeItem("token"));

async function request(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (!(options.body instanceof FormData)) headers["Content-Type"] = "application/json";
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API}/api${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
}

const json = (method, body) => ({ method, body: JSON.stringify(body) });

export const api = {
  signup: (body) => request("/auth/signup", json("POST", body)),
  login: (body) => request("/auth/login", json("POST", body)),
  getMine: () => request("/business/me"),
  saveMine: (body) => request("/business/me", json("PUT", body)),
  uploadImages: (formData) => request("/business/me/images", { method: "POST", body: formData }),
  getPublic: (slug) => request(`/public/${slug}`),
};
