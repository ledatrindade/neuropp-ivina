import { Link } from "react-router-dom";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import { siteContent } from "../../content/siteContent";
import { buildWhatsappUrl } from "../../utils/whatsapp";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-[#3E8E91]/10 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:grid-cols-[1.1fr_0.8fr_1fr] md:px-8">
        <div>
          <p className="text-xl font-bold text-[#3E8E91]">{siteContent.brand.name}</p>
          <p className="mt-1 text-sm font-semibold text-[#333333]">{siteContent.brand.professionalName}</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-[#333333]/65">Avaliação neuropsicopedagógica infantil com acolhimento, escuta e orientação para a família.</p>
        </div>
        <div>
          <p className="font-bold text-[#333333]">Navegação</p>
          <div className="mt-3 grid gap-2 text-sm text-[#333333]/70">
            <Link to="/sobre" className="hover:text-[#3E8E91]">Sobre a profissional</Link>
            <Link to="/avaliacao" className="hover:text-[#3E8E91]">Como funciona</Link>
            <Link to="/agendar" className="hover:text-[#3E8E91]">Agendamento</Link>
            <Link to="/contato" className="hover:text-[#3E8E91]">Contato</Link>
          </div>
        </div>
        <div>
          <p className="font-bold text-[#333333]">Contato</p>
          <div className="mt-3 grid gap-3 text-sm text-[#333333]/70">
            <a className="flex items-center gap-2 hover:text-[#3E8E91]" href={buildWhatsappUrl(siteContent.contact.whatsapp, "Olá, Ivina! Gostaria de mais informações.")} target="_blank" rel="noreferrer"><MessageCircle size={17} />WhatsApp</a>
            <a className="flex items-center gap-2 hover:text-[#3E8E91]" href={`mailto:${siteContent.contact.email}`}><Mail size={17} />{siteContent.contact.email}</a>
            <span className="flex items-start gap-2"><MapPin className="mt-0.5 shrink-0" size={17} />{siteContent.contact.locationShort}</span>
          </div>
        </div>
      </div>
      <div className="border-t border-[#3E8E91]/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-xs text-[#333333]/60 sm:flex-row sm:items-center sm:justify-between md:px-8">
          <p>© {new Date().getFullYear()} NeuroPP Ivina Peixoto. Todos os direitos reservados.</p>
          <p>Desenvolvido por <strong className="text-[#3E8E91]">LT Tech</strong></p>
        </div>
      </div>
    </footer>
  );
}
