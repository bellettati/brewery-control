const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5042";

export async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const problem = await res.json().catch(() => null);
    throw new Error(problem?.detail ?? `Request failed: ${res.status}`);
  }

  // 204 No Content (PUT/DELETE) nao body para formatar
  if (res.status === 204) return undefined as T;
  return res.json();
}
