import type { AssistantReply, CompanyProfile, RankedHit } from "./types";
import { isSensitiveQuestion } from "./retrieve";

const LOW_CONFIDENCE = 0.12;

function firstSentences(text: string, count: number): string {
  const parts = text.split(/(?<=[.!?])\s+/).filter(Boolean);
  return parts.slice(0, count).join(" ");
}

export function composeReply(
  question: string,
  hits: RankedHit[],
  company: CompanyProfile,
): AssistantReply {
  const sensitive = isSensitiveQuestion(question);
  const top = hits[0];

  if (!top || top.score < LOW_CONFIDENCE) {
    return {
      text: `I do not have a confident match in the ${company.name} handbook. Send a confidential note to People Ops (${company.peopleEmail}) or IT (${company.itEmail}). That note is not copied to your manager.${sensitive ? ` If this is a safety or ethics concern, call ${company.ethicsHotline}.` : ""}`,
      sources: [],
      escalate: true,
      sensitive,
      mode: "handbook",
    };
  }

  const extras = hits
    .slice(1)
    .filter((hit) => hit.score >= LOW_CONFIDENCE)
    .map((hit) => hit.article.title);

  let text = `${firstSentences(top.article.body, 3)} Source: ${top.article.title}.`;
  if (extras.length > 0) {
    text += ` Related: ${extras.join("; ")}.`;
  }
  if (sensitive) {
    text += ` You can handle this without your manager. People Ops: ${company.peopleEmail}. Ethics hotline: ${company.ethicsHotline}.`;
  }

  return {
    text,
    sources: hits.filter((hit) => hit.score >= LOW_CONFIDENCE).map((hit) => hit.article.title),
    escalate: false,
    sensitive,
    mode: "handbook",
  };
}
