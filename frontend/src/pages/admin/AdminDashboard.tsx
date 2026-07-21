import { useEffect, useMemo, useState } from "react";
import { CalendarClock, CalendarDays, ClipboardList, FileText, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { FeedbackMessage } from "../../components/ui/FeedbackMessage";
import { apiRequest, getErrorMessage } from "../../services/api";
import { getAuthUser } from "../../services/authStorage";
import type { AppointmentResponse } from "../../types/appointment";
import type { PageResponse } from "../../types/api";
import type { AvailabilitySlot } from "../../types/availability";
import type { AttendanceDocumentSummary } from "../../types/document";
import { appointmentStatusClasses, appointmentStatusLabels } from "../../utils/appointmentStatus";
import { formatDateBR, formatTimeBR, todayIso } from "../../utils/formatters";

export function AdminDashboard() {
  const user = getAuthUser();
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [documents, setDocuments] = useState<AttendanceDocumentSummary[]>([]);
  const [todaySlots, setTodaySlots] = useState<AvailabilitySlot[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    void Promise.all([
      apiRequest<PageResponse<AppointmentResponse>>("/admin/appointments", { auth: true, query: { page: 0, size: 100 } }),
      apiRequest<PageResponse<AttendanceDocumentSummary>>("/admin/documents", { auth: true, query: { page: 0, size: 20 } }),
      apiRequest<AvailabilitySlot[]>("/admin/availability", { auth: true, query: { date: todayIso() } }),
    ]).then(([appointmentPage, documentPage, slots]) => {
      setAppointments(appointmentPage.content);
      setDocuments(documentPage.content);
      setTodaySlots(slots);
    }).catch((error) => setErrorMessage(getErrorMessage(error, "Não foi possível atualizar o painel.")));
  }, []);

  const pending = appointments.filter((item) => item.status === "PENDING");
  const todayAppointments = appointments.filter((item) => item.date === todayIso() && item.status !== "CANCELLED");
  const unreleasedDocuments = documents.filter((item) => !item.isReleased);
  const nextAppointments = useMemo(() => appointments
    .filter((item) => ["PENDING", "CONFIRMED", "RESCHEDULED"].includes(item.status))
    .sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`))
    .slice(0, 4), [appointments]);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8 md:py-10">
      {errorMessage && <div className="mb-6"><FeedbackMessage type="error">{errorMessage}</FeedbackMessage></div>}
      <section className="relative overflow-hidden rounded-[2.25rem] bg-[#3E8E91] p-8 text-white shadow-sm md:p-10">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10" />
        <div className="relative"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">Painel administrativo</p><h1 className="mt-3 text-4xl font-bold">Olá, {user?.name || "Ivina"}</h1><p className="mt-4 max-w-3xl text-lg leading-8 text-white/80">Uma visão rápida da agenda, solicitações pendentes e documentos que aguardam liberação.</p></div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={CalendarClock} value={String(pending.length)} label="Solicitações pendentes" highlight={pending.length > 0} />
        <Stat icon={CalendarDays} value={String(todayAppointments.length)} label="Atendimentos hoje" />
        <Stat icon={FileText} value={String(unreleasedDocuments.length)} label="Documentos não liberados" />
        <Stat icon={Sparkles} value={String(todaySlots.filter((slot) => slot.isAvailable && !slot.isBlocked).length)} label="Horários livres hoje" />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-center justify-between gap-4"><div><p className="eyebrow">Próximos atendimentos</p><h2 className="mt-2 text-2xl font-bold">Agenda em destaque</h2></div><Link to="/admin/agendamentos" className="text-sm font-semibold text-[#3E8E91] hover:underline">Ver todos</Link></div>
          {nextAppointments.length === 0 ? <p className="mt-5 rounded-3xl bg-[#F7F3EA] p-5 text-[#333333]/65">Nenhum agendamento ativo encontrado.</p> : <div className="mt-5 grid gap-3">{nextAppointments.map((appointment) => <div key={appointment.id} className="flex flex-col gap-3 rounded-3xl bg-[#F7F3EA] p-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-bold text-[#333333]">{appointment.childName}</p><p className="mt-1 text-sm text-[#333333]/60">{formatDateBR(appointment.date)} • {formatTimeBR(appointment.startTime)} • {appointment.responsibleName}</p></div><span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${appointmentStatusClasses[appointment.status]}`}>{appointmentStatusLabels[appointment.status]}</span></div>)}</div>}
        </div>
        <div className="rounded-[2rem] bg-white p-6 shadow-sm md:p-8"><p className="eyebrow">Ações rápidas</p><div className="mt-5 grid gap-3"><QuickLink to="/admin/horarios" icon={CalendarDays} title="Organizar horários" text="Criar, bloquear ou excluir horários." /><QuickLink to="/admin/agendamentos" icon={ClipboardList} title="Revisar solicitações" text={`${pending.length} pendente(s) de confirmação.`} /><QuickLink to="/admin/documentos" icon={FileText} title="Gerenciar documentos" text={`${unreleasedDocuments.length} aguardando liberação.`} /></div></div>
      </section>
    </main>
  );
}

function Stat({ icon: Icon, value, label, highlight = false }: { icon: typeof CalendarDays; value: string; label: string; highlight?: boolean }) { return <div className={`rounded-3xl p-5 shadow-sm ${highlight ? "bg-[#E84545] text-white" : "bg-white text-[#333333]"}`}><Icon className={highlight ? "text-white" : "text-[#3E8E91]"} size={27} /><p className="mt-4 text-3xl font-bold">{value}</p><p className={`mt-1 text-sm ${highlight ? "text-white/80" : "text-[#333333]/60"}`}>{label}</p></div>; }
function QuickLink({ to, icon: Icon, title, text }: { to: string; icon: typeof CalendarDays; title: string; text: string }) { return <Link to={to} className="flex gap-4 rounded-3xl bg-[#F7F3EA] p-5 transition hover:-translate-y-0.5 hover:shadow-sm"><span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#3E8E91]"><Icon size={22} /></span><div><p className="font-bold">{title}</p><p className="mt-1 text-sm text-[#333333]/60">{text}</p></div></Link>; }
