import { Link } from "react-router";
import { CalendarDays, FileText, UserRound } from "lucide-react";
import { getAuthUser } from "../../services/authStorage";

/*
 * Página inicial da área do responsável.
 */

export function ResponsibleDashboard() {
  const user = getAuthUser();

  return (
    <main className="mx-auto max-w-6xl px-5 py-12">
      <section className="rounded-[2rem] bg-white p-8 shadow-sm">
        <span className="mb-4 inline-flex rounded-full bg-[#3E8E91]/10 px-4 py-2 text-sm font-semibold text-[#3E8E91]">
          Área do responsável
        </span>

        <h1 className="text-4xl font-bold text-[#3E8E91]">
          Olá, {user?.name || "responsável"}
        </h1>

        <p className="mt-4 max-w-3xl text-lg leading-8 text-[#333333]/75">
          Aqui você poderá acompanhar seus agendamentos, visualizar documentos
          liberados pela profissional e consultar informações importantes sobre
          os atendimentos.
        </p>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-3">
        <Link
          to="/responsavel/agendamentos"
          className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <CalendarDays className="text-[#3E8E91]" size={34} />

          <h2 className="mt-4 text-xl font-bold text-[#333333]">
            Meus agendamentos
          </h2>

          <p className="mt-3 leading-7 text-[#333333]/70">
            Veja seus horários marcados, status do atendimento e opções de
            acompanhamento.
          </p>
        </Link>

        <Link
          to="/responsavel/documentos"
          className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <FileText className="text-[#3E8E91]" size={34} />

          <h2 className="mt-4 text-xl font-bold text-[#333333]">
            Documentos liberados
          </h2>

          <p className="mt-3 leading-7 text-[#333333]/70">
            Acesse documentos privados liberados pela profissional após avaliação
            ou sessão.
          </p>
        </Link>

        <Link
          to="/agendar"
          className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <UserRound className="text-[#3E8E91]" size={34} />

          <h2 className="mt-4 text-xl font-bold text-[#333333]">
            Marcar nova avaliação
          </h2>

          <p className="mt-3 leading-7 text-[#333333]/70">
            Escolha uma data disponível e realize um novo agendamento.
          </p>
        </Link>
      </section>
    </main>
  );
}