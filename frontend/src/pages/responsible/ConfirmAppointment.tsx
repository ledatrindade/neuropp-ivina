import { type FormEvent, useEffect, useState } from "react";
import { CalendarCheck, CalendarDays, Clipboard, Clock, Loader2, MessageCircle, Plus, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { BackButton } from "../../components/ui/BackButton";
import { FeedbackMessage } from "../../components/ui/FeedbackMessage";
import { apiRequest, getErrorMessage, getFieldErrors } from "../../services/api";
import { clearSelectedSlot, getSelectedSlot } from "../../services/appointmentStorage";
import { siteContent } from "../../content/siteContent";
import type { AppointmentResponse } from "../../types/appointment";
import type { AvailabilitySlot } from "../../types/availability";
import type { ChildResponse } from "../../types/child";
import { buildWhatsappUrl, createAdminNewAppointmentMessage, createResponsibleConfirmationText } from "../../utils/whatsapp";
import { formatDateBR, formatTimeBR } from "../../utils/formatters";

export function ConfirmAppointment() {
  const [selectedSlot] = useState<AvailabilitySlot | null>(() => getSelectedSlot());
  const [children, setChildren] = useState<ChildResponse[]>([]);
  const [selectedChildId, setSelectedChildId] = useState("");
  const [createNewChild, setCreateNewChild] = useState(false);
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("");
  const [notes, setNotes] = useState("");
  const [createdAppointment, setCreatedAppointment] = useState<AppointmentResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [copyMessage, setCopyMessage] = useState("");

  async function loadChildren() {
    try {
      setIsLoading(true);
      const response = await apiRequest<ChildResponse[]>("/children/my", { auth: true });
      setChildren(response);
      if (response.length > 0) setSelectedChildId(response[0].id);
      else setCreateNewChild(true);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Não foi possível carregar as crianças cadastradas."));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadChildren();
  }, []);

  async function createChild() {
    const child = await apiRequest<ChildResponse>("/children/my", {
      method: "POST",
      auth: true,
      body: { name: childName.trim(), age: Number(childAge) },
    });
    setChildren((current) => [...current, child]);
    setSelectedChildId(child.id);
    return child.id;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setFieldErrors({});

    if (!selectedSlot) {
      setErrorMessage("O horário selecionado expirou. Volte ao calendário e escolha novamente.");
      return;
    }

    if (createNewChild && (!childName.trim() || childAge === "")) {
      setErrorMessage("Informe o nome e a idade da criança.");
      return;
    }

    try {
      setIsSubmitting(true);
      const childId = createNewChild ? await createChild() : selectedChildId;
      if (!childId) throw new Error("Selecione uma criança.");

      const appointment = await apiRequest<AppointmentResponse>("/appointments/my", {
        method: "POST",
        auth: true,
        body: { childId, slotId: selectedSlot.id, notes: notes.trim() || null },
      });
      setCreatedAppointment(appointment);
      clearSelectedSlot();
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Não foi possível enviar a solicitação."));
      setFieldErrors(getFieldErrors(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function copyConfirmation(appointment: AppointmentResponse) {
    try {
      await navigator.clipboard.writeText(createResponsibleConfirmationText(appointment, siteContent.contact.address));
      setCopyMessage("Mensagem copiada.");
    } catch {
      setCopyMessage("Não foi possível copiar automaticamente.");
    }
  }

  if (isLoading) {
    return <main className="mx-auto max-w-4xl px-5 py-16"><div className="rounded-3xl bg-white p-8 text-center"><Loader2 className="mx-auto animate-spin text-[#3E8E91]" /><p className="mt-3">Preparando confirmação...</p></div></main>;
  }

  if (!selectedSlot && !createdAppointment) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-16">
        <section className="rounded-[2rem] bg-white p-8 text-center shadow-sm">
          <CalendarDays className="mx-auto text-[#3E8E91]" size={42} />
          <h1 className="mt-4 text-3xl font-bold text-[#333333]">Nenhum horário selecionado</h1>
          <p className="mt-3 text-[#333333]/70">Escolha um horário disponível para continuar.</p>
          <Link to="/agendar" className="primary-button mt-6">Escolher horário</Link>
        </section>
      </main>
    );
  }

  if (createdAppointment) {
    const whatsappUrl = buildWhatsappUrl(siteContent.contact.whatsapp, createAdminNewAppointmentMessage(createdAppointment, siteContent.contact.address));
    return (
      <main className="mx-auto max-w-5xl px-5 py-14">
        <section className="overflow-hidden rounded-[2rem] bg-white shadow-sm">
          <div className="bg-[#3E8E91] p-8 text-white">
            <CalendarCheck size={42} />
            <h1 className="mt-4 text-3xl font-bold">Solicitação registrada</h1>
            <p className="mt-3 max-w-2xl text-white/80">O horário ficou reservado como pendente até a confirmação da profissional.</p>
          </div>
          <div className="p-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Info label="Criança" value={createdAppointment.childName} />
              <Info label="Data" value={formatDateBR(createdAppointment.date)} />
              <Info label="Horário" value={`${formatTimeBR(createdAppointment.startTime)} às ${formatTimeBR(createdAppointment.endTime)}`} />
            </div>
            {copyMessage && <div className="mt-5"><FeedbackMessage type="success">{copyMessage}</FeedbackMessage></div>}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={() => copyConfirmation(createdAppointment)} className="secondary-button"><Clipboard size={18} />Copiar mensagem</button>
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="primary-button"><MessageCircle size={18} />Avisar pelo WhatsApp</a>
              <Link to="/responsavel" className="secondary-button">Ir para minha área</Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8 md:py-10">
      <BackButton to="/agendar" />
      <div className="mb-8"><p className="eyebrow">Última etapa</p><h1 className="page-title">Confirmar avaliação</h1><p className="page-description">Revise o horário, escolha uma criança cadastrada ou adicione uma nova.</p></div>
      <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="rounded-[2rem] bg-[#3E8E91] p-6 text-white shadow-sm">
          <Clock size={34} />
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-white/70">Horário escolhido</p>
          <h2 className="mt-2 text-2xl font-bold">{selectedSlot && formatDateBR(selectedSlot.date)}</h2>
          <p className="mt-1 text-lg text-white/80">{selectedSlot && `${formatTimeBR(selectedSlot.startTime)} às ${formatTimeBR(selectedSlot.endTime)}`}</p>
          <div className="mt-6 rounded-3xl bg-white/10 p-5 text-sm leading-7 text-white/80">A API confirma novamente a disponibilidade ao registrar. Caso outra pessoa tenha reservado primeiro, você receberá um aviso para escolher outro horário.</div>
        </aside>
        <section className="rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMessage && <FeedbackMessage type="error">{errorMessage}</FeedbackMessage>}
            {children.length > 0 && !createNewChild && (
              <div><label className="field-label" htmlFor="child">Criança cadastrada</label><select id="child" value={selectedChildId} onChange={(e) => setSelectedChildId(e.target.value)} className="field-input">{children.map((child) => <option key={child.id} value={child.id}>{child.name} • {child.age} anos</option>)}</select></div>
            )}
            <button type="button" onClick={() => setCreateNewChild((value) => !value)} className="secondary-button w-full"><Plus size={18} />{createNewChild ? "Usar criança já cadastrada" : "Cadastrar outra criança"}</button>
            {createNewChild && (
              <div className="grid gap-4 rounded-3xl bg-[#F7F3EA] p-5 sm:grid-cols-[1fr_160px]">
                <div><label className="field-label" htmlFor="childName">Nome da criança</label><input id="childName" value={childName} onChange={(e) => setChildName(e.target.value)} className="field-input bg-white" maxLength={150} />{fieldErrors.name && <p className="field-error">{fieldErrors.name}</p>}</div>
                <div><label className="field-label" htmlFor="childAge">Idade</label><input id="childAge" type="number" min={0} max={17} value={childAge} onChange={(e) => setChildAge(e.target.value)} className="field-input bg-white" /></div>
              </div>
            )}
            <div><label className="field-label" htmlFor="notes">Observações iniciais</label><textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={5} maxLength={2000} className="field-input resize-none" placeholder="Conte brevemente o motivo da busca, se desejar." /><p className="mt-1 text-right text-xs text-[#333333]/45">{notes.length}/2000</p></div>
            <button type="submit" disabled={isSubmitting} className="primary-button w-full">{isSubmitting ? <><Loader2 className="animate-spin" size={20} />Enviando...</> : <><UserRound size={20} />Enviar solicitação</>}</button>
          </form>
        </section>
      </section>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-3xl bg-[#F7F3EA] p-5"><p className="text-sm font-semibold text-[#3E8E91]">{label}</p><p className="mt-2 font-bold text-[#333333]">{value}</p></div>;
}
