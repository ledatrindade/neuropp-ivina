import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
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
    <header className="sticky top-0 z-50 border-b border-[#3E8E91]/10 bg-[#F7F3EA]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to={homePath} className="flex flex-col">
          <span className="text-lg font-bold text-[#3E8E91]">
            {siteContent.brand.name}
          </span>

          <span className="text-xs text-[#333333]/70">
            {siteContent.brand.professionalName}
          </span>
        </Link>

        {!isUserArea && (
          <nav className="hidden items-center gap-6 text-sm font-medium text-[#333333] md:flex">
            <Link className="hover:text-[#3E8E91]" to="/">
              Início
            </Link>
            <Link className="hover:text-[#3E8E91]" to="/sobre">
              Sobre
            </Link>
            <Link className="hover:text-[#3E8E91]" to="/avaliacao">
              Avaliação
            </Link>
            <Link className="hover:text-[#3E8E91]" to="/contato">
              Contato
            </Link>
          </nav>
        )}

        {isResponsibleArea && (
          <nav className="hidden items-center gap-5 text-sm font-medium text-[#333333] md:flex">
            <Link className="hover:text-[#3E8E91]" to="/responsavel">
              Minha área
            </Link>

            <Link
              className="hover:text-[#3E8E91]"
              to="/responsavel/agendamentos"
            >
              Agendamentos
            </Link>

            <Link className="hover:text-[#3E8E91]" to="/responsavel/documentos">
              Documentos
            </Link>

            <Link className="hover:text-[#3E8E91]" to="/agendar">
              Marcar avaliação
            </Link>
          </nav>
        )}

        {isAdminArea && (
          <nav className="hidden items-center gap-5 text-sm font-medium text-[#333333] md:flex">
            <Link className="hover:text-[#3E8E91]" to="/admin">
              Painel
            </Link>

            <Link className="hover:text-[#3E8E91]" to="/admin/horarios">
              Horários
            </Link>
          </nav>
        )}

        <div className="flex items-center gap-2">
          {authUser ? (
            <>
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
              className="inline-flex items-center gap-2 rounded-full bg-[#E84545] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-95"
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