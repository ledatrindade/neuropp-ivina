import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import {
  CalendarDays,
  FileText,
  LayoutDashboard,
  LogOut,
  UserRound,
} from "lucide-react";
import {
  AUTH_CHANGED_EVENT,
  getAuthUser,
  logout,
} from "../../services/authStorage";
import { siteContent } from "../../content/siteContent";
import type { LoginResponse } from "../../types/auth";

export function Header() {
  const location = useLocation();

  const [authUser, setAuthUser] = useState<LoginResponse | null>(getAuthUser());

  useEffect(() => {
    function updateAuthUser() {
      setAuthUser(getAuthUser());
    }

    window.addEventListener(AUTH_CHANGED_EVENT, updateAuthUser);
    window.addEventListener("storage", updateAuthUser);

    return () => {
      window.removeEventListener(AUTH_CHANGED_EVENT, updateAuthUser);
      window.removeEventListener("storage", updateAuthUser);
    };
  }, []);

  const isAdmin = authUser?.role === "ADMIN";
  const isResponsible = authUser?.role === "RESPONSIBLE";

  const isAdminArea = location.pathname.startsWith("/admin");

  const isResponsibleArea =
    location.pathname.startsWith("/responsavel") ||
    location.pathname.startsWith("/confirmar-agendamento") ||
    (isResponsible && location.pathname.startsWith("/agendar"));

  const isUserArea = isAdminArea || isResponsibleArea;

  const homePath = isAdmin
    ? "/admin"
    : isResponsible
    ? "/responsavel"
    : "/";

  function handleLogout() {
    logout();
    window.location.href = "/";
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#3E8E91]/10 bg-[#F7F3EA]/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8">
        <Link to={homePath} className="flex min-w-fit flex-col">
          <span className="text-lg font-bold text-[#3E8E91]">
            {siteContent.brand.name}
          </span>

          <span className="text-xs text-[#333333]/70">
            {siteContent.brand.professionalName}
          </span>
        </Link>

        {!isUserArea && (
          <nav className="hidden flex-1 items-center justify-center gap-2 text-sm font-medium text-[#333333] md:flex">
            <PublicNavLink to="/">Início</PublicNavLink>
            <PublicNavLink to="/sobre">Sobre</PublicNavLink>
            <PublicNavLink to="/avaliacao">Avaliação</PublicNavLink>
            <PublicNavLink to="/contato">Contato</PublicNavLink>
          </nav>
        )}

        {isResponsibleArea && (
          <nav className="hidden flex-1 items-center justify-center gap-2 text-sm font-medium text-[#333333] md:flex">
            <AreaNavLink to="/responsavel">Minha área</AreaNavLink>
            <AreaNavLink to="/responsavel/agendamentos">
              Agendamentos
            </AreaNavLink>
            <AreaNavLink to="/responsavel/documentos">Documentos</AreaNavLink>
            <AreaNavLink to="/agendar">Marcar avaliação</AreaNavLink>
          </nav>
        )}

        {isAdminArea && (
          <nav className="hidden flex-1 items-center justify-center gap-2 text-sm font-medium text-[#333333] md:flex">
            <AreaNavLink to="/admin">Painel</AreaNavLink>
            <AreaNavLink to="/admin/horarios">Horários</AreaNavLink>
            <AreaNavLink to="/admin/agendamentos">Agendamentos</AreaNavLink>
            <AreaNavLink to="/admin/documentos">Documentos</AreaNavLink>
          </nav>
        )}

        <div className="flex min-w-fit items-center gap-2">
          {authUser ? (
            <>
              {isAdminArea && (
                <span className="hidden rounded-full bg-[#3E8E91]/10 px-4 py-2 text-sm font-semibold text-[#3E8E91] lg:inline-flex">
                  Área admin
                </span>
              )}

              {isResponsibleArea && (
                <span className="hidden rounded-full bg-[#3E8E91]/10 px-4 py-2 text-sm font-semibold text-[#3E8E91] lg:inline-flex">
                  Área do responsável
                </span>
              )}

              {isAdmin && !isAdminArea && (
                <Link
                  to="/admin"
                  className="hidden items-center gap-2 rounded-full border border-[#3E8E91]/20 px-4 py-2 text-sm font-semibold text-[#3E8E91] transition hover:bg-[#3E8E91] hover:text-white sm:inline-flex"
                >
                  <LayoutDashboard size={18} />
                  Painel Admin
                </Link>
              )}

              {isResponsible && !isResponsibleArea && (
                <Link
                  to="/responsavel"
                  className="hidden items-center gap-2 rounded-full border border-[#3E8E91]/20 px-4 py-2 text-sm font-semibold text-[#3E8E91] transition hover:bg-[#3E8E91] hover:text-white sm:inline-flex"
                >
                  <UserRound size={18} />
                  Minha área
                </Link>
              )}

              {isResponsible && isResponsibleArea && (
                <Link
                  to="/responsavel/documentos"
                  className="hidden items-center gap-2 rounded-full border border-[#3E8E91]/20 px-4 py-2 text-sm font-semibold text-[#3E8E91] transition hover:bg-[#3E8E91] hover:text-white sm:inline-flex"
                >
                  <FileText size={18} />
                  Documentos
                </Link>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full border border-[#E84545]/30 px-4 py-2 text-sm font-semibold text-[#E84545] transition hover:bg-[#E84545] hover:text-white"
              >
                <LogOut size={18} />
                Sair
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden items-center gap-2 rounded-full border border-[#3E8E91]/20 px-4 py-2 text-sm font-semibold text-[#3E8E91] transition hover:bg-[#3E8E91] hover:text-white sm:inline-flex"
              >
                <UserRound size={18} />
                Entrar
              </Link>

              <Link
                to="/agendar"
                className="inline-flex items-center gap-2 rounded-full bg-[#E84545] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-95"
              >
                <CalendarDays size={18} />
                Marcar avaliação
              </Link>
            </>
          )}

          {authUser && !isAdminArea && !isResponsibleArea && (
            <Link
              to="/agendar"
              className="hidden items-center gap-2 rounded-full bg-[#E84545] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 sm:inline-flex"
            >
              <CalendarDays size={18} />
              Marcar avaliação
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

type NavLinkProps = {
  to: string;
  children: string;
};

function PublicNavLink({ to, children }: NavLinkProps) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        `rounded-full px-4 py-2 transition ${
          isActive
            ? "bg-[#3E8E91] text-white"
            : "text-[#333333] hover:bg-[#3E8E91]/10 hover:text-[#3E8E91]"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

function AreaNavLink({ to, children }: NavLinkProps) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `rounded-full px-4 py-2 transition ${
          isActive
            ? "bg-[#3E8E91] text-white"
            : "text-[#333333] hover:bg-[#3E8E91]/10 hover:text-[#3E8E91]"
        }`
      }
    >
      {children}
    </NavLink>
  );
}