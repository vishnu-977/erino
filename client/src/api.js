const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080/api";

export async function api(path, { method="GET", body, headers={} } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...headers },
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) {
    let msg = "Request failed";
    try { const j = await res.json(); msg = j.message || msg; } catch {}
    throw new Error(msg);
  }
  return res.status === 204 ? null : res.json();
}
