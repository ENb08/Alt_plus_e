const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string;
};

export async function api(path: string, { method = "GET", body, token }: RequestOptions = {}) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.erreur || `Erreur ${res.status}`);
  return data;
}
