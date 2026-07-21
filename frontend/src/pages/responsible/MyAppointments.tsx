import { useEffect, useState } from "react";
import { CalendarDays, Clock, Loader2, RefreshCcw, Trash2, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { BackButton } from "../../components/ui/BackButton";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { EmptyState } from "../../components/ui/EmptyState";
import { FeedbackMessage } from "../../components/ui/FeedbackMessage";
import { LoadingCard } from "../../components/ui/LoadingCard";
import { Pagination } from "../../components/ui/Pagination";
import { apiRequest, getErrorMessage } from "../../services/api";
import type { AppointmentResponse } from "../../types/appointment";
import type { PageResponse } from "../../types/api";
import type { AvailabilitySlot } from "../../types/availability";
import { appointmentStatusClasses, appointmentStatusLabels, terminalStatuses } from "../../utils/appointmentStatus";
import { formatDateBR, formatTimeBR, todayIso } from "../../utils/formatters";

type DialogState = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  variant: "danger" | "warning";
  action: () => void;
};

export function MyAppointments() {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [pageData, setPageData] = useState({ page: 0, totalPages: 0, totalElements: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [newSlotId, setNewSlotId] = useState("");
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [dialog, setDialog] = useState<DialogState>({ open: false, title: "", description: "", confirmLabel: "Confirmar", variant: "warning", action: () => undefined });

  useEffect(() => { void loadAppointments(pageData.page); }, [pageData.page]);

  async function loadAppointments(page: number) {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const response = await apiRequest<PageResponse<AppointmentResponse>>("/appointments/my", { auth: true, query: { page, size: 10 } });
      setAppointments(response.content);
      setPageData({ page: response.page, totalPages: response.totalPages, totalElements: response.totalElements });
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Não foi possível carregar seus agendamentos."));
    } finally {
      setIsLoading(false);
    }
  }

  async function cancelAppointment(id: string) {
    try {
      setActionLoadingId(id); setErrorMessage(""); setSuccessMessage("");
      await apiRequest<AppointmentResponse>(`/appointments/my/${id}/cancel`, { method: "PUT", auth: true });
      setSuccessMessage("Agendamento cancelado com sucesso.");
      await loadAppointments(pageData.page);
    } catch (error) { setErrorMessage(getErrorMessage(error, "Não foi possível cancelar o agendamento.")); }
    finally { setActionLoadingId(null); closeDialog(); }
  }

  async function hideAppointment(id: string) {
    try {
      setActionLoadingId(id); setErrorMessage(""); setSuccessMessage("");
      await apiRequest<void>(`/appointments/my/${id}/history`, { method: "DELETE", auth: true });
      setSuccessMessage("Agendamento removido do seu histórico.");
      await loadAppointments(pageData.page);
    } catch (error) { setErrorMessage(getErrorMessage(error, "Não foi possível remover do histórico.")); }
    finally { setActionLoadingId(null); closeDialog(); }
  }

  async function loadSlots(date: string) {
    setRescheduleDate(date); setNewSlotId("");
    if (!date) { setSlots([]); return; }
    try {
      setSlotsLoading(true); setErrorMessage("");
      setSlots(await apiRequest<AvailabilitySlot[]>("/availability", { query: { date } }));
    } catch (error) { setErrorMessage(getErrorMessage(error, "Não foi possível carregar os horários.")); setSlots([]); }
    finally { setSlotsLoading(false); }
  }

  async function confirmReschedule() {
    if (!rescheduleId || !newSlotId) return;
    try {
      setActionLoadingId(rescheduleId); setErrorMessage(""); setSuccessMessage("");
      await apiRequest<AppointmentResponse>(`/appointments/my/${rescheduleId}/reschedule`, { method: "PUT", auth: true, body: { newSlotId } });
      setSuccessMessage("Agendamento reagendado. A nova data aguarda confirmação da profissional.");
      closeReschedule();
      await loadAppointments(pageData.page);
    } catch (error) { setErrorMessage(getErrorMessage(error, "Não foi possível reagendar.")); }
    finally { setActionLoadingId(null); }
  }

  function openReschedule(id: string) { setRescheduleId(id); setRescheduleDate(""); setSlots([]); setNewSlotId(""); }
  function closeReschedule() { setRescheduleId(null); setRescheduleDate(""); setSlots([]); setNewSlotId(""); }
  function closeDialog() { setDialog((current) => ({ ...current, open: false })); }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8 md:py-10">
      <BackButton to="/responsavel" />
      <div className="mb-8"><p className="eyebrow">Acompanhamento</p><h1 className="page-title">Meus agendamentos</h1><p className="page-description">Consulte status, reagende ou cancele dentro do prazo permitido pela API.</p></div>
      <div className="mb-6 space-y-3">{errorMessage && <FeedbackMessage type="error">{errorMessage}</FeedbackMessage>}{successMessage && <FeedbackMessage type="success">{successMessage}</FeedbackMessage>}</div>
      {isLoading ? <LoadingCard label="Carregando seus agendamentos..." /> : appointments.length === 0 ? <EmptyState icon={CalendarDays} title="Nenhum agendamento encontrado" description="Quando você marcar uma avaliação, ela aparecerá aqui." actionLabel="Marcar avaliação" actionTo="/agendar" /> : (
        <>
          <section className="grid gap-5">
            {appointments.map((appointment) => {
              const canManage = ["PENDING", "CONFIRMED", "RESCHEDULED"].includes(appointment.status);
              const canHide = terminalStatuses.includes(appointment.status);
              return (
                <article key={appointment.id} className="rounded-3xl bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-center gap-3"><span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#3E8E91]/10 text-[#3E8E91]"><Clock size={24} /></span><div><h2 className="text-xl font-bold text-[#333333]">{appointment.childName}</h2><p className="text-sm text-[#333333]/60">{appointment.childAge} anos</p></div></div>
                    <span className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-bold ${appointmentStatusClasses[appointment.status]}`}>{appointmentStatusLabels[appointment.status]}</span>
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-3"><Info label="Data" value={formatDateBR(appointment.date)} /><Info label="Horário" value={`${formatTimeBR(appointment.startTime)} às ${formatTimeBR(appointment.endTime)}`} /><Info label="Solicitado em" value={new Date(appointment.createdAt).toLocaleDateString("pt-BR")} /></div>
                  {appointment.notes && <div className="mt-4 rounded-2xl bg-[#F7F3EA] p-4 text-sm leading-6 text-[#333333]/70"><strong>Observações:</strong> {appointment.notes}</div>}
                  {(canManage || canHide) && <div className="mt-5 flex flex-wrap gap-2 border-t border-[#3E8E91]/10 pt-5">
                    {canManage && <><button type="button" onClick={() => openReschedule(appointment.id)} className="secondary-button"><RefreshCcw size={17} />Reagendar</button><button type="button" onClick={() => setDialog({ open: true, title: "Cancelar agendamento?", description: "O cancelamento online só é permitido até 5 horas antes do atendimento.", confirmLabel: "Cancelar agendamento", variant: "danger", action: () => void cancelAppointment(appointment.id) })} className="danger-button"><XCircle size={17} />Cancelar</button></>}
                    {canHide && <button type="button" onClick={() => setDialog({ open: true, title: "Remover do histórico?", description: "O registro deixará de aparecer nesta área, mas continuará preservado na administração.", confirmLabel: "Remover", variant: "warning", action: () => void hideAppointment(appointment.id) })} className="secondary-button"><Trash2 size={17} />Remover do histórico</button>}
                  </div>}
                  {rescheduleId === appointment.id && <div className="mt-5 rounded-3xl border border-[#3E8E91]/10 bg-[#F7F3EA] p-5"><div className="flex items-center justify-between gap-3"><div><h3 className="text-lg font-bold">Escolher novo horário</h3><p className="mt-1 text-sm text-[#333333]/65">A alteração também respeita o limite de 5 horas.</p></div><button type="button" onClick={closeReschedule} className="text-sm font-semibold text-[#3E8E91]">Fechar</button></div><input type="date" min={todayIso()} value={rescheduleDate} onChange={(e) => void loadSlots(e.target.value)} className="field-input mt-4 bg-white" />{slotsLoading && <div className="mt-4 flex items-center gap-2 text-sm text-[#333333]/65"><Loader2 className="animate-spin" size={17} />Buscando horários...</div>}{!slotsLoading && rescheduleDate && slots.length === 0 && <p className="mt-4 rounded-2xl bg-white p-4 text-sm text-[#333333]/65">Nenhum horário disponível para esta data.</p>}{slots.length > 0 && <div className="mt-4 grid gap-2 sm:grid-cols-2">{slots.map((slot) => <button key={slot.id} type="button" onClick={() => setNewSlotId(slot.id)} className={`rounded-2xl border p-4 text-left ${newSlotId === slot.id ? "border-[#E84545] bg-[#E84545]/10" : "border-transparent bg-white hover:border-[#3E8E91]"}`}>{formatTimeBR(slot.startTime)} às {formatTimeBR(slot.endTime)}</button>)}</div>}{newSlotId && <button type="button" onClick={() => void confirmReschedule()} disabled={actionLoadingId === appointment.id} className="primary-button mt-4">{actionLoadingId === appointment.id && <Loader2 className="animate-spin" size={17} />}Confirmar reagendamento</button>}</div>}
                </article>
              );
            })}
          </section>
          <Pagination page={pageData.page} totalPages={pageData.totalPages} totalElements={pageData.totalElements} onPageChange={(page) => setPageData((current) => ({ ...current, page }))} />
        </>
      )}
      <ConfirmDialog isOpen={dialog.open} title={dialog.title} description={dialog.description} confirmLabel={dialog.confirmLabel} variant={dialog.variant} isLoading={Boolean(actionLoadingId)} onConfirm={dialog.action} onCancel={closeDialog} />
      <div className="mt-8 text-center"><Link to="/agendar" className="primary-button"><CalendarDays size={18} />Marcar nova avaliação</Link></div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl bg-[#F7F3EA] p-4"><p className="text-sm font-semibold text-[#3E8E91]">{label}</p><p className="mt-1 font-bold text-[#333333]">{value}</p></div>; }
