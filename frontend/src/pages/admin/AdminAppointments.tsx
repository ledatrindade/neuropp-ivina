import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Loader2, Search, Trash2 } from "lucide-react";
import { BackButton } from "../../components/ui/BackButton";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { EmptyState } from "../../components/ui/EmptyState";
import { FeedbackMessage } from "../../components/ui/FeedbackMessage";
import { LoadingCard } from "../../components/ui/LoadingCard";
import { Pagination } from "../../components/ui/Pagination";
import { apiRequest, getErrorMessage } from "../../services/api";
import type { AppointmentResponse, AppointmentStatus } from "../../types/appointment";
import type { PageResponse } from "../../types/api";
import { adminTransitions, appointmentStatusClasses, appointmentStatusLabels, terminalStatuses } from "../../utils/appointmentStatus";
import { formatDateBR, formatTimeBR } from "../../utils/formatters";

type DialogState = { open: boolean; title: string; description: string; confirmLabel: string; variant: "danger" | "warning"; action: () => void };

export function AdminAppointments() {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [pageData, setPageData] = useState({ page: 0, totalPages: 0, totalElements: 0 });
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [dialog, setDialog] = useState<DialogState>({ open: false, title: "", description: "", confirmLabel: "Confirmar", variant: "warning", action: () => undefined });

  useEffect(() => { void loadAppointments(pageData.page); }, [pageData.page]);

  const filtered = useMemo(() => appointments.filter((appointment) => {
    const term = search.trim().toLowerCase();
    return (!selectedDate || appointment.date === selectedDate) && (!selectedStatus || appointment.status === selectedStatus) && (!term || appointment.childName.toLowerCase().includes(term) || appointment.responsibleName.toLowerCase().includes(term));
  }), [appointments, selectedDate, selectedStatus, search]);

  async function loadAppointments(page: number) {
    try {
      setIsLoading(true); setErrorMessage("");
      const response = await apiRequest<PageResponse<AppointmentResponse>>("/admin/appointments", { auth: true, query: { page, size: 15 } });
      setAppointments(response.content);
      setPageData({ page: response.page, totalPages: response.totalPages, totalElements: response.totalElements });
    } catch (error) { setErrorMessage(getErrorMessage(error, "Não foi possível carregar os agendamentos.")); }
    finally { setIsLoading(false); }
  }

  async function updateStatus(id: string, status: AppointmentStatus) {
    try {
      setActionLoadingId(id); setErrorMessage(""); setSuccessMessage("");
      const updated = await apiRequest<AppointmentResponse>(`/admin/appointments/${id}/status`, { method: "PUT", auth: true, body: { status } });
      setAppointments((current) => current.map((item) => item.id === id ? updated : item));
      setSuccessMessage(`Status alterado para “${appointmentStatusLabels[status]}”.`);
    } catch (error) { setErrorMessage(getErrorMessage(error, "Não foi possível atualizar o status.")); }
    finally { setActionLoadingId(null); setDialog((current) => ({ ...current, open: false })); }
  }

  async function hide(id: string) {
    try {
      setActionLoadingId(id); setErrorMessage(""); setSuccessMessage("");
      await apiRequest<void>(`/admin/appointments/${id}/history`, { method: "DELETE", auth: true });
      setSuccessMessage("Agendamento removido do histórico administrativo.");
      await loadAppointments(pageData.page);
    } catch (error) { setErrorMessage(getErrorMessage(error, "Não foi possível remover do histórico.")); }
    finally { setActionLoadingId(null); setDialog((current) => ({ ...current, open: false })); }
  }

  function requestStatus(appointment: AppointmentResponse, status: AppointmentStatus) {
    const destructive = status === "CANCELLED" || status === "MISSED";
    if (!destructive) { void updateStatus(appointment.id, status); return; }
    setDialog({ open: true, title: `Marcar como “${appointmentStatusLabels[status]}”?`, description: status === "CANCELLED" ? "O horário será liberado novamente quando permitido." : "Essa alteração encerra o fluxo desse agendamento.", confirmLabel: "Confirmar alteração", variant: "danger", action: () => void updateStatus(appointment.id, status) });
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8 md:py-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><BackButton to="/admin" label="Voltar para o painel" className="mb-0" /><span className="admin-badge">Painel administrativo</span></div>
      <div className="mb-8"><p className="eyebrow">Agenda</p><h1 className="page-title">Agendamentos</h1><p className="page-description">Atualize somente as transições permitidas pela regra de negócio da API.</p></div>
      <div className="mb-6 space-y-3">{errorMessage && <FeedbackMessage type="error">{errorMessage}</FeedbackMessage>}{successMessage && <FeedbackMessage type="success">{successMessage}</FeedbackMessage>}</div>
      <section className="mb-6 grid gap-4 rounded-3xl bg-white p-5 shadow-sm md:grid-cols-[1fr_190px_210px_auto]">
        <div><label className="field-label" htmlFor="search">Buscar nesta página</label><div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#333333]/35" size={18} /><input id="search" value={search} onChange={(e) => setSearch(e.target.value)} className="field-input pl-11" placeholder="Criança ou responsável" /></div></div>
        <div><label className="field-label" htmlFor="date">Data</label><input id="date" type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="field-input" /></div>
        <div><label className="field-label" htmlFor="status">Status</label><select id="status" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="field-input"><option value="">Todos</option>{Object.entries(appointmentStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
        <button type="button" onClick={() => { setSearch(""); setSelectedDate(""); setSelectedStatus(""); }} className="secondary-button self-end">Limpar</button>
      </section>
      {isLoading ? <LoadingCard label="Carregando agendamentos..." /> : filtered.length === 0 ? <EmptyState icon={CalendarDays} title="Nenhum agendamento encontrado" description="Altere os filtros ou consulte outra página." /> : (
        <>
          <section className="grid gap-5">{filtered.map((appointment) => <article key={appointment.id} className="rounded-3xl bg-white p-6 shadow-sm"><div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between"><div><h2 className="text-xl font-bold">{appointment.childName}</h2><p className="mt-1 text-sm text-[#333333]/60">Responsável: {appointment.responsibleName} • {appointment.responsiblePhone}</p></div><span className={`w-fit rounded-full px-4 py-2 text-sm font-bold ${appointmentStatusClasses[appointment.status]}`}>{appointmentStatusLabels[appointment.status]}</span></div><div className="mt-5 grid gap-3 md:grid-cols-3"><Info label="Data" value={formatDateBR(appointment.date)} /><Info label="Horário" value={`${formatTimeBR(appointment.startTime)} às ${formatTimeBR(appointment.endTime)}`} /><Info label="Idade" value={`${appointment.childAge} anos`} /></div>{appointment.notes && <div className="mt-4 rounded-2xl bg-[#F7F3EA] p-4 text-sm leading-6 text-[#333333]/70"><strong>Observações:</strong> {appointment.notes}</div>}<div className="mt-5 flex flex-wrap gap-2 border-t border-[#3E8E91]/10 pt-5">{adminTransitions(appointment.status).map((status) => <button key={status} type="button" onClick={() => requestStatus(appointment, status)} disabled={actionLoadingId === appointment.id} className={status === "CANCELLED" || status === "MISSED" ? "danger-button" : "secondary-button"}>{actionLoadingId === appointment.id && <Loader2 className="animate-spin" size={16} />}{appointmentStatusLabels[status]}</button>)}{terminalStatuses.includes(appointment.status) && <button type="button" onClick={() => setDialog({ open: true, title: "Remover do histórico?", description: "O registro deixará de aparecer no painel, sem apagar os dados preservados na API.", confirmLabel: "Remover", variant: "warning", action: () => void hide(appointment.id) })} className="secondary-button"><Trash2 size={16} />Remover do histórico</button>}</div></article>)}</section>
          <Pagination page={pageData.page} totalPages={pageData.totalPages} totalElements={pageData.totalElements} onPageChange={(page) => setPageData((current) => ({ ...current, page }))} />
        </>
      )}
      <ConfirmDialog isOpen={dialog.open} title={dialog.title} description={dialog.description} confirmLabel={dialog.confirmLabel} variant={dialog.variant} isLoading={Boolean(actionLoadingId)} onConfirm={dialog.action} onCancel={() => setDialog((current) => ({ ...current, open: false }))} />
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl bg-[#F7F3EA] p-4"><p className="text-sm font-semibold text-[#3E8E91]">{label}</p><p className="mt-1 font-bold">{value}</p></div>; }
