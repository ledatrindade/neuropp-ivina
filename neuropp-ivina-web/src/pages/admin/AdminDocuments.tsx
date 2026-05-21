import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, FileText, Loader2, Send } from "lucide-react";
import { Link } from "react-router";
import { apiRequest } from "../../services/api";
import { getAuthToken } from "../../services/authStorage";
import type { AppointmentResponse } from "../../types/appointment";
import type { AttendanceDocumentResponse, DocumentType } from "../../types/document";

const documentTypes: { label: string; value: DocumentType }[] = [
  { label: "Avaliação", value: "EVALUATION" },
  { label: "Sessão", value: "SESSION" },
  { label: "Devolutiva", value: "DEVOLUTION" },
  { label: "Orientação", value: "GUIDANCE" },
];

export function AdminDocuments() {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [documents, setDocuments] = useState<AttendanceDocumentResponse[]>([]);

  const [appointmentId, setAppointmentId] = useState("");
  const [title, setTitle] = useState("");
  const [documentType, setDocumentType] = useState<DocumentType>("EVALUATION");
  const [content, setContent] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    const token = getAuthToken();

    if (!token) {
      setErrorMessage("Sessão expirada. Faça login novamente.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const [appointmentsResponse, documentsResponse] = await Promise.all([
        apiRequest<AppointmentResponse[]>("/admin/appointments", { token }),
        apiRequest<AttendanceDocumentResponse[]>("/admin/documents", { token }),
      ]);

      setAppointments(appointmentsResponse);
      setDocuments(documentsResponse);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os dados.";

      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateDocument(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const token = getAuthToken();

    if (!token) {
      setErrorMessage("Sessão expirada. Faça login novamente.");
      return;
    }

    if (!appointmentId) {
      setErrorMessage("Selecione um agendamento.");
      return;
    }

    if (!title.trim()) {
      setErrorMessage("Informe um título para o documento.");
      return;
    }

    if (!content.trim()) {
      setErrorMessage("Informe o conteúdo do documento.");
      return;
    }

    try {
      setIsCreating(true);
      setErrorMessage("");
      setSuccessMessage("");

      await apiRequest<AttendanceDocumentResponse>("/admin/documents", {
        method: "POST",
        token,
        body: {
          appointmentId,
          title,
          documentType,
          content,
        },
      });

      setSuccessMessage("Documento criado com sucesso.");
      setTitle("");
      setContent("");
      await loadInitialData();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível criar o documento.";

      setErrorMessage(message);
    } finally {
      setIsCreating(false);
    }
  }

  async function handleReleaseDocument(documentId: string) {
    const token = getAuthToken();

    if (!token) {
      setErrorMessage("Sessão expirada. Faça login novamente.");
      return;
    }

    const confirmed = window.confirm(
      "Deseja liberar este documento para o responsável?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoadingId(documentId);
      setErrorMessage("");
      setSuccessMessage("");

      await apiRequest<AttendanceDocumentResponse>(
        `/admin/documents/${documentId}/release`,
        {
          method: "PUT",
          token,
        }
      );

      setSuccessMessage("Documento liberado para o responsável.");
      await loadInitialData();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível liberar o documento.";

      setErrorMessage(message);
    } finally {
      setActionLoadingId(null);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <Link
        to="/admin"
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#3E8E91]/20 px-4 py-2 text-sm font-semibold text-[#3E8E91] transition hover:bg-[#3E8E91] hover:text-white"
      >
        <ArrowLeft size={18} />
        Voltar para o painel
      </Link>

      <section className="mb-8">
        <span className="mb-4 inline-flex rounded-full bg-[#3E8E91]/10 px-4 py-2 text-sm font-semibold text-[#3E8E91]">
          Painel administrativo
        </span>

        <h1 className="text-4xl font-bold text-[#3E8E91]">
          Documentos
        </h1>

        <p className="mt-4 max-w-3xl text-lg leading-8 text-[#333333]/75">
          Crie registros de avaliação, sessão, devolutiva ou orientação e libere
          o acesso para o responsável.
        </p>
      </section>

      {errorMessage && (
        <div className="mb-6 rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-700">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="mb-6 rounded-2xl bg-green-50 p-4 text-sm font-medium text-green-700">
          {successMessage}
        </div>
      )}

      {isLoading ? (
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
          <Loader2 className="mx-auto animate-spin text-[#3E8E91]" size={34} />
          <p className="mt-4 text-[#333333]/70">Carregando documentos...</p>
        </div>
      ) : (
        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="rounded-[2rem] bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#3E8E91]/10 text-[#3E8E91]">
                <FileText size={24} />
              </span>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3E8E91]">
                  Novo documento
                </p>

                <h2 className="text-2xl font-bold text-[#333333]">
                  Criar registro
                </h2>
              </div>
            </div>

            <form onSubmit={handleCreateDocument} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#333333]">
                  Agendamento
                </label>

                <select
                  value={appointmentId}
                  onChange={(event) => setAppointmentId(event.target.value)}
                  className="w-full rounded-2xl border border-[#3E8E91]/20 bg-[#F7F3EA] px-4 py-3 outline-none transition focus:border-[#3E8E91]"
                >
                  <option value="">Selecione um agendamento</option>
                  {appointments.map((appointment) => (
                    <option key={appointment.id} value={appointment.id}>
                      {appointment.date} • {appointment.childName} •{" "}
                      {appointment.responsibleName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#333333]">
                  Tipo de documento
                </label>

                <select
                  value={documentType}
                  onChange={(event) =>
                    setDocumentType(event.target.value as DocumentType)
                  }
                  className="w-full rounded-2xl border border-[#3E8E91]/20 bg-[#F7F3EA] px-4 py-3 outline-none transition focus:border-[#3E8E91]"
                >
                  {documentTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#333333]">
                  Título
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Ex: Resumo da avaliação"
                  className="w-full rounded-2xl border border-[#3E8E91]/20 bg-[#F7F3EA] px-4 py-3 outline-none transition focus:border-[#3E8E91]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#333333]">
                  Conteúdo
                </label>

                <textarea
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  placeholder="Escreva aqui o registro do atendimento..."
                  rows={8}
                  className="w-full resize-none rounded-2xl border border-[#3E8E91]/20 bg-[#F7F3EA] px-4 py-3 outline-none transition focus:border-[#3E8E91]"
                />
              </div>

              <button
                type="submit"
                disabled={isCreating}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#E84545] px-6 py-3 font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Salvando...
                  </>
                ) : (
                  <>
                    <FileText size={20} />
                    Criar documento
                  </>
                )}
              </button>
            </form>
          </aside>

          <section className="rounded-[2rem] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#333333]">
              Documentos criados
            </h2>

            {documents.length === 0 ? (
              <div className="mt-5 rounded-3xl bg-[#F7F3EA] p-8 text-center text-[#333333]/70">
                Nenhum documento criado ainda.
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {documents.map((document) => (
                  <article
                    key={document.id}
                    className="rounded-3xl border border-[#3E8E91]/10 bg-[#F7F3EA] p-5"
                  >
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3E8E91]">
                      {translateDocumentType(document.documentType)}
                    </p>

                    <h3 className="mt-2 text-xl font-bold text-[#333333]">
                      {document.title}
                    </h3>

                    <p className="mt-2 text-sm text-[#333333]/60">
                      Criança: {document.childName} • Responsável:{" "}
                      {document.responsibleName}
                    </p>

                    <div className="mt-4 rounded-2xl bg-white p-4 text-sm leading-7 text-[#333333]/70 whitespace-pre-line">
                      {document.content || "Documento sem conteúdo textual."}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          document.isReleased
                            ? "bg-green-50 text-green-700"
                            : "bg-yellow-50 text-yellow-700"
                        }`}
                      >
                        {document.isReleased
                          ? "Liberado"
                          : "Aguardando liberação"}
                      </span>

                      {!document.isReleased && (
                        <button
                          type="button"
                          onClick={() => handleReleaseDocument(document.id)}
                          disabled={actionLoadingId === document.id}
                          className="inline-flex items-center gap-2 rounded-full bg-[#E84545] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-95 disabled:opacity-60"
                        >
                          {actionLoadingId === document.id ? (
                            <Loader2 className="animate-spin" size={16} />
                          ) : (
                            <Send size={16} />
                          )}
                          Liberar para responsável
                        </button>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
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