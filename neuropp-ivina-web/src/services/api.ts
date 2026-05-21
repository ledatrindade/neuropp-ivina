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

  const responseText = await response.text();

  if (!response.ok) {
    let errorMessage = "Ocorreu um erro ao comunicar com a API.";

    if (responseText) {
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData?.message || errorMessage;
      } catch {
        errorMessage = responseText;
      }
    }

    throw new Error(errorMessage);
  }

  if (!responseText) {
    return null as T;
  }

  return JSON.parse(responseText) as T;
}