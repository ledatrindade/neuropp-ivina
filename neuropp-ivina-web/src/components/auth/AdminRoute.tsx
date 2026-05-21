import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { getAuthUser, isAuthenticated } from "../../services/authStorage";

/*
 * Protege páginas administrativas.
 *
 * Só usuários com role ADMIN podem acessar.
 */

type AdminRouteProps = {
  children: ReactNode;
};

export function AdminRoute({ children }: AdminRouteProps) {
  const location = useLocation();

  const authUser = getAuthUser();

  if (!isAuthenticated()) {
    return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  }

  if (authUser?.role !== "ADMIN") {
    return <Navigate to="/agendar" replace />;
  }

  return children;
}