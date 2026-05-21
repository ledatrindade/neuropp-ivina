import { Link } from "react-router";
import { CalendarDays, ClipboardList, FileText } from "lucide-react";
import { getAuthUser } from "../../services/authStorage";

/*
 * Dashboard inicial da administradora.
 *
 * ADICIONE NOVOS CARDS AQUI:
 * Conforme o sistema crescer, podemos adicionar cards para relatórios,
 * documentos, feedbacks e configurações.
 */

export function AdminDashboard() {
  const authUser = getAuthUser();

  return (
    <main className="mx-auto max-w-6xl px-5 py-12">
      <section className="rounded-[2rem] bg-white p-8 shadow-sm">
        <span className="mb-4 inline-flex rounded-full bg-[#3E8E91]/10 px-4 py-2 text-sm font-semibold text-[#3E8E91]">
          Painel administrativo
        </span>

        <h1 className="text-4xl font-bold text-[#3E8E91]">
          Olá, {authUser?.name || "Ivina"}
        </h1>

        <p className="mt-4 max-w-3xl text-lg leading-8 text-[#333333]/75">
          Aqui você poderá organizar horários disponíveis, acompanhar
          agendamentos e gerenciar informações importantes dos atendimentos.
        </p>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-3">
        <Link
          to="/admin/horarios"
          className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <CalendarDays className="text-[#3E8E91]" size={34} />

          <h2 className="mt-4 text-xl font-bold text-[#333333]">
            Gerenciar horários
          </h2>

          <p className="mt-3 leading-7 text-[#333333]/70">
            Cadastre dias e horários disponíveis para que responsáveis possam
            agendar avaliações.
          </p>
        </Link>

        <div className="rounded-3xl bg-white p-6 opacity-70 shadow-sm">
          <ClipboardList className="text-[#3E8E91]" size={34} />

          <h2 className="mt-4 text-xl font-bold text-[#333333]">
            Agendamentos
          </h2>

          <p className="mt-3 leading-7 text-[#333333]/70">
            Em breve: acompanhamento dos agendamentos, presença, falta e
            conclusão.
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6 opacity-70 shadow-sm">
          <FileText className="text-[#3E8E91]" size={34} />

          <h2 className="mt-4 text-xl font-bold text-[#333333]">
            Documentos
          </h2>

          <p className="mt-3 leading-7 text-[#333333]/70">
            Em breve: criação e liberação de documentos privados para
            responsáveis.
          </p>
        </div>
      </section>
    </main>
  );
}