import type { ChecklistItem } from "./types";

export const CHECKLIST_KEY = "harbor-checklist-v1";

export const defaultChecklist: ChecklistItem[] = [
  {
    id: "access",
    articleId: "it-setup",
    askTopic: "lockout",
    title: "Turn on email, Slack and multi-factor sign-in",
    detail:
      "IT sends a first-login email. If it did not arrive, ask this assistant or write IT directly. You do not need your manager for access issues.",
    owner: "IT",
    dueBusinessDay: 1,
  },
  {
    id: "eligibility",
    articleId: "first-day",
    askTopic: "paycheck",
    title: "Finish employment eligibility paperwork",
    detail:
      "Bring the documents People Ops listed in your offer packet. This is required before you are paid.",
    owner: "You",
    dueBusinessDay: 3,
  },
  {
    id: "buddy",
    articleId: "who-to-ask",
    title: "Book a 20-minute intro with Marcus, your onboarding buddy",
    detail:
      "Marcus is a peer, not your manager. Ask him about unwritten norms: call blocks, who to ask in Slack, and which accounts to start with.",
    owner: "You",
  },
  {
    id: "certification",
    articleId: "first-day",
    askTopic: "certification",
    title: "Complete the CRM and call-tools certification",
    detail:
      "Sales Enablement runs it. You need it before you start your own cadences. Book your slot in week one.",
    owner: "Sales Enablement",
    dueBusinessDay: 5,
  },
  {
    id: "accounts",
    articleId: "icp-territory",
    askTopic: "territory",
    title: "Review your account list with your manager",
    detail:
      "Priya and RevOps assign your Mid-Market accounts in the CRM. Check that you can see them and ask which to start with.",
    owner: "Your manager",
    dueBusinessDay: 5,
  },
  {
    id: "shadow",
    articleId: "coaching",
    title: "Shadow five live calls with senior SDRs",
    detail:
      "Listen first, then take notes in the CRM. Note one thing you would repeat and one thing you would change.",
    owner: "You",
    dueBusinessDay: 5,
  },
  {
    id: "benefits",
    articleId: "benefits",
    askTopic: "benefits",
    title: "Note your benefits enrollment deadline",
    detail:
      "Plans lock after a short window. Open the Benefits article even if you are not ready to choose yet.",
    owner: "People Ops",
    dueBusinessDay: 10,
  },
  {
    id: "private-question",
    articleId: "skip-manager",
    title: "Ask one question in Ask privately",
    detail:
      "Practice using this tool. Confidential questions are not routed to your manager.",
    owner: "You",
  },
];
