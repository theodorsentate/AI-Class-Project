import { safeLocal } from "@/lib/safe-storage";

export const START_KEY = "harbor-start-date-v1";
export const THOROUGH_KEY = "harbor-thorough-v1";

export function loadStartDate(): string {
  try {
    return safeLocal.getItem(START_KEY) ?? "";
  } catch {
    return "";
  }
}

export function saveStartDate(value: string): void {
  try {
    safeLocal.setItem(START_KEY, value);
  } catch {
    // Storage can be unavailable in private browsing.
  }
}

export function loadThorough(): boolean {
  try {
    return safeLocal.getItem(THOROUGH_KEY) !== "0";
  } catch {
    return true;
  }
}

export function saveThorough(on: boolean): void {
  try {
    safeLocal.setItem(THOROUGH_KEY, on ? "1" : "0");
  } catch {
    // Storage can be unavailable in private browsing.
  }
}
