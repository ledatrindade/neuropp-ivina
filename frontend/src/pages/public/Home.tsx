import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Brain,
  CalendarDays,
  CheckCircle,
  HeartHandshake,
  Sparkles,
} from "lucide-react";
import { siteContent } from "../../content/siteContent";
import { ImagePlaceholder } from "../../components/ui/ImagePlaceholder";

export function Home() {
  return (
    <main className="w-full">
      <section className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-14 md:grid-cols-[1fr_0.9fr] md:items-center md:px-8 md:py-20">
        <div>
          <span className="mb-5 inline-flex rounded-full bg-[#E84545]/10 px-4 py-2 text-sm font-semibold text-[#E84545]">
            {siteContent.home.badge}
          </span>

          <h1 className="max-w-3xl text-4xl font-bold leading-tight text-[#333333] md:text-6xl">
            {siteContent.home.title}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#333333]/75">
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

        <div className="rounded-[2rem] bg-white p-5 shadow-sm">
          {siteContent.home.heroImage ? (
            <img
              src={siteContent.home.heroImage}
              alt="Ivina Peixoto"
              className="aspect-[4/5] w-full rounded-[1.75rem] object-cover"
            />
          ) : (
            <ImagePlaceholder
              title="Foto profissional da Ivina"
              description="Coloque a imagem em public/images e informe o caminho no arquivo siteContent.ts."
            />
          )}
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-8 max-w-3xl">
            <h2 className="text-3xl font-bold text-[#333333]">
              Como a avaliação pode ajudar?
            </h2>

            <p className="mt-3 leading-8 text-[#333333]/70">
              O processo ajuda a família a entender melhor o desenvolvimento da
              criança e a organizar caminhos possíveis para apoiar a
              aprendizagem.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <FeatureCard
              icon={<Brain size={34} />}
              title={siteContent.home.cards[0].title}
              description={siteContent.home.cards[0].description}
            />

            <FeatureCard
              icon={<HeartHandshake size={34} />}
              title={siteContent.home.cards[1].title}
              description={siteContent.home.cards[1].description}
            />

            <FeatureCard
              icon={<CalendarDays size={34} />}
              title={siteContent.home.cards[2].title}
              description={siteContent.home.cards[2].description}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="grid gap-8 rounded-[2rem] bg-white p-6 shadow-sm md:grid-cols-[0.85fr_1.15fr] md:p-8">
          <div>
            <Sparkles className="text-[#E84545]" size={38} />

            <h2 className="mt-5 text-3xl font-bold text-[#333333]">
              Um processo pensado para acolher família e criança
            </h2>

            <p className="mt-4 leading-8 text-[#333333]/70">
              A avaliação não é apenas uma etapa técnica. Ela envolve escuta,
              observação, organização das informações e devolutiva responsável,
              sempre respeitando o tempo e a singularidade da criança.
            </p>
          </div>

          <div className="grid gap-3">
            {siteContent.home.careList.map((item, index) => (
              <div
                key={item}
                className="flex items-start gap-4 rounded-3xl bg-[#F7F3EA] p-5"
              >
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E84545] text-sm font-bold text-white">
                  {index + 1}
                </span>

                <div>
                  <p className="font-bold text-[#333333]">{item}</p>
                  <p className="mt-1 text-sm leading-6 text-[#333333]/65">
                    Cada etapa contribui para uma compreensão mais cuidadosa do
                    processo de aprendizagem.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

type FeatureCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
};

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <article className="group rounded-3xl border border-[#E84545]/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#E84545]/30 hover:shadow-md">
      <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E84545]/10 text-[#E84545] transition group-hover:bg-[#E84545] group-hover:text-white">
        {icon}
      </div>

      <h3 className="mt-5 text-xl font-bold text-[#333333]">{title}</h3>

      <p className="mt-3 leading-7 text-[#333333]/70">{description}</p>

      <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#E84545]">
        <CheckCircle size={17} />
        Atendimento com cuidado e orientação
      </div>
    </article>
  );
}