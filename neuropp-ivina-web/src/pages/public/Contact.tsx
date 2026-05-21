import { siteContent } from "../../content/siteContent";

export function Contact() {
  const whatsappLink = `https://wa.me/55${siteContent.contact.whatsapp}`;

  return (
    <main className="mx-auto max-w-4xl px-5 py-16">
      <h1 className="text-4xl font-bold text-[#3E8E91]">Contato</h1>

      <div className="mt-8 grid gap-5">
        <article className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#333333]">WhatsApp</h2>

          {/* MUDE O TEXTO AQUI: número em siteContent.ts */}
          <p className="mt-2 text-[#333333]/70">
            {siteContent.contact.whatsapp}
          </p>

          {/* MUDE O LINK AQUI: gerado pelo número do WhatsApp em siteContent.ts */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex rounded-full bg-[#E84545] px-5 py-3 font-semibold text-white transition hover:brightness-95"
          >
            Falar pelo WhatsApp
          </a>
        </article>

        <article className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#333333]">Endereço</h2>

          {/* MUDE O TEXTO AQUI: endereço em siteContent.ts */}
          <p className="mt-2 text-[#333333]/70">
            {siteContent.contact.address}
          </p>
        </article>

        <article className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#333333]">Instagram</h2>

          {/* MUDE O LINK AQUI: Instagram em siteContent.ts */}
          <a
            href={siteContent.contact.instagram}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex text-[#3E8E91] hover:underline"
          >
            Acessar Instagram
          </a>
        </article>
      </div>
    </main>
  );
}