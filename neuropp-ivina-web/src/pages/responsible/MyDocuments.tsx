import { useEffect, useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import { apiRequest } from "../../services/api";
import { getAuthToken } from "../../services/authStorage";
import { BackButton } from "../../components/ui/BackButton";
import type { AttendanceDocumentResponse } from "../../types/document";

export function MyDocuments() {
  const [documents, setDocuments] = useState<AttendanceDocumentResponse[]>([]);
  const [selectedDocument, setSelectedDocument] =
    useState<AttendanceDocumentResponse | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadDocuments();
  }, []);

  async function loadDocuments() {
    const token = getAuthToken();

    if (!token) {
      setErrorMessage("Sessão expirada. Faça login novamente.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await apiRequest<AttendanceDocumentResponse[]>(
        "/documents/my",
        {
          token,
        }
      );

      setDocuments(response);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível carregar seus documentos.";

      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8 md:py-10">
      <BackButton to="/responsavel" />

      <section className="mb-8">
        <h1 className="text-4xl font-bold text-[#3E8E91]">
          Documentos liberados
        </h1>

        <p className="mt-4 max-w-3xl text-lg leading-8 text-[#333333]/75">
          Aqui ficam documentos privados liberados por Ivina após avaliação,
          sessão ou devolutiva.
        </p>
      </section>

      {errorMessage && (
        <div className="mb-6 rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-700">
          {errorMessage}
        </div>
      )}

      {isLoading && (
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
          <Loader2 className="mx-auto animate-spin text-[#3E8E91]" size={34} />
          <p className="mt-4 text-[#333333]/70">Carregando documentos...</p>
        </div>
      )}

      {!isLoading && documents.length === 0 && (
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
          <FileText className="mx-auto text-[#3E8E91]" size={40} />

          <h2 className="mt-4 text-2xl font-bold text-[#333333]">
            Nenhum documento liberado
          </h2>

          <p className="mt-3 text-[#333333]/70">
            Quando Ivina liberar um documento, ele aparecerá aqui.
          </p>
        </div>
      )}

      {!isLoading && documents.length > 0 && (
        <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            {documents.map((document) => (
              <button
                key={document.id}
                type="button"
                onClick={() => setSelectedDocument(document)}
                className={`w-full rounded-3xl border p-5 text-left shadow-sm transition ${
                  selectedDocument?.id === document.id
                    ? "border-[#E84545] bg-[#E84545]/10"
                    : "border-transparent bg-white hover:border-[#3E8E91]/30"
                }`}
              >
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3E8E91]">
                  {translateDocumentType(document.documentType)}
                </p>

                <h2 className="mt-2 text-xl font-bold text-[#333333]">
                  {document.title}
                </h2>

                <p className="mt-2 text-sm text-[#333333]/60">
                  Criança: {document.childName}
                </p>
              </button>
            ))}
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            {!selectedDocument ? (
              <div className="flex h-full min-h-64 items-center justify-center rounded-2xl bg-[#F7F3EA] p-6 text-center text-[#333333]/70">
                Selecione um documento para visualizar.
              </div>
            ) : (
              <article>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3E8E91]">
                  {translateDocumentType(selectedDocument.documentType)}
                </p>

                <h2 className="mt-3 text-2xl font-bold text-[#333333]">
                  {selectedDocument.title}
                </h2>

                <p className="mt-2 text-sm text-[#333333]/60">
                  Criança: {selectedDocument.childName}
                </p>

                <div className="mt-6 whitespace-pre-line rounded-2xl bg-[#F7F3EA] p-5 leading-8 text-[#333333]/75">
                  {selectedDocument.content || "Documento sem conteúdo textual."}
                </div>

                {selectedDocument.fileUrl && (
                  <a
                    href={selectedDocument.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex rounded-full bg-[#E84545] px-5 py-3 font-semibold text-white transition hover:brightness-95"
                  >
                    Abrir arquivo
                  </a>
                )}
              </article>
            )}
          </div>
        </section>
      )}
    </main>
  );
}

function translateDocumentType(type: string) {
  const typeMap: Record<string, string> = {
    EVALUATION: "Avaliação",
    SESSION: "Sessão",
    DEVOLUTION: "Devolutiva",
    GUIDANCE: "Orientação",
  };

  return typeMap[type] || type;
}