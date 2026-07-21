import { type FormEvent, useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Loader2, Lock, Plus, Trash2, Unlock } from "lucide-react";
import { BackButton } from "../../components/ui/BackButton";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { FeedbackMessage } from "../../components/ui/FeedbackMessage";
import { apiRequest, getErrorMessage } from "../../services/api";
import type { AvailabilitySlot } from "../../types/availability";
import { formatLongDateBR, formatTimeBR, todayIso } from "../../utils/formatters";

type CalendarDay = { date: Date; iso: string; day: number; currentMonth: boolean; today: boolean; selected: boolean; past: boolean };

export function AdminAvailability() {
  const today = useMemo(() => new Date(), []);
  const [month, setMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(todayIso());
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const days = useMemo(() => buildDays(month, selectedDate), [month, selectedDate]);

  useEffect(() => { void loadSlots(selectedDate); }, [selectedDate]);

  async function loadSlots(date: string) {
    try {
      setIsLoading(true); setErrorMessage("");
      setSlots(await apiRequest<AvailabilitySlot[]>("/admin/availability", { auth: true, query: { date } }));
    } catch (error) { setErrorMessage(getErrorMessage(error, "Não foi possível carregar os horários.")); }
    finally { setIsLoading(false); }
  }

  async function createSlot(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setErrorMessage(""); setSuccessMessage("");
    if (endTime <= startTime) { setErrorMessage("O horário final precisa ser posterior ao inicial."); return; }
    try {
      setIsCreating(true);
      await apiRequest<AvailabilitySlot>("/admin/availability", { method: "POST", auth: true, body: { date: selectedDate, startTime, endTime } });
      setSuccessMessage("Horário criado com sucesso.");
      await loadSlots(selectedDate);
    } catch (error) { setErrorMessage(getErrorMessage(error, "Não foi possível criar o horário.")); }
    finally { setIsCreating(false); }
  }

  async function toggleSlot(slot: AvailabilitySlot) {
    const action = slot.isBlocked ? "unblock" : "block";
    try {
      setActionId(slot.id); setErrorMessage(""); setSuccessMessage("");
      await apiRequest<AvailabilitySlot>(`/admin/availability/${slot.id}/${action}`, { method: "PUT", auth: true });
      setSuccessMessage(slot.isBlocked ? "Horário desbloqueado." : "Horário bloqueado.");
      await loadSlots(selectedDate);
    } catch (error) { setErrorMessage(getErrorMessage(error, "Não foi possível atualizar o horário.")); }
    finally { setActionId(null); }
  }

  async function deleteSlot() {
    if (!deleteId) return;
    try {
      setActionId(deleteId); setErrorMessage(""); setSuccessMessage("");
      await apiRequest<void>(`/admin/availability/${deleteId}`, { method: "DELETE", auth: true });
      setSuccessMessage("Horário removido da agenda.");
      await loadSlots(selectedDate);
    } catch (error) { setErrorMessage(getErrorMessage(error, "Não foi possível excluir o horário.")); }
    finally { setActionId(null); setDeleteId(null); }
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8 md:py-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><BackButton to="/admin" label="Voltar para o painel" className="mb-0" /><span className="admin-badge">Painel administrativo</span></div>
      <div className="mb-8"><p className="eyebrow">Disponibilidade</p><h1 className="page-title">Gerenciar horários</h1><p className="page-description">Crie intervalos disponíveis e bloqueie períodos que não poderão receber agendamentos.</p></div>
      <div className="mb-6 space-y-3">{errorMessage && <FeedbackMessage type="error">{errorMessage}</FeedbackMessage>}{successMessage && <FeedbackMessage type="success">{successMessage}</FeedbackMessage>}</div>
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] bg-white p-5 shadow-sm md:p-6">
          <div className="mb-5 flex items-center justify-between"><div><p className="eyebrow">Calendário</p><h2 className="mt-1 text-2xl font-bold capitalize">{new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(month)}</h2></div><div className="flex gap-2"><IconButton label="Mês anterior" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}><ChevronLeft size={20} /></IconButton><IconButton label="Próximo mês" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}><ChevronRight size={20} /></IconButton></div></div>
          <div className="grid grid-cols-7 gap-2">{["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"].map((day) => <div key={day} className="py-2 text-center text-xs font-bold uppercase text-[#333333]/45">{day}</div>)}{days.map((day) => <button key={day.iso} type="button" disabled={day.past} onClick={() => { setSelectedDate(day.iso); if (!day.currentMonth) setMonth(new Date(day.date.getFullYear(), day.date.getMonth(), 1)); }} className={dayClass(day)}><span>{day.day}</span>{day.today && <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#E84545]" />}</button>)}</div>
        </div>
        <aside className="rounded-[2rem] bg-white p-5 shadow-sm md:p-6">
          <div className="flex items-center gap-3"><span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#3E8E91]/10 text-[#3E8E91]"><Plus size={24} /></span><div><p className="eyebrow">Novo horário</p><h2 className="text-xl font-bold">{formatLongDateBR(selectedDate)}</h2></div></div>
          <form onSubmit={createSlot} className="mt-5 space-y-4"><div className="grid gap-4 sm:grid-cols-2"><div><label className="field-label" htmlFor="startTime">Início</label><input id="startTime" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="field-input" required /></div><div><label className="field-label" htmlFor="endTime">Fim</label><input id="endTime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="field-input" required /></div></div><button type="submit" disabled={isCreating} className="primary-button w-full">{isCreating ? <><Loader2 className="animate-spin" size={18} />Salvando...</> : <><CalendarDays size={18} />Criar horário</>}</button></form>
          <div className="mt-7 border-t border-[#3E8E91]/10 pt-6"><h3 className="text-lg font-bold">Horários cadastrados</h3>{isLoading ? <div className="mt-4 flex items-center gap-2 rounded-2xl bg-[#F7F3EA] p-4 text-sm"><Loader2 className="animate-spin" size={17} />Carregando...</div> : slots.length === 0 ? <p className="mt-4 rounded-2xl bg-[#F7F3EA] p-4 text-sm text-[#333333]/65">Nenhum horário cadastrado.</p> : <div className="mt-4 max-h-[430px] space-y-3 overflow-y-auto pr-1">{slots.map((slot) => <article key={slot.id} className="flex items-center justify-between gap-3 rounded-2xl bg-[#F7F3EA] p-4"><div><p className="font-bold">{formatTimeBR(slot.startTime)} às {formatTimeBR(slot.endTime)}</p><span className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-bold ${slot.isBlocked ? "bg-red-50 text-red-700" : !slot.isAvailable ? "bg-amber-50 text-amber-700" : "bg-green-50 text-green-700"}`}>{slot.isBlocked ? "Bloqueado" : !slot.isAvailable ? "Ocupado" : "Disponível"}</span></div><div className="flex gap-2"><IconButton label={slot.isBlocked ? "Desbloquear" : "Bloquear"} disabled={actionId === slot.id || (!slot.isBlocked && !slot.isAvailable)} onClick={() => void toggleSlot(slot)}>{slot.isBlocked ? <Unlock size={18} /> : <Lock size={18} />}</IconButton><IconButton label="Excluir" danger disabled={actionId === slot.id || !slot.isAvailable} onClick={() => setDeleteId(slot.id)}><Trash2 size={18} /></IconButton></div></article>)}</div>}</div>
        </aside>
      </section>
      <ConfirmDialog isOpen={Boolean(deleteId)} title="Excluir horário?" description="A exclusão é lógica: o horário sai da agenda, mas registros relacionados permanecem preservados." confirmLabel="Excluir horário" variant="danger" isLoading={Boolean(actionId)} onConfirm={() => void deleteSlot()} onCancel={() => setDeleteId(null)} />
    </main>
  );
}

function buildDays(month: Date, selected: string): CalendarDay[] { const first = new Date(month.getFullYear(), month.getMonth(), 1); const start = new Date(month.getFullYear(), month.getMonth(), 1 - first.getDay()); const today = todayIso(); return Array.from({ length: 42 }, (_, index) => { const date = new Date(start); date.setDate(start.getDate() + index); const iso = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`; return { date, iso, day: date.getDate(), currentMonth: date.getMonth() === month.getMonth(), today: iso === today, selected: iso === selected, past: iso < today }; }); }
function dayClass(day: CalendarDay) { const base = "flex min-h-14 flex-col items-center justify-center rounded-xl border text-sm font-semibold transition sm:min-h-16 md:min-h-[72px]"; if (day.past) return `${base} cursor-not-allowed border-transparent bg-[#F7F3EA] text-[#333333]/25`; if (day.selected) return `${base} border-[#E84545] bg-[#E84545] text-white`; if (!day.currentMonth) return `${base} border-transparent bg-[#F7F3EA] text-[#333333]/35 hover:border-[#3E8E91]/30`; return `${base} border-[#3E8E91]/10 hover:border-[#3E8E91] hover:bg-[#3E8E91]/5`; }
function IconButton({ children, label, onClick, disabled, danger = false }: { children: React.ReactNode; label: string; onClick: () => void; disabled?: boolean; danger?: boolean }) { return <button type="button" aria-label={label} title={label} onClick={onClick} disabled={disabled} className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition disabled:cursor-not-allowed disabled:opacity-35 ${danger ? "border-[#E84545]/20 text-[#E84545] hover:bg-[#E84545] hover:text-white" : "border-[#3E8E91]/20 text-[#3E8E91] hover:bg-[#3E8E91] hover:text-white"}`}>{children}</button>; }
