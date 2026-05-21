import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Clock,
  Loader2,
  RefreshCcw,
  XCircle,
} from "lucide-react";
import { Link } from "react-router";
import { apiRequest } from "../../services/api";
import { getAuthToken } from "../../services/authStorage";
import { BackButton } from "../../components/ui/BackButton";
import type { AppointmentResponse } from "../../types/appointment";
import type { AvailabilitySlot } from "../../types/availability";

export function MyAppointments() {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const [rescheduleAppointmentId, setRescheduleAppointmentId] =
    useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState<AvailabilitySlot[]>([]);
  const [selectedNewSlotId, setSelectedNewSlotId] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const visibleAppointments = useMemo(() => {
    return appointments.filter(
      (appointment) => appointment.status !== "CANCELLED"
    );
  }, [appointments]);

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
      setSuccessMessage("");

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
      setSuccessMessage("");

      await apiRequest<AppointmentResponse>(
        `/appointments/my/${appointmentId}/cancel`,
        {
          method: "PUT",
          token,
        }
      );

      setSuccessMessage("Agendamento cancelado com sucesso.");
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

  async function loadAvailableSlotsForReschedule(date: string) {
    try {
      setErrorMessage("");
      setSelectedNewSlotId("");

      const response = await apiRequest<AvailabilitySlot[]>(
        `/availability?date=${date}`
      );

      setAvailableSlots(response);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível buscar horários disponíveis.";

      setErrorMessage(message);
      setAvailableSlots([]);
    }
  }

  function openReschedulePanel(appointmentId: string) {
    setRescheduleAppointmentId(appointmentId);
    setRescheduleDate("");
    setAvailableSlots([]);
    setSelectedNewSlotId("");
    setErrorMessage("");
    setSuccessMessage("");
  }

  function closeReschedulePanel() {
    setRescheduleAppointmentId(null);
    setRescheduleDate("");
    setAvailableSlots([]);
    setSelectedNewSlotId("");
  }

  async function handleConfirmReschedule() {
    const token = getAuthToken();

    if (!token) {
      setErrorMessage("Sessão expirada. Faça login novamente.");
      return;
    }

    if (!rescheduleAppointmentId) {
      setErrorMessage("Nenhum agendamento selecionado para reagendar.");
      return;
    }

    if (!selectedNewSlotId) {
      setErrorMessage("Selecione um novo horário para reagendar.");
      return;
    }

    try {
      setActionLoadingId(rescheduleAppointmentId);
      setErrorMessage("");
      setSuccessMessage("");

      await apiRequest<AppointmentResponse>(
        `/appointments/my/${rescheduleAppointmentId}/reschedule`,
        {
          method: "PUT",
          token,
          body: {
            newSlotId: selectedNewSlotId,
          },
        }
      );

      setSuccessMessage("Agendamento reagendado com sucesso.");
      closeReschedulePanel();
      await loadAppointments();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível reagendar o atendimento.";

      setErrorMessage(message);
    } finally {
      setActionLoadingId(null);
    }
  }

  function formatTime(time: string) {
    return time.slice(0, 5);
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8 md:py-10">
      <BackButton to="/responsavel" />

      <section className="mb-8">
        <h1 className="text-4xl font-bold text-[#3E8E91]">
          Meus agendamentos
        </h1>

        <p className="mt-4 max-w-3xl text-lg leading-8 text-[#333333]/75">
          Consulte seus atendimentos marcados, status e opções disponíveis.
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

      {isLoading && (
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
          <Loader2 className="mx-auto animate-spin text-[#3E8E91]" size={34} />
          <p className="mt-4 text-[#333333]/70">
            Carregando seus agendamentos...
          </p>
        </div>
      )}

      {!isLoading && visibleAppointments.length === 0 && (
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
          <CalendarDays className="mx-auto text-[#3E8E91]" size={40} />

          <h2 className="mt-4 text-2xl font-bold text-[#333333]">
            Nenhum agendamento ativo
          </h2>

          <p className="mt-3 text-[#333333]/70">
            Quando você marcar uma avaliação, ela aparecerá aqui.
          </p>

          <Link
            to="/agendar"
            className="mt-6 inline-flex rounded-full bg-[#E84545] px-6 py-3 font-semibold text-white transition hover:brightness-95"
          >
            Marcar avaliação
          </Link>
        </div>
      )}

      {!isLoading && visibleAppointments.length > 0 && (
        <section className="grid gap-5">
          {visibleAppointments.map((appointment) => (
            <article
              key={appointment.id}
              className="rounded-3xl bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
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

                    <Info
                      label="Status"
                      value={translateStatus(appointment.status)}
                    />
                  </div>

                  {appointment.notes && (
                    <div className="mt-5 rounded-2xl bg-[#F7F3EA] p-4 text-sm leading-6 text-[#333333]/70">
                      <strong>Observações:</strong> {appointment.notes}
                    </div>
                  )}
                </div>

                {canManage(appointment.status) && (
                  <div className="flex flex-wrap gap-2 lg:min-w-72">
                    <button
                      type="button"
                      onClick={() => openReschedulePanel(appointment.id)}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-[#3E8E91]/30 px-5 py-3 text-sm font-semibold text-[#3E8E91] transition hover:bg-[#3E8E91] hover:text-white"
                    >
                      <RefreshCcw size={18} />
                      Reagendar
                    </button>

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
                  </div>
                )}
              </div>

              {rescheduleAppointmentId === appointment.id && (
                <section className="mt-6 rounded-3xl border border-[#3E8E91]/10 bg-[#F7F3EA] p-5">
                  <h3 className="text-lg font-bold text-[#333333]">
                    Reagendar atendimento
                  </h3>

                  <p className="mt-2 text-sm text-[#333333]/70">
                    Escolha uma nova data e um horário disponível.
                  </p>

                  <div className="mt-5 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#333333]">
                        Nova data
                      </label>

                      <input
                        type="date"
                        value={rescheduleDate}
                        onChange={(event) => {
                          setRescheduleDate(event.target.value);
                          loadAvailableSlotsForReschedule(event.target.value);
                        }}
                        className="w-full rounded-2xl border border-[#3E8E91]/20 bg-white px-4 py-3 outline-none transition focus:border-[#3E8E91]"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={closeReschedulePanel}
                      className="rounded-2xl border border-[#333333]/10 px-4 py-3 font-semibold text-[#333333]/70 transition hover:bg-white"
                    >
                      Fechar
                    </button>
                  </div>

                  {rescheduleDate && availableSlots.length === 0 && (
                    <p className="mt-4 rounded-2xl bg-white p-4 text-sm text-[#333333]/70">
                      Nenhum horário disponível para essa data.
                    </p>
                  )}

                  {availableSlots.length > 0 && (
                    <div className="mt-5 grid gap-3 md:grid-cols-2">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => setSelectedNewSlotId(slot.id)}
                          className={`rounded-2xl border p-4 text-left transition ${
                            selectedNewSlotId === slot.id
                              ? "border-[#E84545] bg-[#E84545]/10"
                              : "border-transparent bg-white hover:border-[#3E8E91]"
                          }`}
                        >
                          <p className="font-bold text-[#333333]">
                            {formatTime(slot.startTime)} às{" "}
                            {formatTime(slot.endTime)}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}

                  {selectedNewSlotId && (
                    <button
                      type="button"
                      onClick={handleConfirmReschedule}
                      disabled={actionLoadingId === appointment.id}
                      className="mt-5 inline-flex rounded-full bg-[#E84545] px-6 py-3 font-semibold text-white transition hover:brightness-95 disabled:opacity-60"
                    >
                      Confirmar reagendamento
                    </button>
                  )}
                </section>
              )}
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

function canManage(status: string) {
  return status === "CONFIRMED" || status === "RESCHEDULED";
}