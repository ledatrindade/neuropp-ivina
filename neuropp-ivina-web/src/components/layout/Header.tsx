import { Link } from "react-router";
import { CalendarDays } from "lucide-react";
import { siteContent } from "../../content/siteContent";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#3E8E91]/10 bg-[#F7F3EA]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex flex-col">
          {/* MUDE O TEXTO AQUI: vem do arquivo siteContent.ts */}
          <span className="text-lg font-bold text-[#3E8E91]">
            {siteContent.brand.name}
          </span>

          {/* MUDE O TEXTO AQUI: vem do arquivo siteContent.ts */}
          <span className="text-xs text-[#333333]/70">
            {siteContent.brand.professionalName}
          </span>
        </Link>

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

        <Link
          to="/agendar"
          className="inline-flex items-center gap-2 rounded-full bg-[#E84545] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-95"
        >
          <CalendarDays size={18} />
          Marcar avaliação
        </Link>
      </div>
    </header>
  );
}