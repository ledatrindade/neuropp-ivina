import { siteContent } from "../../content/siteContent";

export function Assessment() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-16">
      {/* MUDE O TEXTO AQUI: altere em siteContent.ts */}
      <h1 className="text-4xl font-bold text-[#3E8E91]">
        {siteContent.assessment.title}
      </h1>

      {/* MUDE O TEXTO AQUI: altere em siteContent.ts */}
      <p className="mt-5 text-lg leading-8 text-[#333333]/75">
        {siteContent.assessment.description}
      </p>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        {siteContent.assessment.steps.map((step, index) => (
          <article
            key={step}
            className="rounded-3xl border border-[#3E8E91]/10 bg-white p-6 shadow-sm"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#E84545] font-bold text-white">
              {index + 1}
            </span>

            {/* MUDE O TEXTO AQUI: altere os steps em siteContent.ts */}
            <p className="mt-4 font-semibold text-[#333333]">{step}</p>
          </article>
        ))}
      </section>
    </main>
  );
}