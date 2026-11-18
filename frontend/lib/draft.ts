import type { CompanyProfile } from "./types";

export type DraftTeam = "people" | "it" | "revops" | "enablement" | "compliance";

export const TEAM_INFO: Record<DraftTeam, { label: string; time: string; handles: string }> = {
  people: { label: "People Ops", time: "Usually one business day", handles: "Pay, leave, benefits, accommodations, concerns" },
  it: { label: "IT", time: "Usually the same business day for access issues", handles: "Laptop, accounts, sign-in, security" },
  revops: { label: "RevOps", time: "Usually one business day", handles: "CRM, territories, lead routing, meeting credit" },
  enablement: { label: "Sales Enablement", time: "Usually one to two business days", handles: "Training, certifications, call library, messaging" },
  compliance: { label: "Compliance", time: "Usually two business days", handles: "What you can say or send, do-not-call, recording" },
};

export type DraftTopic = {
  team: DraftTeam;
  label: string;
  /** Short hint shown under the topic button and used as the details placeholder. */
  hint: string;
  prompt: string;
  subject: string;
  /** Body with {{details}} where the person's own words go. */
  body: string;
};

/** Topics are grouped on the page in this order. */
export const DRAFT_ORDER: string[] = [
  "paycheck", "timeoff", "benefits", "expense", "leave", "accommodation", "concern",
  "access", "lockout", "phishing",
  "credit", "territory", "certification", "compliance",
];

export const DRAFT_TOPICS: Record<string, DraftTopic> = {
  paycheck: {
    team: "people",
    label: "Paycheck or commission",
    hint: "what looks wrong on the statement",
    prompt: "a paycheck or commission statement question",
    subject: "Question about my [pay date] paycheck",
    body: "I have a question about my pay.\n\nWhat I noticed: {{details}}\nWhat I expected: [amount or what the offer letter says]\nPay date or commission month: [date]\n\nCould you check this and tell me what you find, or what you need from me?",
  },
  timeoff: {
    team: "people",
    label: "Request time off",
    hint: "the dates and why, if you want to share",
    prompt: "a time off request",
    subject: "Time off request: [first day] to [last day]",
    body: "I would like to take time off.\n\nDates: {{details}}\nType: [PTO, sick day or other]\n\nI have not asked my manager yet and would like to check the balance and the process first. Could you tell me how many days I have available and how to submit the request?",
  },
  benefits: {
    team: "people",
    label: "Benefits enrollment",
    hint: "which plan or deadline you are unsure about",
    prompt: "a benefits enrollment question",
    subject: "Question about benefits enrollment",
    body: "I am deciding on my benefits and have a question before the business day 10 deadline.\n\nMy question: {{details}}\nMy situation: [for example single, with a partner, with children]\n\nCould you point me to the plan details, or tell me who can walk me through the options? Please also confirm my enrollment deadline.",
  },
  expense: {
    team: "people",
    label: "Expense reimbursement",
    hint: "what you bought and when",
    prompt: "an expense reimbursement status question",
    subject: "Status of my expense claim: [item], [amount]",
    body: "I would like to check on an expense claim.\n\nExpense: {{details}}\nAmount: [$ amount]\nDate submitted: [date]\nApproved by: [name, if it needed approval]\n\nCould you tell me the status and the expected payment date? I have the receipt if you need it.",
  },
  leave: {
    team: "people",
    label: "Ask about leave",
    hint: "the type of leave and roughly when",
    prompt: "a question about leave",
    subject: "Question about leave (private)",
    body: "I would like to understand my leave options in confidence.\n\nType of leave: {{details}}\nApproximate timing: [month or date range]\n\nCould you explain what is available to me, what I need to submit, and how my commission would be handled? Please keep this between us for now.",
  },
  accommodation: {
    team: "people",
    label: "Request an accommodation",
    hint: "what change would help",
    prompt: "a workplace accommodation request",
    subject: "Accommodation request (confidential)",
    body: "I would like to request a change to my work setup.\n\nWhat would help: {{details}}\nWhen I need it by: [date, or as soon as possible]\n\nI would like to keep the details with People Ops and not discuss them with my manager at this stage. Could we set up a short conversation, and tell me what documentation, if any, you need?",
  },
  concern: {
    team: "people",
    label: "Raise a concern",
    hint: "a sentence about what happened, if you are comfortable",
    prompt: "a workplace concern",
    subject: "I would like to talk to someone (confidential)",
    body: "I would like to raise a concern and talk to someone in confidence.\n\nIn short: {{details}}\n\nI am happy to share more details in a conversation. Please do not forward this to my manager. If there is a better channel, such as the ethics hotline, please tell me.",
  },
  access: {
    team: "it",
    label: "Laptop or access",
    hint: "what you need and what you tried",
    prompt: "a laptop or account access request",
    subject: "Access request: [tool or system]",
    body: "I need help with my laptop or access.\n\nWhat I need: {{details}}\nWhat I have tried: [for example the first-login email, the password reset]\nError message, if any: [copy it here]\n\nI start in the CRM and call tools this week and need this working soon. Could you let me know when it is sorted, or what you need from me?",
  },
  lockout: {
    team: "it",
    label: "Locked out or MFA",
    hint: "which account and what you see",
    prompt: "an account lockout or MFA problem",
    subject: "Locked out of [account or tool]",
    body: "I cannot sign in.\n\nAccount or tool: {{details}}\nWhat I see: [the exact message]\nWhen it started: [time]\nDevice: [company laptop or phone]\n\nI have tried the self-service reset: [yes or no]. Please tell me how you will verify it is me and when I can expect to be back in.",
  },
  phishing: {
    team: "it",
    label: "Suspicious email",
    hint: "who it appeared to be from and what it asked",
    prompt: "a suspicious email report",
    subject: "Suspicious email to review",
    body: "I received an email that looks suspicious.\n\nWhat it looked like: {{details}}\nReceived at: [time]\nDid I click a link or open an attachment: [yes or no]\n\nI have not replied. Please tell me what to do next, and whether I should do anything about my password.",
  },
  credit: {
    team: "revops",
    label: "Meeting credit",
    hint: "the account, the date and what happened",
    prompt: "a meeting credit question",
    subject: "Meeting credit question: [account], [date]",
    body: "I would like to check how a meeting was counted.\n\nMeeting: {{details}}\nBooked by me on: [date]\nHeld on: [date], with [AE name]\nHow it shows in the CRM: [status]\n\nCould you review the record and tell me whether it counts toward my quota and, if not, why? I have my activity notes if useful.",
  },
  territory: {
    team: "revops",
    label: "Account ownership",
    hint: "the account name and what you found",
    prompt: "an account ownership question",
    subject: "Account ownership: [account name]",
    body: "I need to confirm who owns an account.\n\nAccount: {{details}}\nWhat I see in the CRM: [owner and last activity date]\nWhy it matters: [for example a prospect replied to me]\n\nI will not contact them until I hear back. Could you confirm the owner and, if needed, how to resolve it?",
  },
  certification: {
    team: "enablement",
    label: "Book my certification",
    hint: "the slots that work for you",
    prompt: "a certification booking request",
    subject: "Booking my CRM and call-tools certification",
    body: "I need to book my CRM and call-tools certification, due by business day 5.\n\nSlots that work for me: {{details}}\nAnything I should prepare: [questions]\n\nCould you confirm a slot and send any materials in advance?",
  },
  compliance: {
    team: "compliance",
    label: "Can I say or send this?",
    hint: "paste the message or describe the situation",
    prompt: "a question about what I can say or send to a prospect",
    subject: "Question before I send: [topic]",
    body: "I would like to check something before I send it.\n\nThe situation: {{details}}\nProspect location: [country or state]\nChannel: [call, email or LinkedIn]\n\nIs this allowed under our messaging and contact rules? I will hold off until I hear from you.",
  },
};

