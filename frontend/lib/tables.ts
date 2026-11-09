export type LookupTable = {
  id: string;
  title: string;
  summary: string;
  columns: string[];
  rows: string[][];
};

export const tablesNote =
  "Sample lookup tables for Northshore Goods. Replace this file with your company data.";

export const tables: LookupTable[] = [
  {
    id: "holidays",
    title: "Holidays",
    summary: "Company-observed holidays listed in the Northshore handbook.",
    columns: ["Date", "Holiday"],
    rows: [
      ["2026-01-01", "New Year's Day"],
      ["2026-05-25", "Memorial Day"],
      ["2026-07-04", "Independence Day"],
      ["2026-09-07", "Labor Day"],
      ["2026-11-26", "Thanksgiving"],
      ["2026-12-25", "Christmas Day"],
    ],
  },
  {
    id: "pay-dates",
    title: "Pay dates",
    summary: "Biweekly Fridays. Confirm exceptions with People Ops.",
    columns: ["Pay date", "Period ending"],
    rows: [
      ["2026-11-13", "2026-11-07"],
      ["2026-11-27", "2026-11-21"],
      ["2026-12-11", "2026-12-05"],
    ],
  },
  {
    id: "benefits",
    title: "Benefits plans",
    summary: "High-level comparison. Enrollment is due by business day 10.",
    columns: ["Plan", "What it covers"],
    rows: [
      ["Medical A", "In-network primary care copay"],
      ["Dental", "Preventive visits twice a year"],
      ["401(k)", "Employee contribution with company match described in the offer packet"],
    ],
  },
  {
    id: "external-contacts",
    title: "External contacts",
    summary: "Numbers a new hire can use without a manager.",
    columns: ["Name", "Use for", "Phone"],
    rows: [
      ["Employee Assistance Program", "Confidential counseling", "1-800-555-0199"],
      ["Ethics hotline", "Illegal, unsafe, or unethical conduct", "1-800-555-0142"],
    ],
  },
];
