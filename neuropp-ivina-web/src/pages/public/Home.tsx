import { Link } from "react-router";
import { ArrowRight, Brain, CalendarDays, HeartHandshake } from "lucide-react";
import { siteContent } from "../../content/siteContent";

export function Home() {
  return (
    <main>
      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:items-center">
        <div>
          {/* MUDE O TEXTO AQUI: altere em siteContent.ts */}
          <span className="mb-4 inline-flex rounded-full bg-[#3E8E91]/10 px-4 py-2 text-sm font-semibold text-[#3E8E91]">
            {siteContent.home.badge}
          </span>

          {/* MUDE O TEXTO AQUI: altere em siteContent.ts */}
          <h1 className="text-4xl font-bold leading-tight text-[#333333] md:text-5xl">
            {siteContent.home.title}
          </h1>

          {/* MUDE O TEXTO AQUI: altere em siteContent.ts */}
          <p className="mt-5 text-lg leading-8 text-[#333333]/75">
            {siteContent.home.description}
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
          {siteContent.home.heroImage ? (
            /*
             * ADICIONE A IMAGEM AQUI:
             * A imagem vem de siteContent.home.heroImage.
             */
            <img
              src={siteContent.home.heroImage}
              alt="Ivina Peixoto em seu espaço de atendimento"
              className="aspect-[4/5] w-full rounded-[1.5rem] object-cover"
            />
          ) : (
            /*
             * ADICIONE A IMAGEM AQUI:
             * Enquanto não houver imagem, este bloco aparece como placeholder.
             */
            <div className="flex aspect-[4/5] items-center justify-center rounded-[1.5rem] bg-[#3E8E91]/10 text-center">
              <div className="px-8">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3E8E91]">
                  ADICIONE A IMAGEM AQUI
                </p>
                <p className="mt-4 text-2xl font-bold text-[#333333]">
                  Foto profissional da Ivina
                </p>
                <p className="mt-3 text-sm leading-6 text-[#333333]/70">
                  Coloque a imagem em public/images e informe o caminho no
                  arquivo siteContent.ts.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto grid max-w-6xl gap-5 px-5 md:grid-cols-3">
          <article className="rounded-3xl border border-[#3E8E91]/10 bg-[#F7F3EA] p-6">
            <Brain className="text-[#3E8E91]" size={32} />
            <h2 className="mt-4 text-xl font-bold text-[#333333]">
              {siteContent.home.cards[0].title}
            </h2>
            <p className="mt-3 leading-7 text-[#333333]/70">
              {siteContent.home.cards[0].description}
            </p>
          </article>

          <article className="rounded-3xl border border-[#3E8E91]/10 bg-[#F7F3EA] p-6">
            <HeartHandshake className="text-[#3E8E91]" size={32} />
            <h2 className="mt-4 text-xl font-bold text-[#333333]">
              {siteContent.home.cards[1].title}
            </h2>
            <p className="mt-3 leading-7 text-[#333333]/70">
              {siteContent.home.cards[1].description}
            </p>
          </article>

          <article className="rounded-3xl border border-[#3E8E91]/10 bg-[#F7F3EA] p-6">
            <CalendarDays className="text-[#3E8E91]" size={32} />
            <h2 className="mt-4 text-xl font-bold text-[#333333]">
              {siteContent.home.cards[2].title}
            </h2>
            <p className="mt-3 leading-7 text-[#333333]/70">
              {siteContent.home.cards[2].description}
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}