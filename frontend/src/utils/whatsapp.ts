import type { AppointmentResponse } from "../types/appointment";
import { formatDateBR, formatTimeBR } from "./formatters";

/*
 * Utilitários para gerar mensagens de WhatsApp.
 *
 * MUDE O TEXTO AQUI:
 * As mensagens podem ser ajustadas conforme o tom da profissional.
 */

function onlyNumbers(value: string) {
  return value.replace(/\D/g, "");
}

export function buildWhatsappUrl(phone: string, message: string) {
  const cleanPhone = onlyNumbers(phone);

  const phoneWithCountryCode = cleanPhone.startsWith("55")
    ? cleanPhone
    : `55${cleanPhone}`;

  return `https://wa.me/${phoneWithCountryCode}?text=${encodeURIComponent(
    message
  )}`;
}

/*
 * Mensagem que o responsável pode copiar para guardar/enviar.
 */
export function createResponsibleConfirmationText(
  appointment: AppointmentResponse,
  address: string
) {
  return `Olá! Minha solicitação de agendamento com Ivina Peixoto foi registrada pelo site.

Responsável: ${appointment.responsibleName}
WhatsApp: ${appointment.responsiblePhone}
Criança: ${appointment.childName}
Data: ${formatDateBR(appointment.date)}
Horário: ${formatTimeBR(appointment.startTime)} às ${formatTimeBR(
    appointment.endTime
  )}
Local: ${address}

Fico no aguardo da confirmação.`;
}

/*
 * Mensagem que será enviada para Ivina pelo WhatsApp.
 */
export function createAdminNewAppointmentMessage(
  appointment: AppointmentResponse,
  address: string
) {
  return `Olá, Ivina Peixoto! Minha solicitação de agendamento foi registrada pelo site.

Responsável: ${appointment.responsibleName}
WhatsApp: ${appointment.responsiblePhone}
Criança: ${appointment.childName}
Data: ${formatDateBR(appointment.date)}
Horário: ${formatTimeBR(appointment.startTime)} às ${formatTimeBR(
    appointment.endTime
  )}
Local: ${address}

Fico no aguardo da confirmação.`;
}