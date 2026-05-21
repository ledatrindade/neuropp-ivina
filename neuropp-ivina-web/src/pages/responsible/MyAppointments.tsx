import { useEffect, useState } from "react";
import { CalendarDays, Clock, Loader2, XCircle } from "lucide-react";
import { apiRequest } from "../../services/api";
import { getAuthToken } from "../../services/authStorage";
import type { AppointmentResponse } from "../../types/appointment";

/*
 * Página de agendamentos do responsável.
 */

export function MyAppointments() {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments() {
    const token = getAuthToken();

    if (!token) {
      setErrorMessage("Sessão expirada. Faça login novamente.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await apiRequest<AppointmentResponse[]>(
        "/appointments/my",
        {
          token,
        }
      );

      setAppointments(response);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível carregar seus agendamentos.";

      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCancelAppointment(appointmentId: string) {
    const token = getAuthToken();

    if (!token) {
      setErrorMessage("Sessão expirada. Faça login novamente.");
      return;
    }

    const confirmed = window.confirm(
      "Deseja cancelar este agendamento? O cancelamento online só é permitido até 5 horas antes do atendimento."
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoadingId(appointmentId);
      setErrorMessage("");

      await apiRequest<AppointmentResponse>(
        `/appointments/my/${appointmentId}/cancel`,
        {
          method: "PUT",
          token,
        }
      );

      await loadAppointments();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível cancelar o agendamento.";

      setErrorMessage(message);
    } finally {
      setActionLoadingId(null);
    }
  }

  function formatTime(time: string) {
    return time.slice(0, 5);
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-12">
      <section className="mb-8">
        <span className="mb-4 inline-flex rounded-full bg-[#3E8E91]/10 px-4 py-2 text-sm font-semibold text-[#3E8E91]">
          Área do responsável
        </span>

        <h1 className="text-4xl font-bold text-[#3E8E91]">
          Meus agendamentos
        </h1>

        <p className="mt-4 max-w-3xl text-lg leading-8 text-[#333333]/75">
          Consulte seus atendimentos marcados, status e informações principais.
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
          <p className="mt-4 text-[#333333]/70">
            Carregando seus agendamentos...
          </p>
        </div>
      )}

      {!isLoading && appointments.length === 0 && (
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
          <CalendarDays className="mx-auto text-[#3E8E91]" size={40} />

          <h2 className="mt-4 text-2xl font-bold text-[#333333]">
            Nenhum agendamento encontrado
          </h2>

          <p className="mt-3 text-[#333333]/70">
            Quando você marcar uma avaliação, ela aparecerá aqui.
          </p>
        </div>
      )}

      {!isLoading && appointments.length > 0 && (
        <section className="grid gap-5">
          {appointments.map((appointment) => (
            <article
              key={appointment.id}
              className="rounded-3xl bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#3E8E91]/10 text-[#3E8E91]">
                      <Clock size={24} />
                    </span>

                    <div>
                      <h2 className="text-xl font-bold text-[#333333]">
                        {appointment.childName}
                      </h2>

                      <p className="text-sm text-[#333333]/60">
                        Criança • {appointment.childAge} anos
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 text-sm text-[#333333]/75 md:grid-cols-3">
                    <Info label="Data" value={appointment.date} />

                    <Info
                      label="Horário"
                      value={`${formatTime(appointment.startTime)} às ${formatTime(
                        appointment.endTime
                      )}`}
                    />

                    <Info label="Status" value={translateStatus(appointment.status)} />
                  </div>

                  {appointment.notes && (
                    <div className="mt-5 rounded-2xl bg-[#F7F3EA] p-4 text-sm leading-6 text-[#333333]/70">
                      <strong>Observações:</strong> {appointment.notes}
                    </div>
                  )}
                </div>

                {canCancel(appointment.status) && (
                  <button
                    type="button"
                    onClick={() => handleCancelAppointment(appointment.id)}
                    disabled={actionLoadingId === appointment.id}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[#E84545] px-5 py-3 text-sm font-semibold text-[#E84545] transition hover:bg-[#E84545] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {actionLoadingId === appointment.id ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Cancelando...
                      </>
                    ) : (
                      <>
                        <XCircle size={18} />
                        Cancelar
                      </>
                    )}
                  </button>
                )}
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

type InfoProps = {
  label: string;
  value: string;
};

function Info({ label, value }: InfoProps) {
  return (
    <div className="rounded-2xl bg-[#F7F3EA] p-4">
      <p className="font-semibold text-[#3E8E91]">{label}</p>
      <p className="mt-1 font-bold text-[#333333]">{value}</p>
    </div>
  );
}

function translateStatus(status: string) {
  const statusMap: Record<string, string> = {
    PENDING: "Pendente",
    CONFIRMED: "Confirmado",
    RESCHEDULED: "Reagendado",
    CANCELLED: "Cancelado",
    ATTENDED: "Compareceu",
    MISSED: "Faltou",
    COMPLETED: "Concluído",
  };

  return statusMap[status] || status;
}

function canCancel(status: string) {
  return status === "CONFIRMED" || status === "RESCHEDULED";
}