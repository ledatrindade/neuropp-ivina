import { useEffect, useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import { BackButton } from "../../components/ui/BackButton";
import { EmptyState } from "../../components/ui/EmptyState";
import { FeedbackMessage } from "../../components/ui/FeedbackMessage";
import { LoadingCard } from "../../components/ui/LoadingCard";
import { Pagination } from "../../components/ui/Pagination";
import { apiRequest, getErrorMessage } from "../../services/api";
import type { PageResponse } from "../../types/api";
import type { AttendanceDocumentDetail, AttendanceDocumentSummary } from "../../types/document";
import { formatDateTimeBR } from "../../utils/formatters";

export function MyDocuments() {
  const [documents, setDocuments] = useState<AttendanceDocumentSummary[]>([]);
  const [selected, setSelected] = useState<AttendanceDocumentDetail | null>(null);
  const [pageData, setPageData] = useState({ page: 0, totalPages: 0, totalElements: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadDocuments(page: number) {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const response = await apiRequest<PageResponse<AttendanceDocumentSummary>>("/documents/my", { auth: true, query: { page, size: 10 } });
      setDocuments(response.content);
      setPageData({ page: response.page, totalPages: response.totalPages, totalElements: response.totalElements });
      setSelected(null);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Não foi possível carregar seus documentos."));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { void loadDocuments(pageData.page); }, [pageData.page]);

  async function openDocument(id: string) {
    try {
      setIsDetailLoading(true);
      setErrorMessage("");
      setSelected(await apiRequest<AttendanceDocumentDetail>(`/documents/my/${id}`, { auth: true }));
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Não foi possível abrir o documento."));
    } finally {
      setIsDetailLoading(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8 md:py-10">
      <BackButton to="/responsavel" />
      <div className="mb-8"><p className="eyebrow">Área privada</p><h1 className="page-title">Documentos liberados</h1><p className="page-description">A listagem exibe apenas os dados principais. O conteúdo privado é carregado somente quando você abre um documento.</p></div>
      {errorMessage && <div className="mb-6"><FeedbackMessage type="error">{errorMessage}</FeedbackMessage></div>}
      {isLoading ? <LoadingCard label="Carregando documentos..." /> : documents.length === 0 ? <EmptyState icon={FileText} title="Nenhum documento liberado" description="Quando Ivina liberar um documento, ele aparecerá aqui." /> : (
        <>
          <section className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="space-y-3">
              {documents.map((document) => <button key={document.id} type="button" onClick={() => openDocument(document.id)} className={`w-full rounded-3xl border p-5 text-left shadow-sm transition ${selected?.id === document.id ? "border-[#E84545] bg-[#E84545]/10" : "border-transparent bg-white hover:border-[#3E8E91]/30"}`}><p className="eyebrow">{translateType(document.documentType)}</p><h2 className="mt-2 text-xl font-bold text-[#333333]">{document.title}</h2><p className="mt-2 text-sm text-[#333333]/60">{document.childName} • {formatDateTimeBR(document.createdAt)}</p></button>)}
            </div>
            <div className="min-h-80 rounded-3xl bg-white p-6 shadow-sm">
              {isDetailLoading ? <div className="flex min-h-64 items-center justify-center"><Loader2 className="animate-spin text-[#3E8E91]" size={32} /></div> : !selected ? <div className="flex min-h-64 items-center justify-center rounded-2xl bg-[#F7F3EA] p-6 text-center text-[#333333]/65">Selecione um documento para visualizar.</div> : <article><p className="eyebrow">{translateType(selected.documentType)}</p><h2 className="mt-3 text-2xl font-bold text-[#333333]">{selected.title}</h2><p className="mt-2 text-sm text-[#333333]/55">Criança: {selected.childName}</p><div className="mt-6 whitespace-pre-wrap rounded-2xl bg-[#F7F3EA] p-5 leading-8 text-[#333333]/75">{selected.content || "Documento sem conteúdo textual."}</div>{selected.fileUrl && <a href={selected.fileUrl} target="_blank" rel="noreferrer" className="primary-button mt-5">Abrir arquivo</a>}</article>}
            </div>
          </section>
          <Pagination page={pageData.page} totalPages={pageData.totalPages} totalElements={pageData.totalElements} onPageChange={(page) => setPageData((current) => ({ ...current, page }))} />
        </>
      )}
    </main>
  );
}

function translateType(type: string) { return ({ EVALUATION: "Avaliação", SESSION: "Sessão", DEVOLUTION: "Devolutiva", GUIDANCE: "Orientação" } as Record<string, string>)[type] || type; }
