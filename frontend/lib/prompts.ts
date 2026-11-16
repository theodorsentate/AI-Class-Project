import { defaultCompany } from "./company";
import type { Article, CompanyProfile } from "./types";

export type HireSnapshot = {
  startDate: string;
  doneTitles: string[];
  openTitles: string[];
};

export function hireContext(snapshot: HireSnapshot): string {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  let start = "Start date: not set.";
  if (snapshot.startDate) {
    const sd = new Date(`${snapshot.startDate}T12:00:00`);
    if (!Number.isNaN(sd.getTime())) {
      const d = Math.round((Date.now() - sd.getTime()) / 86400000);
      const label = sd.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      start =
        d >= 0
          ? `Start date: ${label} (day ${d + 1} of employment).`
          : `Start date: ${label} (starts in ${-d} day${d === -1 ? "" : "s"}).`;
    }
  }
  return `ABOUT THIS NEW HIRE (use it for questions like "what should I do next?" or "what is due soon?"; do not mention it otherwise):
Today is ${today}. ${start}
Checklist done (${snapshot.doneTitles.length}): ${snapshot.doneTitles.join("; ") || "none yet"}.
Checklist still open: ${snapshot.openTitles.join("; ") || "nothing"}.`;
}

export function systemPrompt(
  excerpts: string,
  company: CompanyProfile,
  snapshot: HireSnapshot,
  full: boolean,
  index: string,
): string {
  const name = company.name || defaultCompany.name;
  return `You are the employee onboarding assistant for ${name}. A new hire is asking you questions.

${full ? "Below is the COMPLETE handbook. Use all of it, and combine several parts when a question needs more than one.\n\n" : ""}Answer ONLY from the handbook ${full ? "below" : "excerpts below"}. Be warm, plain-spoken and brief (2-5 sentences, or a short dash list). Quote exact numbers, dates, limits and steps from the excerpts. Never invent policies, numbers, names or links, and never fill a gap with a guess. Do not use emoji.

Reply with ONLY a JSON object, no markdown fences, in exactly this shape:
{"answer": string, "sources": string[], "answerable": boolean, "sensitive": boolean, "category": string, "followups": string[]}

- followups: 2 or 3 short questions (under 10 words each) related to what they asked AND answerable from the handbook. Use [] when sensitive is true.
- sources: the exact section titles you used ([] if none).
- answerable: false if the handbook does not contain the answer. In that case say so in one sentence and point to People Ops or IT.
- sensitive: true when the person describes a personal situation involving harassment, discrimination, retaliation, a mental health struggle, physical safety, a disability or medical accommodation, a legal dispute, being terminated, or asks to hide or falsify something. Also set it to true for indirect signs of distress even if they never say so directly. Routine policy questions (how parental leave works, what the harassment policy is, how to give notice) are NOT sensitive. When true, set category to one of: harassment, discrimination, mental_health, safety, medical, legal. Otherwise category is "".

${hireContext(snapshot)}

${full ? "" : `SECTION INDEX:\n${index}\n\n`}${full ? "COMPLETE HANDBOOK:" : "HANDBOOK EXCERPTS:"}
${excerpts}`;
}

export function sectionIndex(source: Article[]): string {
  return source.map((section) => `- ${section.title}: ${section.summary}`).join("\n");
}
