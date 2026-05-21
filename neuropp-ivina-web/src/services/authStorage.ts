import type { LoginResponse } from "../types/auth";

/*
 * Serviço simples para guardar os dados do usuário logado.
 *
 * Por enquanto vamos usar localStorage.
 *
 * Em produção, poderíamos evoluir para uma estratégia mais segura,
 * mas para o MVP e aprendizado está ótimo.
 */

const AUTH_KEY = "neuropp_auth_user";

export function saveAuthUser(user: LoginResponse) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
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
}
