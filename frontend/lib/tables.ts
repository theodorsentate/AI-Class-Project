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
    id: "key-deadlines",
    title: "Key new-hire deadlines",
    summary: "Counted in business days after your start date. These match the First week checklist.",
    columns: ["Task", "Due"],
    rows: [
      ["Turn on multi-factor authentication", "Business day 1"],
      ["Employment eligibility paperwork", "Business day 3"],
      ["Benefits enrollment", "Business day 10"],
    ],
  },
  {
    id: "money-limits",
    title: "Expense, gift, and budget limits",
    summary: "The dollar thresholds in the handbook, in one place.",
    columns: ["Item", "Limit or rule"],
    rows: [
      ["Receipt required", "Any expense over $25"],
      ["Manager approval before buying", "Any single purchase over $200"],
      ["Expense submission window", "Within 30 days"],
      ["Home office allowance (hybrid and remote)", "$250, one time"],
      ["Learning budget", "$500 per year"],
      ["Vendor or customer gifts", "Do not accept over $50; never cash or gift cards"],
      ["Employee discount", "25 percent off regular-priced products"],
    ],
  },
  {
    id: "leave-types",
    title: "Leave types",
    summary: "Who to tell and what to expect. People Ops confirms eligibility in writing.",
    columns: ["Leave", "First step", "Note"],
    rows: [
      ["Medical", "Write People Ops", "Clinician documentation may be requested and stays with People Ops"],
      ["Parental and family bonding", "Write People Ops early", "Length depends on location and tenure"],
      ["Caregiver", "Write People Ops", "Eligibility confirmed in writing"],
      ["Bereavement", "Tell your manager and People Ops", "3 paid days for an immediate family member"],
      ["Jury duty", "Tell People Ops with your notice", "Follows local law"],
      ["Military", "Write People Ops", "Follows local law"],
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
