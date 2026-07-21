import type { AvailabilitySlot } from "../types/availability";

const SELECTED_SLOT_KEY = "neuropp_selected_slot";
const MAX_AGE_MS = 30 * 60 * 1000;

type StoredSlot = {
  slot: AvailabilitySlot;
  savedAt: number;
};

export function saveSelectedSlot(slot: AvailabilitySlot) {
  const value: StoredSlot = { slot, savedAt: Date.now() };
  sessionStorage.setItem(SELECTED_SLOT_KEY, JSON.stringify(value));
}

export function getSelectedSlot(): AvailabilitySlot | null {
  const stored = sessionStorage.getItem(SELECTED_SLOT_KEY);
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored) as StoredSlot;
    if (!parsed.slot?.id || Date.now() - parsed.savedAt > MAX_AGE_MS) {
      clearSelectedSlot();
      return null;
    }
    return parsed.slot;
  } catch {
    clearSelectedSlot();
    return null;
  }
}

export function clearSelectedSlot() {
  sessionStorage.removeItem(SELECTED_SLOT_KEY);
}
