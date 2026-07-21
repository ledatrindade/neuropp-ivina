import type { ReactNode } from "react";
import {
  AtSign,
  CalendarDays,
  Mail,
  MapPin,
  MessageCircle,
  Send,
} from "lucide-react";
import { Link } from "react-router-dom";
import { siteContent } from "../../content/siteContent";
import { ImagePlaceholder } from "../../components/ui/ImagePlaceholder";

export function Contact() {
  const whatsappLink = `https://wa.me/55${siteContent.contact.whatsapp}`;
  const emailLink = `mailto:${siteContent.contact.email}`;

  return (
    <main className="w-full">
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-14 md:grid-cols-[1fr_0.9fr] md:items-center md:px-8 md:py-20">
        <div>
          <span className="mb-5 inline-flex rounded-full bg-[#E84545]/10 px-4 py-2 text-sm font-semibold text-[#E84545]">
            Contato
          </span>

          <h1 className="text-4xl font-bold text-[#3E8E91] md:text-5xl">
            {siteContent.contactPage.title}
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-[#333333]/75">
            {siteContent.contactPage.description}
          </p>

          <p className="mt-4 max-w-3xl leading-8 text-[#333333]/65">
            {siteContent.contactPage.subtitle}
          </p>

          <div className="mt-8 grid gap-4">
            <ContactCard
              icon={<MessageCircle size={28} />}
              title="WhatsApp"
              text={siteContent.contact.whatsapp}
              link={whatsappLink}
              linkText="Falar pelo WhatsApp"
              highlight
            />

            <ContactCard
              icon={<Mail size={28} />}
              title="E-mail"
              text={siteContent.contact.email}
              link={emailLink}
              linkText="Enviar e-mail"
            />

            <ContactCard
              icon={<AtSign size={28} />}
              title="Instagram"
              text="Acompanhe conteúdos e orientações."
              link={siteContent.contact.instagram}
              linkText="Acessar Instagram"
            />
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md md:max-w-none">
          <div className="absolute -left-5 top-8 h-full w-full rounded-[2.5rem] bg-[#3E8E91]/15" />
          <div className="absolute -right-4 -top-4 h-28 w-28 rounded-full bg-[#E84545]/15 blur-sm" />
          <div className="absolute -bottom-4 left-8 h-24 w-24 rounded-full bg-[#3E8E91]/10 blur-md" />

          <div className="relative rounded-[2.5rem] bg-white p-4 shadow-xl shadow-[#3E8E91]/10">
            {siteContent.contactPage.image ? (
              <img
                src={siteContent.contactPage.image}
                alt="Espaço de atendimento"
                className="aspect-[4/5] w-full rounded-[2rem] object-cover"
              />
            ) : (
              <ImagePlaceholder
                title="Imagem do espaço"
                description="ADICIONE A IMAGEM AQUI: use uma foto do local de atendimento ou da profissional."
              />
            )}

            <div className="absolute left-7 top-7 rounded-full bg-white/90 px-4 py-2 shadow-sm backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#3E8E91]">
                Espaço de atendimento
              </p>
            </div>

            <div className="absolute -bottom-6 right-6 max-w-[250px] rounded-3xl bg-white p-5 shadow-lg shadow-[#333333]/10">
              <div className="flex items-start gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#E84545]/10 text-[#E84545]">
                  <MapPin size={22} />
                </span>

                <div>
                  <p className="text-sm font-bold text-[#333333]">
                    {siteContent.contact.locationShort}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#333333]/65">
                    Atendimento presencial em ambiente acolhedor.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8">
        <div className="grid gap-6 rounded-[2rem] bg-white p-6 shadow-sm md:grid-cols-[1fr_0.85fr] md:p-8">
          <div>
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3E8E91]/10 text-[#3E8E91]">
              <MapPin size={28} />
            </span>

            <h2 className="mt-5 text-3xl font-bold text-[#333333]">
              Atendimento presencial
            </h2>

            <p className="mt-4 leading-8 text-[#333333]/70">
              O atendimento acontece presencialmente no endereço informado pela
              profissional. Após enviar sua solicitação pelo site, acompanhe o
              status do agendamento e fale com Ivina pelo WhatsApp quando
              necessário.
            </p>
          </div>

          <div className="rounded-3xl bg-[#F7F3EA] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3E8E91]">
              Local de atendimento
            </p>

            <h3 className="mt-3 text-2xl font-bold text-[#333333]">
              {siteContent.contact.locationShort}
            </h3>

            <p className="mt-3 leading-7 text-[#333333]/70">
              {siteContent.contact.address}
            </p>

            <div className="mt-5 rounded-2xl bg-white p-4 text-sm leading-6 text-[#333333]/65">
              O endereço completo, ponto de referência e demais orientações são confirmados diretamente com a profissional após o contato ou solicitação de agendamento.
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          <InfoBox
            title="Para dúvidas rápidas"
            text="Use o WhatsApp para perguntas objetivas, confirmação de informações e contato direto."
          />

          <InfoBox
            title="Para feedbacks"
            text="Use o e-mail para enviar relatos, feedbacks ou mensagens mais detalhadas sobre o atendimento."
          />

          <InfoBox
            title="Para agendar"
            text="Use o botão de agendamento do site para escolher data e horário disponíveis."
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8">
        <div className="rounded-[2rem] bg-[#3E8E91] p-8 shadow-sm md:flex md:items-center md:justify-between md:gap-8">
          <div>
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white">
              <Send size={28} />
            </span>

            <h2 className="mt-5 text-3xl font-bold text-white">
              Pronta para marcar uma avaliação?
            </h2>

            <p className="mt-3 max-w-2xl leading-7 text-white/80">
              Acesse o calendário, escolha uma data disponível e envie sua
              solicitação de agendamento para acompanhamento da profissional.
            </p>
          </div>

          <Link
            to="/agendar"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-[#3E8E91] transition hover:brightness-95 md:mt-0"
          >
            <CalendarDays size={19} />
            Marcar avaliação
          </Link>
        </div>
      </section>
    </main>
  );
}

type ContactCardProps = {
  icon: ReactNode;
  title: string;
  text: string;
  link?: string;
  linkText?: string;
  highlight?: boolean;
};

function ContactCard({
  icon,
  title,
  text,
  link,
  linkText,
  highlight = false,
}: ContactCardProps) {
  return (
    <article
      className={`rounded-3xl p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
        highlight
          ? "border border-[#E84545]/20 bg-[#E84545]/5"
          : "bg-white"
      }`}
    >
      <div className="flex gap-4">
        <span
          className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
            highlight
              ? "bg-[#E84545]/10 text-[#E84545]"
              : "bg-[#3E8E91]/10 text-[#3E8E91]"
          }`}
        >
          {icon}
        </span>

        <div>
          <h2 className="text-lg font-bold text-[#333333]">{title}</h2>

          <p className="mt-1 font-semibold text-[#333333]/80">{text}</p>

          {link && (
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className={`mt-3 inline-flex font-semibold hover:underline ${
                highlight ? "text-[#E84545]" : "text-[#3E8E91]"
              }`}
            >
              {linkText}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

type InfoBoxProps = {
  title: string;
  text: string;
};

function InfoBox({ title, text }: InfoBoxProps) {
  return (
    <article className="rounded-3xl bg-white p-6 shadow-sm">
      <h3 className="text-xl font-bold text-[#333333]">{title}</h3>

      <p className="mt-3 leading-7 text-[#333333]/70">{text}</p>
    </article>
  );
}