import { Link } from "react-router";
import { ArrowRight, Brain, CalendarDays, HeartHandshake } from "lucide-react";

export function Home() {
  return (
    <main>
      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:items-center">
        <div>
          <span className="mb-4 inline-flex rounded-full bg-[#3E8E91]/10 px-4 py-2 text-sm font-semibold text-[#3E8E91]">
            Avaliação neuropsicopedagógica infantil
          </span>

          <h1 className="text-4xl font-bold leading-tight text-[#333333] md:text-5xl">
            Cuidado, escuta e orientação para o desenvolvimento da aprendizagem.
          </h1>

          <p className="mt-5 text-lg leading-8 text-[#333333]/75">
            Um espaço acolhedor para compreender dificuldades de aprendizagem,
            orientar famílias e construir caminhos possíveis para cada criança.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/agendar"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#E84545] px-6 py-3 font-semibold text-white shadow-sm transition hover:brightness-95"
            >
              <CalendarDays size={20} />
              Marcar avaliação
            </Link>

            <Link
              to="/avaliacao"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#3E8E91] px-6 py-3 font-semibold text-[#3E8E91] transition hover:bg-[#3E8E91] hover:text-white"
            >
              Como funciona
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-6 shadow-sm">
          <div className="flex aspect-[4/5] items-center justify-center rounded-[1.5rem] bg-[#3E8E91]/10 text-center">
            <div className="px-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3E8E91]">
                Espaço NeuroPP
              </p>
              <p className="mt-4 text-2xl font-bold text-[#333333]">
                Foto profissional da Ivina aqui
              </p>
              <p className="mt-3 text-sm leading-6 text-[#333333]/70">
                Depois vamos substituir este bloco por uma imagem real da profissional
                ou do espaço de atendimento.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto grid max-w-6xl gap-5 px-5 md:grid-cols-3">
          <article className="rounded-3xl border border-[#3E8E91]/10 bg-[#F7F3EA] p-6">
            <Brain className="text-[#3E8E91]" size={32} />
            <h2 className="mt-4 text-xl font-bold text-[#333333]">
              Entendimento da aprendizagem
            </h2>
            <p className="mt-3 leading-7 text-[#333333]/70">
              A avaliação ajuda a observar aspectos cognitivos, escolares e comportamentais
              relacionados ao processo de aprender.
            </p>
          </article>

          <article className="rounded-3xl border border-[#3E8E91]/10 bg-[#F7F3EA] p-6">
            <HeartHandshake className="text-[#3E8E91]" size={32} />
            <h2 className="mt-4 text-xl font-bold text-[#333333]">
              Acolhimento familiar
            </h2>
            <p className="mt-3 leading-7 text-[#333333]/70">
              O responsável participa do processo, trazendo informações importantes
              sobre a rotina, a escola e as principais dificuldades percebidas.
            </p>
          </article>

          <article className="rounded-3xl border border-[#3E8E91]/10 bg-[#F7F3EA] p-6">
            <CalendarDays className="text-[#3E8E91]" size={32} />
            <h2 className="mt-4 text-xl font-bold text-[#333333]">
              Agendamento online
            </h2>
            <p className="mt-3 leading-7 text-[#333333]/70">
              O responsável poderá escolher um horário disponível e confirmar a avaliação
              de forma simples e organizada.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}