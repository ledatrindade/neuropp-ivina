import { FormEvent, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
  Lock,
  Plus,
  Trash2,
  Unlock,
} from "lucide-react";
import { apiRequest } from "../../services/api";
import { getAuthToken } from "../../services/authStorage";
import type { AvailabilitySlot } from "../../types/availability";

type CalendarDay = {
  date: Date;
  isoDate: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isPast: boolean;
};

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function AdminAvailability() {
  const today = useMemo(() => new Date(), []);

  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const [selectedDate, setSelectedDate] = useState(formatDateToIso(today));
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("12:00");

  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const calendarDays = useMemo(() => {
    return buildCalendarDays(currentMonth, selectedDate);
  }, [currentMonth, selectedDate]);

  async function loadSlotsByDate(date: string) {
    const token = getAuthToken();

    if (!token) {
      setErrorMessage("Sessão expirada. Faça login novamente.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await apiRequest<AvailabilitySlot[]>(
        `/admin/availability?date=${date}`,
        {
          token,
        }
      );

      setSlots(response);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os horários.";

      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSelectDay(day: CalendarDay) {
    if (day.isPast) {
      return;
    }

    setSelectedDate(day.isoDate);

    if (!day.isCurrentMonth) {
      setCurrentMonth(new Date(day.date.getFullYear(), day.date.getMonth(), 1));
    }

    loadSlotsByDate(day.isoDate);
  }

  async function handleCreateSlot(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const token = getAuthToken();

    if (!token) {
      setErrorMessage("Sessão expirada. Faça login novamente.");
      return;
    }

    try {
      setIsCreating(true);
      setErrorMessage("");
      setSuccessMessage("");

      await apiRequest<AvailabilitySlot>("/admin/availability", {
        method: "POST",
        token,
        body: {
          date: selectedDate,
          startTime,
          endTime,
        },
      });

      setSuccessMessage("Horário cadastrado com sucesso!");
      await loadSlotsByDate(selectedDate);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível cadastrar o horário.";

      setErrorMessage(message);
    } finally {
      setIsCreating(false);
    }
  }

  async function handleSlotAction(slotId: string, action: "block" | "unblock") {
    const token = getAuthToken();

    if (!token) {
      setErrorMessage("Sessão expirada. Faça login novamente.");
      return;
    }

    try {
      setActionLoadingId(slotId);
      setErrorMessage("");
      setSuccessMessage("");

      await apiRequest<AvailabilitySlot>(
        `/admin/availability/${slotId}/${action}`,
        {
          method: "PUT",
          token,
        }
      );

      setSuccessMessage(
        action === "block"
          ? "Horário bloqueado com sucesso."
          : "Horário desbloqueado com sucesso."
      );

      await loadSlotsByDate(selectedDate);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar o horário.";

      setErrorMessage(message);
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleDeleteSlot(slotId: string) {
    const token = getAuthToken();

    if (!token) {
      setErrorMessage("Sessão expirada. Faça login novamente.");
      return;
    }

    const confirmed = window.confirm(
      "Deseja excluir este horário? Essa ação não poderá ser desfeita."
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoadingId(slotId);
      setErrorMessage("");
      setSuccessMessage("");

      await apiRequest<null>(`/admin/availability/${slotId}`, {
        method: "DELETE",
        token,
      });

      setSuccessMessage("Horário excluído com sucesso.");
      await loadSlotsByDate(selectedDate);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível excluir o horário.";

      setErrorMessage(message);
    } finally {
      setActionLoadingId(null);
    }
  }

  function goToPreviousMonth() {
    setCurrentMonth((previousMonth) => {
      return new Date(
        previousMonth.getFullYear(),
        previousMonth.getMonth() - 1,
        1
      );
    });
  }

  function goToNextMonth() {
    setCurrentMonth((previousMonth) => {
      return new Date(
        previousMonth.getFullYear(),
        previousMonth.getMonth() + 1,
        1
      );
    });
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
          Gerenciar horários
        </h1>

        <p className="mt-4 max-w-3xl text-lg leading-8 text-[#333333]/75">
          Escolha um dia no calendário e cadastre os horários em que Ivina
          estará disponível para avaliações.
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

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl bg-white p-5 shadow-sm md:p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3E8E91]">
                Calendário
              </p>

              <h2 className="mt-1 text-2xl font-bold text-[#333333]">
                {formatMonthTitle(currentMonth)}
              </h2>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={goToPreviousMonth}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#3E8E91]/20 text-[#3E8E91] transition hover:bg-[#3E8E91] hover:text-white"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                type="button"
                onClick={goToNextMonth}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#3E8E91]/20 text-[#3E8E91] transition hover:bg-[#3E8E91] hover:text-white"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="py-2 text-center text-xs font-bold uppercase tracking-wide text-[#333333]/50"
              >
                {day}
              </div>
            ))}

            {calendarDays.map((day) => (
              <button
                key={day.isoDate}
                type="button"
                onClick={() => handleSelectDay(day)}
                disabled={day.isPast}
                className={getCalendarDayClass(day)}
              >
                <span>{day.dayNumber}</span>

                {day.isToday && (
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#E84545]" />
                )}
              </button>
            ))}
          </div>
        </div>

        <aside className="rounded-3xl bg-white p-5 shadow-sm md:p-6">
          <div className="mb-5 flex items-center gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#3E8E91]/10 text-[#3E8E91]">
              <Plus size={24} />
            </span>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3E8E91]">
                Novo horário
              </p>

              <h2 className="text-xl font-bold text-[#333333]">
                {formatSelectedDate(selectedDate)}
              </h2>
            </div>
          </div>

          <form onSubmit={handleCreateSlot} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#333333]">
                  Hora inicial
                </label>

                <input
                  type="time"
                  value={startTime}
                  onChange={(event) => setStartTime(event.target.value)}
                  className="w-full rounded-2xl border border-[#3E8E91]/20 bg-[#F7F3EA] px-4 py-3 outline-none transition focus:border-[#3E8E91]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#333333]">
                  Hora final
                </label>

                <input
                  type="time"
                  value={endTime}
                  onChange={(event) => setEndTime(event.target.value)}
                  className="w-full rounded-2xl border border-[#3E8E91]/20 bg-[#F7F3EA] px-4 py-3 outline-none transition focus:border-[#3E8E91]"
                />
              </div>
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
                  <CalendarDays size={20} />
                  Criar horário para este dia
                </>
              )}
            </button>
          </form>

          <div className="mt-8">
            <h3 className="mb-3 text-lg font-bold text-[#333333]">
              Horários cadastrados
            </h3>

            {isLoading && (
              <div className="rounded-2xl bg-[#F7F3EA] p-5 text-center text-[#333333]/70">
                Carregando...
              </div>
            )}

            {!isLoading && slots.length === 0 && (
              <div className="rounded-2xl bg-[#F7F3EA] p-5 text-center text-[#333333]/70">
                Nenhum horário cadastrado para este dia.
              </div>
            )}

            <div className="space-y-3">
              {slots.map((slot) => (
                <article
                  key={slot.id}
                  className="rounded-2xl border border-[#3E8E91]/10 bg-[#F7F3EA] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-[#333333]">
                        {formatTime(slot.startTime)} às {formatTime(slot.endTime)}
                      </p>

                      <span
                        className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                          slot
                        )}`}
                      >
                        {getStatusLabel(slot)}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      {slot.isBlocked ? (
                        <button
                          type="button"
                          onClick={() => handleSlotAction(slot.id, "unblock")}
                          disabled={actionLoadingId === slot.id}
                          className="rounded-full bg-white p-2 text-[#3E8E91] transition hover:bg-[#3E8E91] hover:text-white disabled:opacity-40"
                          title="Desbloquear"
                        >
                          <Unlock size={18} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSlotAction(slot.id, "block")}
                          disabled={actionLoadingId === slot.id || !slot.isAvailable}
                          className="rounded-full bg-white p-2 text-[#3E8E91] transition hover:bg-[#3E8E91] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                          title="Bloquear"
                        >
                          <Lock size={18} />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDeleteSlot(slot.id)}
                        disabled={actionLoadingId === slot.id || !slot.isAvailable}
                        className="rounded-full bg-white p-2 text-[#E84545] transition hover:bg-[#E84545] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

function buildCalendarDays(
  currentMonth: Date,
  selectedDate: string
): CalendarDay[] {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const firstWeekDay = firstDayOfMonth.getDay();

  const startDate = new Date(year, month, 1 - firstWeekDay);

  const days: CalendarDay[] = [];

  for (let index = 0; index < 42; index++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);

    const isoDate = formatDateToIso(date);
    const todayIso = formatDateToIso(new Date());

    days.push({
      date,
      isoDate,
      dayNumber: date.getDate(),
      isCurrentMonth: date.getMonth() === month,
      isToday: isoDate === todayIso,
      isSelected: isoDate === selectedDate,
      isPast: isoDate < todayIso,
    });
  }

  return days;
}

function getCalendarDayClass(day: CalendarDay) {
  const baseClass =
    "flex min-h-14 flex-col items-center justify-center rounded-xl border text-sm font-semibold transition sm:min-h-16 md:min-h-[72px]";

  if (day.isPast) {
    return `${baseClass} cursor-not-allowed border-transparent bg-[#F7F3EA] text-[#333333]/25`;
  }

  if (day.isSelected) {
    return `${baseClass} border-[#E84545] bg-[#E84545] text-white shadow-sm`;
  }

  if (!day.isCurrentMonth) {
    return `${baseClass} border-transparent bg-[#F7F3EA] text-[#333333]/35 hover:border-[#3E8E91]/30 hover:text-[#333333]`;
  }

  return `${baseClass} border-[#3E8E91]/10 bg-white text-[#333333] hover:border-[#3E8E91] hover:bg-[#3E8E91]/5`;
}

function getStatusLabel(slot: AvailabilitySlot) {
  if (slot.isBlocked) return "Bloqueado";
  if (!slot.isAvailable) return "Ocupado";
  return "Disponível";
}

function getStatusClass(slot: AvailabilitySlot) {
  if (slot.isBlocked) return "bg-red-50 text-red-700";
  if (!slot.isAvailable) return "bg-yellow-50 text-yellow-700";
  return "bg-green-50 text-green-700";
}

function formatMonthTitle(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatSelectedDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

function formatDateToIso(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}