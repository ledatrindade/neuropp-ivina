import { Link } from "react-router";
import { CalendarDays, FileText, PlusCircle } from "lucide-react";
import { getAuthUser } from "../../services/authStorage";

/*
 * Tela inicial da área do responsável.
 *
 * O aviso "Área do responsável" fica apenas no menu/header.
 */

export function ResponsibleDashboard() {
  const user = getAuthUser();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8 md:py-10">
      <section className="rounded-[2rem] bg-white p-8 shadow-sm">
        <h1 className="text-4xl font-bold text-[#3E8E91]">
          Olá, {user?.name || "responsável"}
        </h1>

        <p className="mt-4 max-w-3xl text-lg leading-8 text-[#333333]/75">
          Acompanhe seus agendamentos, veja documentos liberados pela
          profissional e marque novas avaliações quando necessário.
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
            Veja seus horários, status dos atendimentos e opções de cancelamento
            ou remarcação.
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
            Acesse documentos privados liberados por Ivina após avaliação,
            sessão ou devolutiva.
          </p>
        </Link>

        <Link
          to="/agendar"
          className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <PlusCircle className="text-[#3E8E91]" size={34} />

          <h2 className="mt-4 text-xl font-bold text-[#333333]">
            Marcar nova avaliação
          </h2>

          <p className="mt-3 leading-7 text-[#333333]/70">
            Escolha uma data disponível no calendário e confirme um novo
            agendamento.
          </p>
        </Link>
      </section>
    </main>
  );
}