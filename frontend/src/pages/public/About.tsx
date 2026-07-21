import type { ReactNode } from "react";
import { CheckCircle, HeartHandshake, Leaf, Sparkles } from "lucide-react";
import { siteContent } from "../../content/siteContent";
import { ImagePlaceholder } from "../../components/ui/ImagePlaceholder";

export function About() {
  return (
    <main className="w-full">
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-14 md:grid-cols-[0.95fr_1.05fr] md:items-center md:px-8 md:py-20">
        <div className="order-2 md:order-1">
          <div className="relative mx-auto max-w-md md:max-w-none">
            <div className="absolute -left-4 top-6 h-full w-full rounded-[2.5rem] bg-[#3E8E91]/15" />
            <div className="absolute -right-3 -top-3 h-28 w-28 rounded-full bg-[#E84545]/15 blur-sm" />

            <div className="relative rounded-[2.5rem] bg-white p-4 shadow-xl shadow-[#3E8E91]/10">
              {siteContent.about.image ? (
                <img
                  src={siteContent.about.image}
                  alt="Ivina Peixoto"
                  className="aspect-[4/5] w-full rounded-[2rem] object-cover"
                />
              ) : (
                <ImagePlaceholder
                  title="Foto da profissional"
                  description="ADICIONE A IMAGEM AQUI: use uma imagem da Ivina ou do espaço de atendimento."
                />
              )}
            </div>

            <div className="absolute -bottom-5 right-6 rounded-3xl bg-white px-5 py-4 shadow-lg shadow-[#333333]/10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E84545]">
                NeuroPP
              </p>

              <p className="mt-1 font-bold text-[#333333]">
                Cuidado com propósito
              </p>
            </div>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <span className="mb-5 inline-flex rounded-full bg-[#E84545]/10 px-4 py-2 text-sm font-semibold text-[#E84545]">
            Quem é a profissional
          </span>

          <h1 className="text-4xl font-bold text-[#3E8E91] md:text-5xl">
            {siteContent.about.title}
          </h1>

          <p className="mt-5 text-lg leading-8 text-[#333333]/75">
            {siteContent.about.description}
          </p>

          <p className="mt-4 text-lg leading-8 text-[#333333]/75">
            {siteContent.about.secondText}
          </p>

          <div className="mt-8 grid gap-3">
            {siteContent.about.highlights.map((highlight) => (
              <div
                key={highlight}
                className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm"
              >
                <CheckCircle className="text-[#3E8E91]" size={22} />
                <p className="font-semibold text-[#333333]">{highlight}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8">
        <div className="rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
          <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-center">
            <div>
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3E8E91]/10 text-[#3E8E91]">
                <HeartHandshake size={32} />
              </span>

              <h2 className="mt-5 text-3xl font-bold text-[#333333]">
                Um olhar cuidadoso para a aprendizagem
              </h2>

              <p className="mt-4 leading-8 text-[#333333]/70">
                A proposta do atendimento é compreender as necessidades da
                criança sem reduzir sua história a dificuldades. O processo
                busca orientar a família com clareza, sensibilidade e
                responsabilidade.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <AboutValueCard
                icon={<Sparkles size={26} />}
                title="Acolhimento"
                text="A escuta da família faz parte do processo de compreensão da criança."
              />

              <AboutValueCard
                icon={<Leaf size={26} />}
                title="Cuidado"
                text="Cada orientação considera o ritmo, a história e o contexto da criança."
              />

              <AboutValueCard
                icon={<CheckCircle size={26} />}
                title="Clareza"
                text="A devolutiva busca organizar informações de forma simples e útil."
              />

              <AboutValueCard
                icon={<HeartHandshake size={26} />}
                title="Parceria"
                text="Família, escola e profissional caminham melhor quando estão alinhados."
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

type AboutValueCardProps = {
  icon: ReactNode;
  title: string;
  text: string;
};

function AboutValueCard({ icon, title, text }: AboutValueCardProps) {
  return (
    <article className="rounded-3xl bg-[#F7F3EA] p-5">
      <div className="text-[#E84545]">{icon}</div>

      <h3 className="mt-3 font-bold text-[#333333]">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-[#333333]/70">{text}</p>
    </article>
  );
}