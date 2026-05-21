/*
 * Tipo de resposta do agendamento criado pela API.
 */

export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "RESCHEDULED"
  | "CANCELLED"
  | "ATTENDED"
  | "MISSED"
  | "COMPLETED";

export type AppointmentResponse = {
  id: string;

  responsibleId: string;
  responsibleName: string;
  responsiblePhone: string;

  childId: string;
  childName: string;
  childAge: number;

  slotId: string;
  date: string;
  startTime: string;
  endTime: string;

  status: AppointmentStatus;
  notes?: string;
};