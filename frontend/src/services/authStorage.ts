import type { LoginResponse } from "../types/auth";

const AUTH_KEY = "neuropp_auth_user";
export const AUTH_CHANGED_EVENT = "neuropp_auth_changed";

function notifyAuthChanged() {
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

function isLoginResponse(value: unknown): value is LoginResponse {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<LoginResponse>;
  return (
    typeof candidate.token === "string" &&
    typeof candidate.userId === "string" &&
    typeof candidate.name === "string" &&
    typeof candidate.email === "string" &&
    (candidate.role === "ADMIN" || candidate.role === "RESPONSIBLE") &&
    typeof candidate.expiresAt === "string"
  );
}

function isExpired(user: LoginResponse) {
  const expiresAt = Date.parse(user.expiresAt);
  return Number.isFinite(expiresAt) && expiresAt <= Date.now();
}

export function saveAuthUser(user: LoginResponse) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  notifyAuthChanged();
}

export function getAuthUser(): LoginResponse | null {
  const stored = localStorage.getItem(AUTH_KEY);
  if (!stored) return null;

  try {
    const parsed: unknown = JSON.parse(stored);
    if (!isLoginResponse(parsed) || isExpired(parsed)) {
      localStorage.removeItem(AUTH_KEY);
      return null;
    }
    return parsed;
  } catch {
    localStorage.removeItem(AUTH_KEY);
    return null;
  }
}

export function getAuthToken() {
  return getAuthUser()?.token ?? null;
}

export function isAuthenticated() {
  return Boolean(getAuthToken());
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
  notifyAuthChanged();
}
