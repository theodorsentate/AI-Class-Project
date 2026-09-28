import type { Article } from "./types";

export const articles: Article[] = [
  {
    id: "first-day",
    title: "Your first day and first week",
    category: "Getting started",
    tags: ["first day", "week one", "schedule", "badge", "lunch"],
    summary: "Where to go, who to meet, and what “done” looks like after five days.",
    body: "Arrive at the time in your offer letter. Check in at reception or with the person named in your welcome email. You will get a badge or remote login, a desk or home setup list, and a short tour of the tools we use. Week one success is simple: access works, paperwork is in, you know how to record time, and you have asked at least one question in this assistant. Meals, breaks, and building access follow local site rules posted on the intranet. If nobody is free when you arrive, write IT or People Ops from this tool. You do not need to wait on your manager to start.",
  },
  {
    id: "skip-manager",
    title: "Questions you do not have to take to your manager",
    category: "How this tool works",
    tags: ["manager", "private", "hr", "people ops", "confidential", "awkward"],
    summary: "Use this assistant, People Ops, IT, or the hotline when a manager is the wrong first stop.",
    body: "You are not required to ask your manager about pay, benefits, medical leave, accommodations, interpersonal conflict, ethics, or IT lockouts. This assistant answers from the company handbook. Ask privately keeps the chat on your device unless you choose to send an escalation. People Ops and IT exist so routine and sensitive topics are not blocked by one person. If your manager is the subject of the question, skip them and use People Ops or the ethics hotline. Your job is not at risk for using the official channels described here.",
  },
  {
    id: "pay",
    title: "Pay, timesheets, and corrections",
    category: "Pay and time",
    tags: ["pay", "payroll", "timesheet", "direct deposit", "overtime", "wage"],
    summary: "When you are paid, how to record hours, and how to fix a mistake without a confrontation.",
    body: "Pay dates and direct deposit are in your offer packet and the payroll article on the intranet. Hourly staff submit timesheets by the local deadline; salaried staff confirm exceptions only. Overtime follows the law for your location and role. If a paycheck looks wrong, write People Ops with the date and the amount you expected. Do not wait for a 1:1. Payroll errors are operations issues, not a personal dispute with your manager. Keep a copy of submitted hours until the correction appears.",
  },
  {
    id: "time-off",
    title: "Time off, sick days, and holidays",
    category: "Pay and time",
    tags: ["pto", "vacation", "sick", "leave", "holiday", "time off"],
    summary: "How to request leave and what happens if you are unwell on a workday.",
    body: "Request planned time off in the timekeeping system as early as you can. Sick time is for when you cannot work safely or well; log it when you return or the same day if the system allows. Company holidays are listed on the intranet calendar. Parental, medical, and legally protected leave is handled by People Ops, not informal manager deals. If you are unsure which bucket applies, ask this assistant or email People Ops. A manager can plan coverage; they do not invent the policy.",
  },
  {
    id: "benefits",
    title: "Benefits enrollment",
    category: "People Ops",
    tags: ["benefits", "health", "insurance", "401k", "retirement", "deadline"],
    summary: "Health, retirement, and related plans, including the deadline that is easy to miss.",
    body: "New hires usually have a short window after the start date to elect medical, dental, vision, and retirement contributions. Missing the window can mean waiting until the next open enrollment unless a qualifying life event applies. Plan summaries live with People Ops. This assistant will not choose a plan for you. It will tell you who to email and what documents you need. Beneficiaries and dependents should be updated in the same portal you used to enroll.",
  },
  {
    id: "it-setup",
    title: "Accounts, devices, and lockouts",
    category: "IT",
    tags: ["it", "password", "mfa", "laptop", "email", "vpn", "lockout", "locked", "software"],
    summary: "First login, lost passwords, approved software, and who resets access.",
    body: "IT provisions email, chat, and VPN. Turn on multi-factor authentication the first day. If you are locked out, use the password portal or email IT from a personal address listed in your file. Managers cannot reset most credentials. Only approved software may be installed; request new tools through IT. Lost or stolen devices must be reported to IT the same day. Home office equipment follows the remote work article if your role is hybrid or remote.",
  },
  {
    id: "respectful-workplace",
    title: "Respectful workplace and reporting harm",
    category: "Safety and ethics",
    tags: ["harassment", "discrimination", "bully", "retaliation", "ethics", "hotline"],
    summary: "How to report harassment or discrimination without going through your manager.",
    body: "Harassment, discrimination, and retaliation are prohibited. Report to People Ops or the ethics hotline. You may skip your manager, especially if they are involved. Retaliation for a good-faith report is itself a violation. If you are in immediate danger, contact local emergency services first. This assistant will always surface the hotline for these topics. You do not need a perfect story before you write; dates, names, and what happened are enough to start.",
  },
  {
    id: "accommodations",
    title: "Disability and workplace accommodations",
    category: "People Ops",
    tags: ["accommodation", "disability", "access", "medical", "ergonomic"],
    summary: "How to request a change to your work setup or schedule for a health need.",
    body: "Accommodation requests go to People Ops. You do not have to disclose a diagnosis to your manager. Describe the barrier at work and the change that would help. People Ops may ask for documentation from a clinician. Ergonomic equipment is requested through IT after People Ops agrees, unless it is a standard supply. Interactive process means you will be asked questions; it is not a refusal. Deadlines and privacy follow local employment law.",
  },
  {
    id: "hybrid-work",
    title: "On-site, hybrid, and remote norms",
    category: "How we work",
    tags: ["remote", "hybrid", "office", "hours", "timezone"],
    summary: "Where you work, core hours, and how to be reachable without guessing.",
    body: "Your offer letter states your location model. Core hours and time zone are set in company setup so this assistant can repeat them. Hybrid roles should be on site the days your team published. Remote roles still attend scheduled meetings and keep chat status honest. If travel or a schedule change is needed, use the time-off or People Ops path, not an informal chat that never gets recorded.",
  },
  {
    id: "first-90",
    title: "The first 90 days",
    category: "Getting started",
    tags: ["probation", "90 days", "review", "goals", "training"],
    summary: "What “settling in” includes besides doing assigned tasks.",
    body: "The first 90 days are for learning the work, the tools, and the people. You should know who owns quality, who owns customers or internal users, and how work is requested. Training assigned in your checklist is required. A 30/60/90 conversation is normal; it is not only criticism. If you are missing access or training, log it here or with IT so the delay is visible. Performance concerns are discussed with your manager and People Ops together, not by rumor.",
  },
  {
    id: "who-to-ask",
    title: "Who owns what",
    category: "How this tool works",
    tags: ["contact", "hr", "it", "buddy", "escalation", "owner"],
    summary: "A simple map so you are not bounced between inboxes.",
    body: "IT: devices, accounts, software, VPN. People Ops: pay, leave, benefits, accommodations, workplace concerns. Your buddy: unwritten norms and introductions. Your manager: priorities, quality of work, and team meetings. Ethics hotline: illegal, unsafe, or unethical conduct, including when you do not trust internal email. This assistant routes you using that map. If two teams might own it, send People Ops and say you copied IT only if it is an access issue.",
  },
  {
    id: "emergency",
    title: "Emergencies, building safety, and after-hours",
    category: "Safety and ethics",
    tags: ["emergency", "safety", "fire", "after hours", "unsafe"],
    summary: "What to do if someone is hurt, the building is unsafe, or you are working late.",
    body: "Life-threatening emergencies: call local emergency services, then notify a site lead if you can. Fire and evacuation maps are posted on site. After-hours work still follows the same safety rules; you are not expected to stay in an unsafe space to finish a task. Report near misses to People Ops or the site safety contact. An unsafe instruction from anyone, including a manager, can be refused and reported.",
  },
];

export function getArticle(id: string): Article | undefined {
  return articles.find((article) => article.id === id);
}
