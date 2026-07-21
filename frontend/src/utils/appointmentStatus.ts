import type { AppointmentStatus } from "../types/appointment";

export const appointmentStatusLabels: Record<AppointmentStatus, string> = {
  PENDING: "Aguardando confirmação",
  CONFIRMED: "Confirmado",
  RESCHEDULED: "Reagendado",
  CANCELLED: "Cancelado",
  ATTENDED: "Compareceu",
  MISSED: "Faltou",
  COMPLETED: "Concluído",
};

export const appointmentStatusClasses: Record<AppointmentStatus, string> = {
  PENDING: "bg-slate-100 text-slate-700",
  CONFIRMED: "bg-blue-50 text-blue-700",
  RESCHEDULED: "bg-purple-50 text-purple-700",
  CANCELLED: "bg-red-50 text-red-700",
  ATTENDED: "bg-green-50 text-green-700",
  MISSED: "bg-amber-50 text-amber-700",
  COMPLETED: "bg-[#3E8E91]/10 text-[#3E8E91]",
};

export const terminalStatuses: AppointmentStatus[] = ["CANCELLED", "MISSED", "COMPLETED"];

export function adminTransitions(status: AppointmentStatus): AppointmentStatus[] {
  const map: Record<AppointmentStatus, AppointmentStatus[]> = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["ATTENDED", "MISSED", "CANCELLED"],
    RESCHEDULED: ["CONFIRMED", "CANCELLED"],
    ATTENDED: ["COMPLETED"],
    CANCELLED: [],
    MISSED: [],
    COMPLETED: [],
  };
  return map[status];
}
