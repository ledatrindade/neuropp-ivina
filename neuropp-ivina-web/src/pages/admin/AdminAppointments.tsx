import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle,
  ClipboardList,
  Loader2,
  XCircle,
} from "lucide-react";
import { Link } from "react-router";
import { apiRequest } from "../../services/api";
import { getAuthToken } from "../../services/authStorage";
import type { AppointmentResponse, AppointmentStatus } from "../../types/appointment";

const statusOptions: { label: string; value: AppointmentStatus }[] = [
  { label: "Confirmado", value: "CONFIRMED" },
  { label: "Reagendado", value: "RESCHEDULED" },
  { label: "Compareceu", value: "ATTENDED" },
  { label: "Faltou", value: "MISSED" },
  { label: "Concluído", value: "COMPLETED" },
  { label: "Cancelado", value: "CANCELLED" },
];

export function AdminAppointments() {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    loadAppointments();
  }, []);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const matchesDate = selectedDate ? appointment.date === selectedDate : true;
      const matchesStatus = selectedStatus
        ? appointment.status === selectedStatus
        : true;

      return matchesDate && matchesStatus;
    });
  }, [appointments, selectedDate, selectedStatus]);

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
        "/admin/appointments",
        {
          token,
        }
      );

      setAppointments(response);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os agendamentos.";

      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateStatus(
    appointmentId: string,
    status: AppointmentStatus
  ) {
    const token = getAuthToken();

    if (!token) {
      setErrorMessage("Sessão expirada. Faça login novamente.");
      return;
    }

    try {
      setActionLoadingId(appointmentId);
      setErrorMessage("");
      setSuccessMessage("");

      await apiRequest<AppointmentResponse>(
        `/admin/appointments/${appointmentId}/status`,
        {
          method: "PUT",
          token,
          body: {
            status,
          },
        }
      );

      setSuccessMessage("Status atualizado com sucesso.");
      await loadAppointments();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar o status.";

      setErrorMessage(message);
    } finally {
      setActionLoadingId(null);
    }
  }

  function formatTime(time: string) {
    return time.slice(0, 5);
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
          Agendamentos
        </h1>

        <p className="mt-4 max-w-3xl text-lg leading-8 text-[#333333]/75">
          Acompanhe as avaliações marcadas e atualize o status de cada
          atendimento.
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

      <section className="mb-6 grid gap-4 rounded-3xl bg-white p-5 shadow-sm md:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#333333]">
            Filtrar por data
          </label>

          <input
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="w-full rounded-2xl border border-[#3E8E91]/20 bg-[#F7F3EA] px-4 py-3 outline-none transition focus:border-[#3E8E91]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[#333333]">
            Filtrar por status
          </label>

          <select
            value={selectedStatus}
            onChange={(event) => setSelectedStatus(event.target.value)}
            className="w-full rounded-2xl border border-[#3E8E91]/20 bg-[#F7F3EA] px-4 py-3 outline-none transition focus:border-[#3E8E91]"
          >
            <option value="">Todos</option>
            {statusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={() => {
              setSelectedDate("");
              setSelectedStatus("");
            }}
            className="w-full rounded-2xl border border-[#3E8E91]/20 px-4 py-3 font-semibold text-[#3E8E91] transition hover:bg-[#3E8E91] hover:text-white"
          >
            Limpar filtros
          </button>
        </div>
      </section>

      {isLoading && (
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
          <Loader2 className="mx-auto animate-spin text-[#3E8E91]" size={34} />
          <p className="mt-4 text-[#333333]/70">
            Carregando agendamentos...
          </p>
        </div>
      )}

      {!isLoading && filteredAppointments.length === 0 && (
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
          <ClipboardList className="mx-auto text-[#3E8E91]" size={42} />

          <h2 className="mt-4 text-2xl font-bold text-[#333333]">
            Nenhum agendamento encontrado
          </h2>

          <p className="mt-3 text-[#333333]/70">
            Tente alterar os filtros ou aguarde novos agendamentos.
          </p>
        </div>
      )}

      {!isLoading && filteredAppointments.length > 0 && (
        <section className="grid gap-5">
          {filteredAppointments.map((appointment) => (
            <article
              key={appointment.id}
              className="rounded-3xl bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#3E8E91]/10 text-[#3E8E91]">
                      <CalendarDays size={24} />
                    </span>

                    <div>
                      <h2 className="text-xl font-bold text-[#333333]">
                        {appointment.childName}
                      </h2>

                      <p className="text-sm text-[#333333]/60">
                        Responsável: {appointment.responsibleName} •{" "}
                        {appointment.responsiblePhone}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 text-sm text-[#333333]/75 md:grid-cols-4">
                    <Info label="Data" value={appointment.date} />
                    <Info
                      label="Horário"
                      value={`${formatTime(appointment.startTime)} às ${formatTime(
                        appointment.endTime
                      )}`}
                    />
                    <Info label="Idade" value={`${appointment.childAge} anos`} />
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

                <div className="grid gap-2 sm:grid-cols-2 lg:min-w-72">
                  <StatusButton
                    label="Compareceu"
                    icon="check"
                    loading={actionLoadingId === appointment.id}
                    onClick={() => updateStatus(appointment.id, "ATTENDED")}
                  />

                  <StatusButton
                    label="Faltou"
                    icon="x"
                    loading={actionLoadingId === appointment.id}
                    onClick={() => updateStatus(appointment.id, "MISSED")}
                  />

                  <StatusButton
                    label="Concluir"
                    icon="check"
                    loading={actionLoadingId === appointment.id}
                    onClick={() => updateStatus(appointment.id, "COMPLETED")}
                  />

                  <StatusButton
                    label="Cancelar"
                    icon="x"
                    loading={actionLoadingId === appointment.id}
                    danger
                    onClick={() => updateStatus(appointment.id, "CANCELLED")}
                  />
                </div>
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

type StatusButtonProps = {
  label: string;
  icon: "check" | "x";
  loading: boolean;
  danger?: boolean;
  onClick: () => void;
};

function StatusButton({
  label,
  icon,
  loading,
  danger,
  onClick,
}: StatusButtonProps) {
  return (
    <button
      type="button"
      disabled={loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition disabled:opacity-60 ${
        danger
          ? "border-[#E84545]/30 text-[#E84545] hover:bg-[#E84545] hover:text-white"
          : "border-[#3E8E91]/30 text-[#3E8E91] hover:bg-[#3E8E91] hover:text-white"
      }`}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={16} />
      ) : icon === "check" ? (
        <CheckCircle size={16} />
      ) : (
        <XCircle size={16} />
      )}

      {label}
    </button>
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