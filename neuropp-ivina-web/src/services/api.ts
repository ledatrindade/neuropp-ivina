/*
 * Arquivo central para comunicação com a API Java.
 *
 * Durante o desenvolvimento:
 * Front-end: http://localhost:5173
 * Back-end:  http://localhost:8080
 */

const API_BASE_URL = "http://localhost:8080/api";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  token?: string | null;
};

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, token } = options;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message || "Ocorreu um erro ao comunicar com a API."
    );
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json();
}