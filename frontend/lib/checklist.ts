import type { ChecklistItem } from "./types";

export const CHECKLIST_KEY = "harbor-checklist-v1";

export const defaultChecklist: ChecklistItem[] = [
  {
    id: "eligibility",
    title: "Finish employment eligibility paperwork",
    detail:
      "Bring the documents People Ops listed in your offer packet. This is required before you are paid.",
    owner: "You",
    dueBusinessDay: 3,
  },
  {
    id: "access",
    title: "Turn on email, chat, and multi-factor sign-in",
    detail:
      "IT sends a first-login email. If it did not arrive, ask this assistant or write IT directly. You do not need your manager for access issues.",
    owner: "IT",
    dueBusinessDay: 1,
  },
  {
    id: "handbook",
    title: "Read the handbook articles in this tool",
    detail:
      "Pay, time off, equipment, and respectful workplace are the four to finish in week one.",
    owner: "You",
  },
  {
    id: "buddy",
    title: "Book a 20-minute intro with your onboarding buddy",
    detail:
      "Your buddy is a peer, not your manager. Use them for unwritten norms: lunch, tools, and who actually owns what.",
    owner: "You",
  },
  {
    id: "timekeeping",
    title: "Confirm how hours or time off are recorded",
    detail:
      "Wrong timekeeping is a common first-month mistake. The handbook explains the steps in plain language.",
    owner: "People Ops",
  },
  {
    id: "benefits",
    title: "Note your benefits enrollment deadline",
    detail:
      "Many plans lock after a short window. Open the Benefits article even if you are not ready to choose yet.",
    owner: "People Ops",
    dueBusinessDay: 10,
  },
  {
    id: "private-question",
    title: "Ask one question in Ask privately",
    detail:
      "Practice using this tool. Confidential questions are not routed to your manager.",
    owner: "You",
  },
];