export function inboxFor(team: DraftTeam, company: CompanyProfile): string {
  if (team === "people") return company.peopleEmail;
  if (team === "it") return company.itEmail;
  const domain = company.peopleEmail.split("@")[1] ?? "example.com";
  return `${team}@${domain}`;
}

function introLine(company: CompanyProfile): string {
  const who = company.hireName || "[your name]";
  const role = company.hireRole ? ` (${company.hireRole})` : "";
  return `I am ${who}, a new hire at ${company.name}${role}.`;
}

function signOff(company: CompanyProfile): string {
  return `Thank you,\n${company.hireName || "[your name]"}`;
}

function tidy(text: string): string {
  return text.trim().replace(/\s+/g, " ");
}

function firstSentence(text: string, max = 60): string {
  const t = tidy(text);
  const cut = t.split(/(?<=[.?!])\s/)[0] ?? t;
  return cut.length > max ? `${cut.slice(0, max - 1).trimEnd()}…` : cut.replace(/[.?!]$/, "");
}

/** A general-purpose email for when no topic is chosen. */
export function fallbackTemplate(
  team: DraftTeam,
  company: CompanyProfile,
  need: string,
): { subject: string; body: string; to: string } {
  const to = inboxFor(team, company);
  const details = tidy(need);
  return {
    subject: details ? `Request: ${firstSentence(details)}` : "Request: [short summary]",
    body: `Hello ${TEAM_INFO[team].label},\n\n${introLine(company)}\n\n${details || "[Describe what you need in a sentence or two.]"}\n\nCould you let me know the next step, or who is the right person to ask? A reply by email is fine.\n\n${signOff(company)}`,
    to,
  };
}

/** Builds a draft with no server and no model. */
export function localDraft(topicId: string | undefined, typed: string, company: CompanyProfile) {
  const topic = topicId ? DRAFT_TOPICS[topicId] : undefined;
  if (!topic) {
    return { ...fallbackTemplate("people", company, typed), team: "people" as DraftTeam };
  }
  const details = tidy(typed);
  const filled = topic.body.replace("{{details}}", details || `[${topic.hint}]`);
  return {
    subject: topic.subject,
    body: `Hello ${TEAM_INFO[topic.team].label},\n\n${introLine(company)} ${filled}\n\n${signOff(company)}`,
    to: inboxFor(topic.team, company),
    team: topic.team,
  };
}

export function hasPlaceholders(text: string): boolean {
  return /\[[^\]\n]{2,}\]/.test(text);
}
