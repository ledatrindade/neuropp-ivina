import type { ReactNode } from "react";
import {
  ArrowRight,
  Brain,
  ClipboardCheck,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { siteContent } from "../../content/siteContent";

export function Assessment() {
  return (
    <main className="w-full">
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
        <span className="mb-5 inline-flex rounded-full bg-[#E84545]/10 px-4 py-2 text-sm font-semibold text-[#E84545]">
          Processo avaliativo
        </span>

        <div className="grid gap-8 md:grid-cols-[1fr_0.85fr] md:items-start">
          <div>
            <h1 className="text-4xl font-bold text-[#3E8E91] md:text-5xl">
              {siteContent.assessment.title}
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#333333]/75">
              {siteContent.assessment.description}
            </p>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <Brain className="text-[#E84545]" size={38} />

            <h2 className="mt-4 text-2xl font-bold text-[#333333]">
              Avaliação não é rótulo
            </h2>

            <p className="mt-3 leading-7 text-[#333333]/70">
              O objetivo é compreender caminhos de aprendizagem e orientar a
              família. Quando necessário, outros profissionais também podem
              compor esse cuidado.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <h2 className="text-3xl font-bold text-[#333333]">
            Etapas da avaliação
          </h2>

          <p className="mt-3 max-w-3xl leading-8 text-[#333333]/70">
            O processo é organizado em etapas para que a família compreenda o
            que está sendo observado e quais caminhos podem ser indicados.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {siteContent.assessment.steps.map((step, index) => (
              <article
                key={step.title}
                className="rounded-3xl border border-[#3E8E91]/10 bg-[#F7F3EA] p-6"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#E84545] font-bold text-white">
                  {index + 1}
                </span>

                <h3 className="mt-4 text-xl font-bold text-[#333333]">
                  {step.title}
                </h3>

                <p className="mt-3 leading-7 text-[#333333]/70">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          <MiniCard
            icon={<ClipboardCheck size={30} />}
            title="Organização"
            text="O processo ajuda a reunir informações importantes sobre aprendizagem, rotina e escola."
          />

          <MiniCard
            icon={<MessageCircle size={30} />}
            title="Devolutiva"
            text="A família recebe orientações para compreender melhor os próximos passos."
          />

          <MiniCard
            icon={<ArrowRight size={30} />}
            title="Encaminhamentos"
            text="Quando necessário, podem ser indicados retornos, acompanhamento ou diálogo com a escola."
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8">
        <div className="rounded-[2rem] bg-[#3E8E91] p-8 shadow-sm md:flex md:items-center md:justify-between md:gap-8">
          <div>
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white">
              <Sparkles size={28} />
            </div>

            <h2 className="mt-5 text-3xl font-bold text-white">
              Deseja iniciar uma avaliação?
            </h2>

            <p className="mt-3 max-w-2xl leading-7 text-white/80">
              Veja os horários disponíveis e envie sua solicitação de
              agendamento de forma simples e organizada.
            </p>
          </div>

          <Link
            to="/agendar"
            className="mt-6 inline-flex w-fit rounded-full bg-white px-6 py-3 font-semibold text-[#3E8E91] transition hover:brightness-95 md:mt-0"
          >
            Marcar avaliação
          </Link>
        </div>
      </section>
    </main>
  );
}

type MiniCardProps = {
  icon: ReactNode;
  title: string;
  text: string;
};

function MiniCard({ icon, title, text }: MiniCardProps) {
  return (
    <article className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E84545]/10 text-[#E84545]">
        {icon}
      </div>

      <h3 className="mt-4 text-xl font-bold text-[#333333]">{title}</h3>

      <p className="mt-3 leading-7 text-[#333333]/70">{text}</p>
    </article>
  );
}