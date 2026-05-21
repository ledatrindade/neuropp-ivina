/*
 * Tipo que representa um horário disponível vindo da API.
 *
 * Ele acompanha a resposta do back-end:
 * GET /api/availability?date=...
 */
export type AvailabilitySlot = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  isBlocked: boolean;
};