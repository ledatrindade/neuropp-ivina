import { type FormEvent, useEffect, useState } from "react";
import { FileText, Loader2, Send } from "lucide-react";
import { BackButton } from "../../components/ui/BackButton";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { EmptyState } from "../../components/ui/EmptyState";
import { FeedbackMessage } from "../../components/ui/FeedbackMessage";
import { Pagination } from "../../components/ui/Pagination";
import { apiRequest, getErrorMessage, getFieldErrors } from "../../services/api";
import type { AppointmentResponse } from "../../types/appointment";
import type { PageResponse } from "../../types/api";
import type { AttendanceDocumentDetail, AttendanceDocumentSummary, DocumentType } from "../../types/document";
import { formatDateBR, formatDateTimeBR } from "../../utils/formatters";

const documentTypes: { value: DocumentType; label: string }[] = [{ value: "EVALUATION", label: "Avaliação" }, { value: "SESSION", label: "Sessão" }, { value: "DEVOLUTION", label: "Devolutiva" }, { value: "GUIDANCE", label: "Orientação" }];

export function AdminDocuments() {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [documents, setDocuments] = useState<AttendanceDocumentSummary[]>([]);
  const [pageData, setPageData] = useState({ page: 0, totalPages: 0, totalElements: 0 });
  const [selected, setSelected] = useState<AttendanceDocumentDetail | null>(null);
  const [appointmentId, setAppointmentId] = useState("");
  const [title, setTitle] = useState("");
  const [documentType, setDocumentType] = useState<DocumentType>("EVALUATION");
  const [content, setContent] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [releaseId, setReleaseId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => { void loadData(pageData.page); }, [pageData.page]);

  async function loadData(page: number) {
    try {
      setIsLoading(true); setErrorMessage("");
      const [appointmentPage, documentPage] = await Promise.all([
        apiRequest<PageResponse<AppointmentResponse>>("/admin/appointments", { auth: true, query: { page: 0, size: 100 } }),
        apiRequest<PageResponse<AttendanceDocumentSummary>>("/admin/documents", { auth: true, query: { page, size: 10 } }),
      ]);
      setAppointments(appointmentPage.content);
      setDocuments(documentPage.content);
      setPageData({ page: documentPage.page, totalPages: documentPage.totalPages, totalElements: documentPage.totalElements });
    } catch (error) { setErrorMessage(getErrorMessage(error, "Não foi possível carregar os documentos.")); }
    finally { setIsLoading(false); }
  }

  async function openDocument(id: string) {
    try { setIsDetailLoading(true); setErrorMessage(""); setSelected(await apiRequest<AttendanceDocumentDetail>(`/admin/documents/${id}`, { auth: true })); }
    catch (error) { setErrorMessage(getErrorMessage(error, "Não foi possível abrir o documento.")); }
    finally { setIsDetailLoading(false); }
  }

  async function createDocument(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setErrorMessage(""); setSuccessMessage(""); setFieldErrors({});
    if (!content.trim() && !fileUrl.trim()) { setErrorMessage("Informe um conteúdo ou uma referência de arquivo."); return; }
    try {
      setIsCreating(true);
      const created = await apiRequest<AttendanceDocumentDetail>("/admin/documents", { method: "POST", auth: true, body: { appointmentId, title: title.trim(), documentType, content: content.trim() || null, fileUrl: fileUrl.trim() || null } });
      setTitle(""); setContent(""); setFileUrl(""); setSuccessMessage("Documento criado com sucesso."); setSelected(created);
      await loadData(pageData.page);
    } catch (error) { setErrorMessage(getErrorMessage(error, "Não foi possível criar o documento.")); setFieldErrors(getFieldErrors(error)); }
    finally { setIsCreating(false); }
  }

  async function releaseDocument() {
    if (!releaseId) return;
    try {
      setActionId(releaseId); setErrorMessage(""); setSuccessMessage("");
      const released = await apiRequest<AttendanceDocumentDetail>(`/admin/documents/${releaseId}/release`, { method: "PUT", auth: true });
      setSelected(released); setSuccessMessage("Documento liberado para o responsável.");
      await loadData(pageData.page);
    } catch (error) { setErrorMessage(getErrorMessage(error, "Não foi possível liberar o documento.")); }
    finally { setActionId(null); setReleaseId(null); }
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8 md:py-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><BackButton to="/admin" label="Voltar para o painel" className="mb-0" /><span className="admin-badge">Painel administrativo</span></div>
      <div className="mb-8"><p className="eyebrow">Registros privados</p><h1 className="page-title">Documentos</h1><p className="page-description">Crie o registro, revise o conteúdo e só depois libere o acesso ao responsável.</p></div>
      <div className="mb-6 space-y-3">{errorMessage && <FeedbackMessage type="error">{errorMessage}</FeedbackMessage>}{successMessage && <FeedbackMessage type="success">{successMessage}</FeedbackMessage>}</div>
      <section className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
        <aside className="rounded-[2rem] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3"><span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#3E8E91]/10 text-[#3E8E91]"><FileText size={24} /></span><div><p className="eyebrow">Novo documento</p><h2 className="text-2xl font-bold">Criar registro</h2></div></div>
          <form onSubmit={createDocument} className="mt-6 space-y-4"><div><label className="field-label" htmlFor="appointment">Agendamento</label><select id="appointment" required value={appointmentId} onChange={(e) => setAppointmentId(e.target.value)} className="field-input"><option value="">Selecione</option>{appointments.map((appointment) => <option key={appointment.id} value={appointment.id}>{formatDateBR(appointment.date)} • {appointment.childName} • {appointment.responsibleName}</option>)}</select>{fieldErrors.appointmentId && <p className="field-error">{fieldErrors.appointmentId}</p>}</div><div><label className="field-label" htmlFor="type">Tipo</label><select id="type" value={documentType} onChange={(e) => setDocumentType(e.target.value as DocumentType)} className="field-input">{documentTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}</select></div><div><label className="field-label" htmlFor="title">Título</label><input id="title" required maxLength={180} value={title} onChange={(e) => setTitle(e.target.value)} className="field-input" placeholder="Ex: Resumo da avaliação" />{fieldErrors.title && <p className="field-error">{fieldErrors.title}</p>}</div><div><label className="field-label" htmlFor="content">Conteúdo</label><textarea id="content" rows={9} maxLength={100000} value={content} onChange={(e) => setContent(e.target.value)} className="field-input resize-y" placeholder="Escreva o registro do atendimento..." /></div><div><label className="field-label" htmlFor="fileUrl">Link de arquivo (opcional)</label><input id="fileUrl" type="url" maxLength={2048} value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} className="field-input" placeholder="https://..." /></div><button type="submit" disabled={isCreating} className="primary-button w-full">{isCreating ? <><Loader2 className="animate-spin" size={18} />Salvando...</> : <><FileText size={18} />Criar documento</>}</button></form>
        </aside>
        <section className="grid gap-5 lg:grid-cols-[0.78fr_1.22fr]">
          <div className="space-y-3">{isLoading ? <div className="rounded-3xl bg-white p-8 text-center"><Loader2 className="mx-auto animate-spin text-[#3E8E91]" /></div> : documents.length === 0 ? <EmptyState icon={FileText} title="Nenhum documento" description="Crie o primeiro registro usando o formulário." /> : documents.map((document) => <button key={document.id} type="button" onClick={() => void openDocument(document.id)} className={`w-full rounded-3xl border p-5 text-left shadow-sm transition ${selected?.id === document.id ? "border-[#E84545] bg-[#E84545]/10" : "border-transparent bg-white hover:border-[#3E8E91]/30"}`}><p className="eyebrow">{translateType(document.documentType)}</p><h3 className="mt-2 font-bold">{document.title}</h3><p className="mt-1 text-sm text-[#333333]/55">{document.childName}</p><span className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-bold ${document.isReleased ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>{document.isReleased ? "Liberado" : "Privado"}</span></button>)}<Pagination page={pageData.page} totalPages={pageData.totalPages} totalElements={pageData.totalElements} onPageChange={(page) => setPageData((current) => ({ ...current, page }))} /></div>
          <div className="rounded-[2rem] bg-white p-6 shadow-sm">{isDetailLoading ? <div className="flex min-h-80 items-center justify-center"><Loader2 className="animate-spin text-[#3E8E91]" size={32} /></div> : !selected ? <div className="flex min-h-80 items-center justify-center rounded-3xl bg-[#F7F3EA] p-6 text-center text-[#333333]/65">Selecione um documento para revisar o conteúdo completo.</div> : <article><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><p className="eyebrow">{translateType(selected.documentType)}</p><h2 className="mt-2 text-2xl font-bold">{selected.title}</h2><p className="mt-2 text-sm text-[#333333]/55">{selected.childName} • {selected.responsibleName}</p></div><span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${selected.isReleased ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>{selected.isReleased ? "Liberado" : "Aguardando liberação"}</span></div><div className="mt-5 whitespace-pre-wrap rounded-3xl bg-[#F7F3EA] p-5 leading-8 text-[#333333]/75">{selected.content || "Sem conteúdo textual."}</div>{selected.fileUrl && <a href={selected.fileUrl} target="_blank" rel="noreferrer" className="secondary-button mt-4">Abrir arquivo</a>}<p className="mt-5 text-xs text-[#333333]/45">Criado em {formatDateTimeBR(selected.createdAt)}</p>{!selected.isReleased && <button type="button" onClick={() => setReleaseId(selected.id)} className="primary-button mt-5"><Send size={18} />Liberar para responsável</button>}</article>}</div>
        </section>
      </section>
      <ConfirmDialog isOpen={Boolean(releaseId)} title="Liberar documento?" description="Após a liberação, o responsável poderá visualizar o conteúdo completo em sua área privada." confirmLabel="Liberar documento" variant="success" isLoading={Boolean(actionId)} onConfirm={() => void releaseDocument()} onCancel={() => setReleaseId(null)} />
    </main>
  );
}

function translateType(type: string) { return documentTypes.find((item) => item.value === type)?.label || type; }
