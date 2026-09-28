import type { CompanyProfile } from "./types";

export const STORAGE_KEY = "harbor-company-v1";

export const defaultCompany: CompanyProfile = {
  name: "Northshore Goods",
  industry: "Retail and operations",
  peopleEmail: "people@northshore.example",
  itEmail: "it@northshore.example",
  ethicsHotline: "1-800-555-0142",
  buddyName: "Alex Rivera",
  workHours: "Monday to Friday, 9:00 to 17:30 local time",
};

export function loadCompany(): CompanyProfile {
  if (typeof window === "undefined") {
    return defaultCompany;
  }
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return defaultCompany;
  }
  return { ...defaultCompany, ...JSON.parse(raw) };
}

export function saveCompany(profile: CompanyProfile): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}
