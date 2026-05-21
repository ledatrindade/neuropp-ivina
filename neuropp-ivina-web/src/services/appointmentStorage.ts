import type { AvailabilitySlot } from "../types/availability";

/*
 * Serviço para guardar temporariamente o horário escolhido.
 *
 * Quando o usuário escolhe um horário no calendário,
 * salvamos no localStorage para usar na tela de confirmação.
 */

const SELECTED_SLOT_KEY = "neuropp_selected_slot";

export function saveSelectedSlot(slot: AvailabilitySlot) {
  localStorage.setItem(SELECTED_SLOT_KEY, JSON.stringify(slot));
}

export function getSelectedSlot(): AvailabilitySlot | null {
  const storedSlot = localStorage.getItem(SELECTED_SLOT_KEY);

  if (!storedSlot) {
    return null;
  }

  try {
    return JSON.parse(storedSlot) as AvailabilitySlot;
  } catch {
    return null;
  }
}

export function clearSelectedSlot() {
  localStorage.removeItem(SELECTED_SLOT_KEY);
}