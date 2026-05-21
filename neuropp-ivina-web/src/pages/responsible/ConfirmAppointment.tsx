import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { CalendarCheck, CalendarDays, Clock, Loader2 } from "lucide-react";
import { apiRequest } from "../../services/api";
import { getAuthToken, isAuthenticated } from "../../services/authStorage";
import {
  clearSelectedSlot,
  getSelectedSlot,
} from "../../services/appointmentStorage";
import type { AvailabilitySlot } from "../../types/availability";
import type { ChildResponse } from "../../types/child";
import type { AppointmentResponse } from "../../types/appointment";

export function ConfirmAppointment() {
  const navigate = useNavigate();

  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(
    null
  );

  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("");
  const [notes, setNotes] = useState("");

  const [createdAppointment, setCreatedAppointment] =
    useState<AppointmentResponse | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login?redirect=/confirmar-agendamento");
      return;
    }

    const slot = getSelectedSlot();

    setSelectedSlot(slot);
  }, [navigate]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedSlot) {
      setErrorMessage("Nenhum horário foi selecionado.");
      return;
    }

    if (!childName.trim()) {
      setErrorMessage("Informe o nome da criança.");
      return;
    }

    if (!childAge || Number(childAge) < 0 || Number(childAge) > 17) {
      setErrorMessage("Informe uma idade válida entre 0 e 17 anos.");
      return;
    }

    const token = getAuthToken();

    if (!token) {
      navigate("/login?redirect=/confirmar-agendamento");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");

      const child = await apiRequest<ChildResponse>("/children/my", {
        method: "POST",
        token,
        body: {
          name: childName,
          age: Number(childAge),
        },
      });

      const appointment = await apiRequest<AppointmentResponse>(
        "/appointments/my",
        {
          method: "POST",
          token,
          body: {
            childId: child.id,
            slotId: selectedSlot.id,
            notes,
          },
        }
      );

      setCreatedAppointment(appointment);
      clearSelectedSlot();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível confirmar o agendamento.";

      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }

  function formatTime(time: string) {
    return time.slice(0, 5);
  }

  if (!selectedSlot && !createdAppointment) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-16">
        <section className="rounded-[2rem] bg-white p-8 text-center shadow-sm">
          <CalendarDays className="mx-auto text-[#3E8E91]" size={42} />

          <h1 className="mt-4 text-3xl font-bold text-[#333333]">
            Nenhum horário selecionado
          </h1>

          <p className="mt-3 leading-7 text-[#333333]/70">
            Volte para a página de agendamento e escolha um horário disponível.
          </p>

          <Link
            to="/agendar"
            className="mt-6 inline-flex rounded-full bg-[#E84545] px-6 py-3 font-semibold text-white transition hover:brightness-95"
          >
            Escolher horário
          </Link>
        </section>
      </main>
    );
  }

  if (createdAppointment) {
    return (
      <main className="mx-auto max-w-4xl px-5 py-16">
        <section className="rounded-[2rem] bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-start">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#3E8E91]/10 text-[#3E8E91]">
              <CalendarCheck size={30} />
            </span>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3E8E91]">
                Agendamento confirmado
              </p>

              <h1 className="mt-2 text-3xl font-bold text-[#333333]">
                Avaliação marcada com sucesso
              </h1>

              <p className="mt-3 leading-7 text-[#333333]/70">
                Seu agendamento foi registrado no sistema. Guarde as informações
                abaixo.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <InfoCard label="Responsável" value={createdAppointment.responsibleName} />
            <InfoCard label="Criança" value={createdAppointment.childName} />
            <InfoCard label="Data" value={createdAppointment.date} />
            <InfoCard
              label="Horário"
              value={`${formatTime(createdAppointment.startTime)} às ${formatTime(
                createdAppointment.endTime
              )}`}
            />
            <InfoCard label="Status" value={createdAppointment.status} />
          </div>

          <div className="mt-8 rounded-3xl bg-[#F7F3EA] p-5 text-sm leading-7 text-[#333333]/70">
            {/* MUDE O TEXTO AQUI */}
            Em breve, esta tela também poderá gerar uma mensagem automática para
            WhatsApp confirmando data e horário do atendimento.
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/agendar"
              className="inline-flex justify-center rounded-full border border-[#3E8E91] px-6 py-3 font-semibold text-[#3E8E91] transition hover:bg-[#3E8E91] hover:text-white"
            >
              Marcar outro horário
            </Link>

            <Link
              to="/"
              className="inline-flex justify-center rounded-full bg-[#E84545] px-6 py-3 font-semibold text-white transition hover:brightness-95"
            >
              Voltar para início
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-12">
      <section className="mb-8">
        <span className="mb-4 inline-flex rounded-full bg-[#3E8E91]/10 px-4 py-2 text-sm font-semibold text-[#3E8E91]">
          Confirmação
        </span>

        <h1 className="text-4xl font-bold text-[#3E8E91] md:text-5xl">
          Confirmar avaliação
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-[#333333]/75">
          Informe os dados da criança para concluir o agendamento.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="rounded-[2rem] bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3E8E91]">
            Horário escolhido
          </p>

          <div className="mt-5 flex items-center gap-3 rounded-3xl bg-[#F7F3EA] p-5">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#3E8E91]">
              <Clock size={24} />
            </span>

            <div>
              <h2 className="font-bold text-[#333333]">
                {selectedSlot?.date}
              </h2>

              <p className="text-sm text-[#333333]/70">
                {selectedSlot
                  ? `${formatTime(selectedSlot.startTime)} às ${formatTime(
                      selectedSlot.endTime
                    )}`
                  : ""}
              </p>
            </div>
          </div>

          <p className="mt-5 text-sm leading-7 text-[#333333]/70">
            {/* MUDE O TEXTO AQUI */}
            O cadastro deve ser feito pelo responsável da criança. Após a
            confirmação, o horário ficará indisponível para outras pessoas.
          </p>
        </aside>

        <section className="rounded-[2rem] bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="childName"
                className="mb-2 block text-sm font-semibold text-[#333333]"
              >
                Nome da criança
              </label>

              <input
                id="childName"
                type="text"
                value={childName}
                onChange={(event) => setChildName(event.target.value)}
                placeholder="Digite o nome da criança"
                className="w-full rounded-2xl border border-[#3E8E91]/20 bg-[#F7F3EA] px-4 py-3 outline-none transition focus:border-[#3E8E91]"
              />
            </div>

            <div>
              <label
                htmlFor="childAge"
                className="mb-2 block text-sm font-semibold text-[#333333]"
              >
                Idade da criança
              </label>

              <input
                id="childAge"
                type="number"
                min="0"
                max="17"
                value={childAge}
                onChange={(event) => setChildAge(event.target.value)}
                placeholder="Ex: 8"
                className="w-full rounded-2xl border border-[#3E8E91]/20 bg-[#F7F3EA] px-4 py-3 outline-none transition focus:border-[#3E8E91]"
              />
            </div>

            <div>
              <label
                htmlFor="notes"
                className="mb-2 block text-sm font-semibold text-[#333333]"
              >
                Observações iniciais
              </label>

              <textarea
                id="notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Conte brevemente o motivo da busca, se desejar."
                rows={5}
                className="w-full resize-none rounded-2xl border border-[#3E8E91]/20 bg-[#F7F3EA] px-4 py-3 outline-none transition focus:border-[#3E8E91]"
              />
            </div>

            {errorMessage && (
              <div className="rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-700">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#E84545] px-6 py-3 font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Confirmando...
                </>
              ) : (
                <>
                  <CalendarCheck size={20} />
                  Confirmar agendamento
                </>
              )}
            </button>
          </form>
        </section>
      </section>
    </main>
  );
}

type InfoCardProps = {
  label: string;
  value: string;
};

function InfoCard({ label, value }: InfoCardProps) {
  return (
    <div className="rounded-3xl bg-[#F7F3EA] p-5">
      <p className="text-sm font-semibold text-[#3E8E91]">{label}</p>
      <p className="mt-2 font-bold text-[#333333]">{value}</p>
    </div>
  );
}