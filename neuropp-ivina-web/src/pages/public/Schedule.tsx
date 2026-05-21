import { siteContent } from "../../content/siteContent";

export function Schedule() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-16">
      {/* MUDE O TEXTO AQUI: altere em siteContent.ts */}
      <h1 className="text-4xl font-bold text-[#3E8E91]">
        {siteContent.schedule.title}
      </h1>

      {/* MUDE O TEXTO AQUI: altere em siteContent.ts */}
      <p className="mt-5 text-lg leading-8 text-[#333333]/75">
        {siteContent.schedule.description}
      </p>

      <section className="mt-10 rounded-3xl border border-dashed border-[#3E8E91]/40 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3E8E91]">
          CALENDÁRIO ENTRA AQUI
        </p>

        <h2 className="mt-4 text-2xl font-bold text-[#333333]">
          ADICIONE O CALENDÁRIO AQUI
        </h2>

        <p className="mx-auto mt-3 max-w-2xl leading-7 text-[#333333]/70">
          Na próxima sprint, esta área será conectada com a API para listar
          os horários disponíveis.
        </p>

        {/* MUDE O TEXTO AQUI: altere em siteContent.ts */}
        <p className="mt-6 rounded-2xl bg-[#F7F3EA] p-4 text-sm text-[#333333]/70">
          {siteContent.schedule.notice}
        </p>
      </section>
    </main>
  );
}