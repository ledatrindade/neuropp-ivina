import { useEffect, useMemo, useState } from "react";
import { CalendarCheck, CalendarDays, FileText, PlusCircle, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { FeedbackMessage } from "../../components/ui/FeedbackMessage";
import { apiRequest, getErrorMessage } from "../../services/api";
import { getAuthUser } from "../../services/authStorage";
import type { AppointmentResponse } from "../../types/appointment";
import type { PageResponse } from "../../types/api";
import type { AttendanceDocumentSummary } from "../../types/document";
import { appointmentStatusClasses, appointmentStatusLabels } from "../../utils/appointmentStatus";
import { formatDateBR, formatTimeBR } from "../../utils/formatters";

export function ResponsibleDashboard() {
  const user = getAuthUser();
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [documents, setDocuments] = useState<AttendanceDocumentSummary[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    void Promise.all([
      apiRequest<PageResponse<AppointmentResponse>>("/appointments/my", { auth: true, query: { page: 0, size: 50 } }),
      apiRequest<PageResponse<AttendanceDocumentSummary>>("/documents/my", { auth: true, query: { page: 0, size: 5 } }),
    ]).then(([appointmentPage, documentPage]) => {
      setAppointments(appointmentPage.content);
      setDocuments(documentPage.content);
    }).catch((error) => setErrorMessage(getErrorMessage(error, "Não foi possível atualizar o resumo da sua área.")));
  }, []);

  const nextAppointment = useMemo(() => appointments
    .filter((item) => ["PENDING", "CONFIRMED", "RESCHEDULED"].includes(item.status))
    .sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`))[0], [appointments]);
  const activeCount = appointments.filter((item) => ["PENDING", "CONFIRMED", "RESCHEDULED"].includes(item.status)).length;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8 md:py-10">
      {errorMessage && <div className="mb-6"><FeedbackMessage type="error">{errorMessage}</FeedbackMessage></div>}
      <section className="relative overflow-hidden rounded-[2.25rem] bg-[#3E8E91] p-8 text-white shadow-sm md:p-10">
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10" />
        <div className="relative"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">Área do responsável</p><h1 className="mt-3 text-4xl font-bold">Olá, {user?.name || "responsável"}</h1><p className="mt-4 max-w-3xl text-lg leading-8 text-white/80">Acompanhe agendamentos, documentos e próximos passos em um só lugar.</p></div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat icon={CalendarDays} label="Agendamentos ativos" value={String(activeCount)} />
        <Stat icon={FileText} label="Documentos liberados" value={String(documents.length)} />
        <Stat icon={Sparkles} label="Próximo passo" value={nextAppointment ? "Acompanhar" : "Agendar"} />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
          <p className="eyebrow">Próximo atendimento</p>
          {nextAppointment ? <div className="mt-5"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><h2 className="text-2xl font-bold text-[#333333]">{nextAppointment.childName}</h2><p className="mt-2 text-[#333333]/65">{formatDateBR(nextAppointment.date)} • {formatTimeBR(nextAppointment.startTime)} às {formatTimeBR(nextAppointment.endTime)}</p></div><span className={`w-fit rounded-full px-4 py-2 text-sm font-bold ${appointmentStatusClasses[nextAppointment.status]}`}>{appointmentStatusLabels[nextAppointment.status]}</span></div><Link to="/responsavel/agendamentos" className="secondary-button mt-6">Ver detalhes</Link></div> : <div className="mt-5 rounded-3xl bg-[#F7F3EA] p-6"><CalendarCheck className="text-[#3E8E91]" size={32} /><h2 className="mt-3 text-xl font-bold">Nenhum atendimento ativo</h2><p className="mt-2 text-[#333333]/65">Escolha uma data disponível para iniciar uma solicitação.</p><Link to="/agendar" className="primary-button mt-5"><PlusCircle size={18} />Marcar avaliação</Link></div>}
        </div>
        <div className="rounded-[2rem] bg-white p-6 shadow-sm md:p-8"><p className="eyebrow">Documentos recentes</p>{documents.length === 0 ? <p className="mt-5 rounded-3xl bg-[#F7F3EA] p-5 text-[#333333]/65">Nenhum documento liberado até o momento.</p> : <div className="mt-5 grid gap-3">{documents.slice(0, 3).map((document) => <div key={document.id} className="rounded-2xl bg-[#F7F3EA] p-4"><p className="font-bold text-[#333333]">{document.title}</p><p className="mt-1 text-sm text-[#333333]/55">{document.childName}</p></div>)}</div>}<Link to="/responsavel/documentos" className="secondary-button mt-5">Abrir documentos</Link></div>
      </section>

      <section className="mt-6 grid gap-5 md:grid-cols-3">
        <Action to="/responsavel/agendamentos" icon={CalendarDays} title="Meus agendamentos" text="Veja status, remarcações e cancelamentos." />
        <Action to="/responsavel/documentos" icon={FileText} title="Documentos" text="Acesse registros liberados pela profissional." />
        <Action to="/agendar" icon={PlusCircle} title="Nova avaliação" text="Escolha uma data e horário disponíveis." />
      </section>
    </main>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof CalendarDays; label: string; value: string }) { return <div className="rounded-3xl bg-white p-5 shadow-sm"><Icon className="text-[#E84545]" size={26} /><p className="mt-4 text-3xl font-bold text-[#333333]">{value}</p><p className="mt-1 text-sm text-[#333333]/60">{label}</p></div>; }
function Action({ to, icon: Icon, title, text }: { to: string; icon: typeof CalendarDays; title: string; text: string }) { return <Link to={to} className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"><Icon className="text-[#3E8E91]" size={34} /><h2 className="mt-4 text-xl font-bold">{title}</h2><p className="mt-3 leading-7 text-[#333333]/65">{text}</p></Link>; }
