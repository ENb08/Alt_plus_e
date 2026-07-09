const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://alt-plus-e.onrender.com";

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

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data: any = {};
  try { data = JSON.parse(text); } catch {}
  if (!res.ok) {
    if (res.status === 401 && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    }
    throw new Error(data?.erreur || `Erreur ${res.status}`);
  }
  return data;
}
