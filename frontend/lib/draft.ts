import type { CompanyProfile } from "./types";

export type DraftTeam = "people" | "it";

export const DRAFT_TOPICS: Record<string, { team: DraftTeam; prompt: string }> = {
  benefits: { team: "people", prompt: "benefits enrollment question" },
  access: { team: "it", prompt: "laptop or account access issue" },
  schedule: { team: "people", prompt: "work schedule question" },
  timeoff: { team: "people", prompt: "time off request process" },
};

export function fallbackTemplate(
  team: DraftTeam,
  company: CompanyProfile,
  need: string,
): { subject: string; body: string; to: string } {
  const to = team === "people" ? company.peopleEmail : company.itEmail;
  return {
    subject: `New hire request: ${need.slice(0, 60) || "help"}`,
    body: `Hello,\n\nI am a new hire at ${company.name}. I need help with: ${need || "[describe what you need]"}.\n\nPlease reply to this note. My manager is not copied.\n\nThank you\n`,
    to,
  };
}

/** Builds a draft with no server and no model, for when the draft service is unavailable. */
export function localDraft(topicId: string | undefined, typed: string, company: CompanyProfile) {
  const topic = topicId ? DRAFT_TOPICS[topicId] : undefined;
  const team = topic?.team ?? "people";
  const need = (typed || topic?.prompt || "").trim();
  return { ...fallbackTemplate(team, company, need), team };
}
