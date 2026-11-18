export type Person = {
  id: string;
  name: string;
  role: string;
  team: string;
  email: string;
  handles: string;
};

export const peopleNote =
  "Sample directory for Lumenfield, a fictional company. All names are invented. Replace this file with your company list.";

export const people: Person[] = [
  {
    id: "priya-natarajan",
    name: "Priya Natarajan",
    role: "SDR Manager",
    team: "Sales Development",
    email: "priya.natarajan@lumenfield.example",
    handles: "Your 1:1s, quota, coaching, territory and credit decisions, time-off approval",
  },
  {
    id: "marcus-hill",
    name: "Marcus Hill",
    role: "Senior SDR and onboarding buddy",
    team: "Sales Development",
    email: "marcus.hill@lumenfield.example",
    handles: "Unwritten norms, call shadowing, first-week questions, introductions",
  },
  {
    id: "dana-whitfield",
    name: "Dana Whitfield",
    role: "People Partner",
    team: "People Ops",
    email: "people@lumenfield.example",
    handles: "Pay, leave, benefits, accommodations, workplace concerns, internal moves",
  },
  {
    id: "sam-okafor",
    name: "Sam Okafor",
    role: "IT Lead",
    team: "IT",
    email: "it@lumenfield.example",
    handles: "Laptops, accounts, MFA, lockouts, approved software, phishing and lost devices",
  },
  {
    id: "leah-brooks",
    name: "Leah Brooks",
    role: "Sales Enablement Lead",
    team: "Sales Enablement",
    email: "enablement@lumenfield.example",
    handles: "Certifications, call library, templates, messaging, AE shadow program, learning budget",
  },
  {
    id: "tomas-ibarra",
    name: "Tomás Ibarra",
    role: "Revenue Operations Analyst",
    team: "RevOps",
    email: "revops@lumenfield.example",
    handles: "CRM fields, territories, lead routing, meeting credit, reports",
  },
  {
    id: "anita-shah",
    name: "Anita Shah",
    role: "Legal and Compliance Counsel",
    team: "Legal",
    email: "compliance@lumenfield.example",
    handles: "Do-not-call and opt-outs, call recording, what you can say, gifts and conflicts",
  },
];
