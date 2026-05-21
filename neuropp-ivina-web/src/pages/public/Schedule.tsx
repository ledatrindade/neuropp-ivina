import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
} from "lucide-react";
import { siteContent } from "../../content/siteContent";
import { apiRequest } from "../../services/api";
import { isAuthenticated } from "../../services/authStorage";
import { saveSelectedSlot } from "../../services/appointmentStorage";
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

export function Schedule() {
  const navigate = useNavigate();

  const today = useMemo(() => new Date(), []);

  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const [selectedDate, setSelectedDate] = useState(formatDateToIso(today));
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(
    null
  );

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const calendarDays = useMemo(() => {
    return buildCalendarDays(currentMonth, selectedDate);
  }, [currentMonth, selectedDate]);

  useEffect(() => {
    searchAvailabilityByDate(selectedDate);
  }, [selectedDate]);

  async function searchAvailabilityByDate(date: string) {
    try {
      setIsLoading(true);
      setErrorMessage("");
      setSelectedSlot(null);

      const response = await apiRequest<AvailabilitySlot[]>(
        `/availability?date=${date}`
      );

      setSlots(response);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível buscar os horários disponíveis.";

      setErrorMessage(message);
      setSlots([]);
    } finally {
      setIsLoading(false);
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

  function goToToday() {
    const todayDate = new Date();

    setCurrentMonth(
      new Date(todayDate.getFullYear(), todayDate.getMonth(), 1)
    );

    setSelectedDate(formatDateToIso(todayDate));
  }

  function handleSelectDay(day: CalendarDay) {
    if (day.isPast) {
      return;
    }

    setSelectedDate(day.isoDate);

    if (!day.isCurrentMonth) {
      setCurrentMonth(new Date(day.date.getFullYear(), day.date.getMonth(), 1));
    }
  }

  function handleSelectSlot(slot: AvailabilitySlot) {
    setSelectedSlot(slot);
  }

  function handleContinueToConfirmation() {
    if (!selectedSlot) {
      setErrorMessage("Selecione um horário antes de continuar.");
      return;
    }

    saveSelectedSlot(selectedSlot);

    if (!isAuthenticated()) {
      navigate("/login?redirect=/confirmar-agendamento");
      return;
    }

    navigate("/confirmar-agendamento");
  }

  function formatTime(time: string) {
    return time.slice(0, 5);
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 md:px-5 md:py-10">
      <section className="mb-8">
        <span className="mb-4 inline-flex rounded-full bg-[#3E8E91]/10 px-4 py-2 text-sm font-semibold text-[#3E8E91]">
          Agendamento online
        </span>

        <h1 className="text-4xl font-bold text-[#3E8E91] md:text-5xl">
          {siteContent.schedule.title}
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-[#333333]/75">
          {siteContent.schedule.description}
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl bg-white p-4 shadow-sm md:p-6">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3E8E91]">
                CALENDÁRIO
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#333333]">
                {formatMonthTitle(currentMonth)}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goToToday}
                className="rounded-full border border-[#3E8E91]/20 px-4 py-2 text-sm font-semibold text-[#3E8E91] transition hover:bg-[#3E8E91] hover:text-white"
              >
                Hoje
              </button>

              <button
                type="button"
                onClick={goToPreviousMonth}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#3E8E91]/20 text-[#3E8E91] transition hover:bg-[#3E8E91] hover:text-white"
                aria-label="Mês anterior"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                type="button"
                onClick={goToNextMonth}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#3E8E91]/20 text-[#3E8E91] transition hover:bg-[#3E8E91] hover:text-white"
                aria-label="Próximo mês"
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

          <div className="mt-6 rounded-2xl bg-[#F7F3EA] p-4 text-sm leading-6 text-[#333333]/70">
            {siteContent.schedule.notice}
          </div>
        </div>

        <aside className="rounded-3xl bg-white p-4 shadow-sm md:p-6">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#3E8E91]/10 text-[#3E8E91]">
              <CalendarDays size={24} />
            </span>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3E8E91]">
                Data selecionada
              </p>

              <h2 className="mt-1 text-2xl font-bold text-[#333333]">
                {formatSelectedDate(selectedDate)}
              </h2>
            </div>
          </div>

          {isLoading && (
            <div className="mt-8 flex items-center gap-3 rounded-2xl bg-[#F7F3EA] p-5 text-[#333333]/70">
              <Loader2 className="animate-spin text-[#3E8E91]" size={22} />
              Buscando horários disponíveis...
            </div>
          )}

          {errorMessage && (
            <div className="mt-8 rounded-2xl bg-red-50 p-5 text-sm font-medium text-red-700">
              {errorMessage}
            </div>
          )}

          {!isLoading && !errorMessage && slots.length === 0 && (
            <div className="mt-8 rounded-2xl bg-[#F7F3EA] p-5 text-[#333333]/70">
              Nenhum horário disponível para esta data.
            </div>
          )}

          {slots.length > 0 && (
            <div className="mt-8 space-y-3">
              <p className="font-semibold text-[#333333]">
                Escolha um horário:
              </p>

              {slots.map((slot) => {
                const isSelected = selectedSlot?.id === slot.id;

                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => handleSelectSlot(slot)}
                    className={`w-full rounded-3xl border p-5 text-left transition ${
                      isSelected
                        ? "border-[#E84545] bg-[#E84545]/10"
                        : "border-[#3E8E91]/10 bg-[#F7F3EA] hover:border-[#3E8E91]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#3E8E91]">
                        <Clock size={22} />
                      </span>

                      <div>
                        <p className="font-bold text-[#333333]">
                          {formatTime(slot.startTime)} às{" "}
                          {formatTime(slot.endTime)}
                        </p>

                        <p className="text-sm text-[#333333]/60">
                          Atendimento presencial
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {selectedSlot && (
            <div className="mt-8 rounded-3xl border border-[#3E8E91]/10 bg-[#F7F3EA] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3E8E91]">
                Horário selecionado
              </p>

              <h3 className="mt-3 text-xl font-bold text-[#333333]">
                {formatTime(selectedSlot.startTime)} às{" "}
                {formatTime(selectedSlot.endTime)}
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#333333]/70">
                Na próxima etapa, você poderá informar os dados da criança e
                confirmar o agendamento.
              </p>

              <button
                type="button"
                onClick={handleContinueToConfirmation}
                className="mt-5 w-full rounded-full bg-[#E84545] px-6 py-3 font-semibold text-white transition hover:brightness-95"
              >
                {isAuthenticated()
                  ? "Continuar para confirmação"
                  : "Entrar/cadastrar para continuar"}
              </button>
            </div>
          )}
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