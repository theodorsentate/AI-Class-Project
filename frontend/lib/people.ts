export type Person = {
  id: string;
  name: string;
  role: string;
  team: string;
  email: string;
  handles: string;
};

export const peopleNote =
  "Sample directory for Northshore Goods. Replace this file with your company list.";

export const people: Person[] = [
  {
    id: "jordan-hale",
    name: "Jordan Hale",
    role: "People Partner",
    team: "People Ops",
    email: "people@northshore.example",
    handles: "Pay, leave, benefits, workplace concerns, accommodations",
  },
  {
    id: "sam-ortiz",
    name: "Sam Ortiz",
    role: "IT Lead",
    team: "IT",
    email: "it@northshore.example",
    handles: "Laptops, accounts, MFA, lockouts, approved software",
  },
  {
    id: "alex-rivera",
    name: "Alex Rivera",
    role: "Onboarding buddy",
    team: "Operations",
    email: "alex.rivera@northshore.example",
    handles: "Unwritten norms, introductions, first-week questions",
  },
  {
    id: "priya-chen",
    name: "Priya Chen",
    role: "Site safety contact",
    team: "Operations",
    email: "safety@northshore.example",
    handles: "Building safety, after-hours issues, incident reports",
  },
  {
    id: "morgan-blake",
    name: "Morgan Blake",
    role: "Payroll Specialist",
    team: "People Ops",
    email: "people@northshore.example",
    handles: "Paycheck questions, timesheet corrections, expense reimbursement status",
  },
  {
    id: "taylor-brooks",
    name: "Taylor Brooks",
    role: "Learning and Development Partner",
    team: "People Ops",
    email: "people@northshore.example",
    handles: "Required training, the learning budget, internal moves and job postings",
  },
  {
    id: "casey-nguyen",
    name: "Casey Nguyen",
    role: "Security Analyst",
    team: "IT",
    email: "it@northshore.example",
    handles: "Phishing reports, suspected data incidents, lost or stolen devices",
  },
];
