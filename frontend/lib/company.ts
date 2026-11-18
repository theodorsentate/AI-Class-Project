import type { CompanyProfile } from "./types";
import { safeLocal } from "@/lib/safe-storage";

export const STORAGE_KEY = "harbor-company-v1";

export const defaultCompany: CompanyProfile = {
  name: "Lumenfield",
  industry: "Software (sample company)",
  peopleEmail: "people@lumenfield.example",
  itEmail: "it@lumenfield.example",
  ethicsHotline: "1-800-555-0142",
  buddyName: "Marcus Hill",
  workHours: "Monday to Friday, 8:30 to 17:30 Central",
  hireName: "Jordan Reyes",
  hireRole: "Sales Development Representative, Mid-Market pod",
};

export function loadCompany(): CompanyProfile {
  if (typeof window === "undefined") {
    return defaultCompany;
  }
  const raw = safeLocal.getItem(STORAGE_KEY);
  if (!raw) {
    return defaultCompany;
  }
  return { ...defaultCompany, ...JSON.parse(raw) };
}

export function saveCompany(profile: CompanyProfile): void {
  safeLocal.setItem(STORAGE_KEY, JSON.stringify(profile));
}
