import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  UserRound,
  X,
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
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState<LoginResponse | null>(getAuthUser());
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const update = () => setAuthUser(getAuthUser());
    window.addEventListener(AUTH_CHANGED_EVENT, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(AUTH_CHANGED_EVENT, update);
      window.removeEventListener("storage", update);
    };
  }, []);


  const isAdmin = authUser?.role === "ADMIN";
  const isResponsible = authUser?.role === "RESPONSIBLE";
  const isAdminArea = location.pathname.startsWith("/admin");
  const isResponsibleArea =
    location.pathname.startsWith("/responsavel") ||
    location.pathname.startsWith("/confirmar-agendamento") ||
    (isResponsible && location.pathname.startsWith("/agendar"));
  const isPrivateArea = isAdminArea || isResponsibleArea;
  const homePath = isAdmin ? "/admin" : isResponsible ? "/responsavel" : "/";

  const navItems = isAdminArea
    ? [
        ["Painel", "/admin"],
        ["Horários", "/admin/horarios"],
        ["Agendamentos", "/admin/agendamentos"],
        ["Documentos", "/admin/documentos"],
      ]
    : isResponsibleArea
      ? [
          ["Minha área", "/responsavel"],
          ["Agendamentos", "/responsavel/agendamentos"],
          ["Documentos", "/responsavel/documentos"],
          ["Marcar avaliação", "/agendar"],
        ]
      : [
          ["Início", "/"],
          ["Sobre", "/sobre"],
          ["Avaliação", "/avaliacao"],
          ["Contato", "/contato"],
        ];

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#3E8E91]/10 bg-[#F7F3EA]/95 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <Link to={homePath} className="flex min-w-fit flex-col rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3E8E91]">
          <span className="text-lg font-bold text-[#3E8E91]">{siteContent.brand.name}</span>
          <span className="text-xs text-[#333333]/70">{siteContent.brand.professionalName}</span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-1 text-sm font-medium md:flex" aria-label="Navegação principal">
          {navItems.map(([label, to]) => (
            <NavItem key={to} to={to} label={label} end={to === "/" || to === "/admin" || to === "/responsavel"} />
          ))}
        </nav>

        <div className="hidden min-w-fit items-center gap-2 md:flex">
          {authUser ? (
            <>
              {!isPrivateArea && isAdmin && (
                <Link to="/admin" className="header-secondary"><LayoutDashboard size={18} />Painel</Link>
              )}
              {!isPrivateArea && isResponsible && (
                <Link to="/responsavel" className="header-secondary"><UserRound size={18} />Minha área</Link>
              )}
              <button type="button" onClick={handleLogout} className="header-danger"><LogOut size={18} />Sair</button>
            </>
          ) : (
            <>
              <Link to="/login" className="header-secondary"><UserRound size={18} />Entrar</Link>
              <Link to="/agendar" className="header-primary"><CalendarDays size={18} />Marcar avaliação</Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((current) => !current)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#3E8E91]/20 text-[#3E8E91] md:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div id="mobile-menu" className="border-t border-[#3E8E91]/10 bg-[#F7F3EA] px-4 pb-5 pt-3 md:hidden">
          <nav className="grid gap-2" aria-label="Navegação móvel">
            {navItems.map(([label, to]) => (
              <NavItem key={to} to={to} label={label} mobile end={to === "/" || to === "/admin" || to === "/responsavel"} onNavigate={() => setMobileOpen(false)} />
            ))}
          </nav>
          <div className="mt-4 grid gap-2 border-t border-[#3E8E91]/10 pt-4">
            {authUser ? (
              <>
                {isAdmin && !isAdminArea && <Link to="/admin" className="header-secondary justify-center"><LayoutDashboard size={18} />Painel administrativo</Link>}
                {isResponsible && !isResponsibleArea && <Link to="/responsavel" className="header-secondary justify-center"><UserRound size={18} />Minha área</Link>}
                {isResponsible && <Link to="/responsavel/documentos" className="header-secondary justify-center"><FileText size={18} />Documentos</Link>}
                <button type="button" onClick={handleLogout} className="header-danger justify-center"><LogOut size={18} />Sair</button>
              </>
            ) : (
              <>
                <Link to="/login" className="header-secondary justify-center"><UserRound size={18} />Entrar</Link>
                <Link to="/agendar" className="header-primary justify-center"><CalendarDays size={18} />Marcar avaliação</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function NavItem({ to, label, end, mobile = false, onNavigate }: { to: string; label: string; end?: boolean; mobile?: boolean; onNavigate?: () => void }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      className={({ isActive }) => `${mobile ? "w-full rounded-2xl px-4 py-3" : "rounded-full px-4 py-2"} transition ${isActive ? "bg-[#3E8E91] text-white" : "text-[#333333] hover:bg-[#3E8E91]/10 hover:text-[#3E8E91]"}`}
    >
      {label}
    </NavLink>
  );
}
