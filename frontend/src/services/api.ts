import { getAuthToken, logout } from "./authStorage";
import type { ApiErrorResponse } from "../types/api";


// Lê a URL do backend definida para o ambiente atual.
// Em desenvolvimento, ela aponta para localhost:8080.
// Em produção, deve apontar para a URL pública da API.
// O Vite incorpora esse valor no frontend durante o build.

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:8080/api").replace(/\/$/, "");

export type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  token?: string | null;
  auth?: boolean;
  signal?: AbortSignal;
  query?: Record<string, string | number | boolean | undefined | null>;
};

export class ApiRequestError extends Error {
  status: number;
  code?: string;
  fieldErrors: Record<string, string>;
  requestId?: string;

  constructor(message: string, details: Partial<ApiErrorResponse> = {}) {
    super(message);
    this.name = "ApiRequestError";
    this.status = details.status ?? 0;
    this.code = details.code;
    this.fieldErrors = details.fieldErrors ?? {};
    this.requestId = details.requestId;
  }
}

function buildUrl(endpoint: string, query?: RequestOptions["query"]) {
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = new URL(`${API_BASE_URL}${normalizedEndpoint}`);

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

function handleUnauthorized() {
  logout();
  if (window.location.pathname !== "/login") {
    const redirect = `${window.location.pathname}${window.location.search}`;
    window.location.assign(`/login?reason=session-expired&redirect=${encodeURIComponent(redirect)}`);
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const {
    method = "GET",
    body,
    token,
    auth = false,
    signal,
    query,
  } = options;

  const authToken = token ?? (auth ? getAuthToken() : null);

  if (auth && !authToken) {
    handleUnauthorized();
    throw new ApiRequestError("Sua sessão expirou. Entre novamente.", {
      status: 401,
      code: "AUTH_REQUIRED",
    });
  }

  let response: Response;
  try {
    response = await fetch(buildUrl(endpoint, query), {
      method,
      signal,
      headers: {
        Accept: "application/json",
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new ApiRequestError(
      "Não foi possível conectar à API. Confirme se o backend está em execução.",
      { status: 0, code: "NETWORK_ERROR" },
    );
  }

  const responseText = await response.text();
  let parsed: unknown = null;

  if (responseText) {
    try {
      parsed = JSON.parse(responseText);
    } catch {
      parsed = responseText;
    }
  }

  if (!response.ok) {
    const details =
      parsed && typeof parsed === "object"
        ? (parsed as ApiErrorResponse)
        : undefined;

    if (response.status === 401 && authToken) handleUnauthorized();

    throw new ApiRequestError(
      details?.message ||
        (typeof parsed === "string" && parsed) ||
        "Não foi possível concluir a operação.",
      {
        ...details,
        status: response.status,
        requestId: response.headers.get("X-Request-Id") ?? details?.requestId,
      },
    );
  }

  return parsed as T;
}

export function getFieldErrors(error: unknown) {
  return error instanceof ApiRequestError ? error.fieldErrors : {};
}

export function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}
