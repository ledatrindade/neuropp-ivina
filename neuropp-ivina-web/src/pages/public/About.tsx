import { siteContent } from "../../content/siteContent";

export function About() {
  return (
    <main className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:items-center">
      <section>
        {/* MUDE O TEXTO AQUI: altere em siteContent.ts */}
        <h1 className="text-4xl font-bold text-[#3E8E91]">
          {siteContent.about.title}
        </h1>

        {/* MUDE O TEXTO AQUI: altere em siteContent.ts */}
        <p className="mt-5 text-lg leading-8 text-[#333333]/75">
          {siteContent.about.description}
        </p>
      </section>

      <section className="rounded-[2rem] bg-white p-6 shadow-sm">
        {siteContent.about.image ? (
          /*
           * ADICIONE A IMAGEM AQUI:
           * A imagem vem de siteContent.about.image.
           */
          <img
            src={siteContent.about.image}
            alt="Ivina Peixoto"
            className="aspect-[4/5] w-full rounded-[1.5rem] object-cover"
          />
        ) : (
          /*
           * ADICIONE A IMAGEM AQUI:
           * Placeholder temporário.
           */
          <div className="flex aspect-[4/5] items-center justify-center rounded-[1.5rem] bg-[#3E8E91]/10 text-center">
            <div className="px-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3E8E91]">
                ADICIONE A IMAGEM AQUI
              </p>
              <p className="mt-4 text-2xl font-bold text-[#333333]">
                Foto da profissional
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}