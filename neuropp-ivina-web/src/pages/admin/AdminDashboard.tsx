import { Link } from "react-router";
import { CalendarDays, ClipboardList, FileText } from "lucide-react";
import { getAuthUser } from "../../services/authStorage";

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
          Organize horários disponíveis, acompanhe agendamentos e gerencie
          documentos privados liberados para os responsáveis.
        </p>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-3">
        <Link
          to="/admin/horarios"
          className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <CalendarDays className="text-[#3E8E91]" size={34} />

          <h2 className="mt-4 text-xl font-bold text-[#333333]">
            Horários
          </h2>

          <p className="mt-3 leading-7 text-[#333333]/70">
            Cadastre, bloqueie e organize os horários disponíveis para
            agendamento.
          </p>
        </Link>

        <Link
          to="/admin/agendamentos"
          className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <ClipboardList className="text-[#3E8E91]" size={34} />

          <h2 className="mt-4 text-xl font-bold text-[#333333]">
            Agendamentos
          </h2>

          <p className="mt-3 leading-7 text-[#333333]/70">
            Veja avaliações marcadas, filtre por status e atualize o andamento
            dos atendimentos.
          </p>
        </Link>

        <Link
          to="/admin/documentos"
          className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <FileText className="text-[#3E8E91]" size={34} />

          <h2 className="mt-4 text-xl font-bold text-[#333333]">
            Documentos
          </h2>

          <p className="mt-3 leading-7 text-[#333333]/70">
            Crie documentos privados e libere o acesso para responsáveis.
          </p>
        </Link>
      </section>
    </main>
  );
}