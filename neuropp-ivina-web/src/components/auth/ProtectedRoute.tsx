import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { isAuthenticated } from "../../services/authStorage";

/*
 * Componente usado para proteger páginas.
 *
 * Se o usuário não estiver logado, ele é enviado para login.
 */

type ProtectedRouteProps = {
  children: ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return (
      <Navigate
        to={`/login?redirect=${location.pathname}`}
        replace
      />
    );
  }

  return children;
}