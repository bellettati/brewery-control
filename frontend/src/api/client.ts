// URL base da API: vem da variável de ambiente em produção, com fallback para
// o servidor local de desenvolvimento.
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5042";

// Wrapper de fetch tipado: centraliza URL base, headers e tratamento de erro,
// para que as funções de cada endpoint sejam apenas chamadas finas.
export async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    // O backend retorna erros no formato ProblemDetails; extrai a mensagem
    // (campo detail) quando disponível, senão usa o status como fallback.
    const problem = await res.json().catch(() => null);
    throw new Error(problem?.detail ?? `Request failed: ${res.status}`);
  }

  // 204 No Content (PUT/DELETE) não tem corpo para fazer parse.
  if (res.status === 204) return undefined as T;
  return res.json();
}
