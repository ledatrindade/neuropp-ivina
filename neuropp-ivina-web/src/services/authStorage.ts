import type { LoginResponse } from "../types/auth";

/*
 * Serviço simples para guardar os dados do usuário logado.
 *
 * MUDE A ESTRATÉGIA AQUI:
 * Por enquanto usamos localStorage para o MVP.
 */

const AUTH_KEY = "neuropp_auth_user";

export const AUTH_CHANGED_EVENT = "neuropp_auth_changed";

function notifyAuthChanged() {
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

export function saveAuthUser(user: LoginResponse) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  notifyAuthChanged();
}

export function getAuthUser(): LoginResponse | null {
  const storedUser = localStorage.getItem(AUTH_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as LoginResponse;
  } catch {
    return null;
  }
}

export function getAuthToken(): string | null {
  return getAuthUser()?.token ?? null;
}

export function isAuthenticated() {
  return Boolean(getAuthToken());
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
  notifyAuthChanged();
}