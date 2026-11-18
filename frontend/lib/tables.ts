export type LookupTable = {
  id: string;
  title: string;
  summary: string;
  columns: string[];
  rows: string[][];
};

export const tablesNote =
  "Sample lookup tables for Lumenfield, a fictional company. All figures are invented. Replace this file with your company data.";

export const tables: LookupTable[] = [
  {
    id: "key-deadlines",
    title: "Key new-hire deadlines",
    summary: "Counted in business days after your start date. These match the First week checklist.",
    columns: ["Task", "Due"],
    rows: [
      ["Turn on multi-factor authentication", "Business day 1"],
      ["Employment eligibility paperwork", "Business day 3"],
      ["CRM and call-tools certification", "Business day 5"],
      ["Benefits enrollment", "Business day 10"],
    ],
  },
  {
    id: "ramp-quota",
    title: "Ramp and quota (sample)",
    summary: "Meetings held per month. Your offer letter has the plan that applies to you.",
    columns: ["Month", "Quota (meetings held)", "Share of full quota"],
    rows: [
      ["Month 1", "0", "0 percent, learning"],
      ["Month 2", "6", "50 percent"],
      ["Month 3", "9", "75 percent"],
      ["Month 4 and after", "12", "100 percent"],
    ],
  },
  {
    id: "activity-targets",
    title: "Daily activity targets at full ramp",
    summary: "Ramp months run at 50 percent and 75 percent of these.",
    columns: ["Activity", "Per day"],
    rows: [
      ["Dials", "60"],
      ["Personalized emails", "40"],
      ["LinkedIn touches", "20"],
    ],
  },
  {
    id: "pay-dates",
    title: "Pay dates",
    summary: "Base pay on the 15th and the last business day. Commission is paid on the 15th of the following month.",
    columns: ["Pay date", "What is paid"],
    rows: [
      ["2026-11-30", "Base pay"],
      ["2026-12-15", "Base pay and November commission"],
      ["2026-12-31", "Base pay"],
      ["2027-01-15", "Base pay and December commission"],
    ],
  },
  {
    id: "holidays",
    title: "Company holidays",
    summary: "Paid days off that do not use PTO.",
    columns: ["Date", "Holiday"],
    rows: [
      ["2026-11-26", "Thanksgiving"],
      ["2026-11-27", "Day after Thanksgiving"],
      ["2026-12-24", "Winter break"],
      ["2026-12-25", "Christmas Day"],
      ["2027-01-01", "New Year's Day"],
      ["2027-05-31", "Memorial Day"],
      ["2027-07-05", "Independence Day (observed)"],
      ["2027-09-06", "Labor Day"],
    ],
  },
  {
    id: "benefits",
    title: "Benefits plans",
    summary: "High-level comparison. Enrollment is due by business day 10.",
    columns: ["Plan", "What it covers"],
    rows: [
      ["Medical", "In-network primary care copay and preventive care"],
      ["Dental", "Preventive visits twice a year"],
      ["Vision", "Yearly eye exam and a frame or lens allowance"],
      ["401(k)", "Company match of up to 4 percent of pay"],
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
      ["Referral bonus", "$2,000 after the new hire completes 90 days"],
    ],
  },
  {
    id: "leave-types",
    title: "Leave types",
    summary: "Who to tell and what to expect. People Ops confirms eligibility in writing.",
    columns: ["Leave", "First step", "Note"],
    rows: [
      ["Sick days", "Message your manager and pod by 8:45", "5 paid days per year"],
      ["Medical", "Write People Ops", "Clinician documentation may be requested and stays with People Ops"],
      ["Parental and family bonding", "Write People Ops early", "Up to 12 weeks paid"],
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
