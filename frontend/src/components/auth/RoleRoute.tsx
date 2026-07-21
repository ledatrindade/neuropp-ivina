import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getAuthUser } from "../../services/authStorage";
import type { UserRole } from "../../types/auth";

type RoleRouteProps = {
  children: ReactNode;
  role: UserRole;
};

export function RoleRoute({ children, role }: RoleRouteProps) {
  const location = useLocation();
  const user = getAuthUser();

  if (!user) {
    const redirect = `${location.pathname}${location.search}`;
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(redirect)}`}
        replace
      />
    );
  }

  if (user.role !== role) {
    return <Navigate to={user.role === "ADMIN" ? "/admin" : "/responsavel"} replace />;
  }

  return children;
}
