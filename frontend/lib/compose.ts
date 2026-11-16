import { tokenize } from "./retrieve";
import { classify } from "./safety";
import type { AssistantReply, CompanyProfile, RankedHit } from "./types";

const LOW_CONFIDENCE = 0.12;

function firstSentences(text: string, count: number): string {
  const parts = text.split(/(?<=[.!?])\s+/).filter(Boolean);
  return parts.slice(0, count).join(" ");
}

function stem(token: string): string {
  return token.length > 4 ? token.replace(/(ing|ed|es|s)$/, "") : token;
}

/**
 * Pick the sentences of an article that best answer the question, so a long article
 * does not hide the one fact the person asked for. Falls back to the opening
 * sentences when nothing matches. Sentences stay in their original order.
 */
export function bestSentences(text: string, question: string, count: number): string {
  const parts = text.split(/(?<=[.!?])\s+/).filter(Boolean);
  const wanted = new Set(tokenize(question).map(stem));
  if (wanted.size === 0 || parts.length <= count) {
    return firstSentences(text, count);
  }
  const scored = parts.map((sentence, index) => {
    const seen = new Set(tokenize(sentence).map(stem));
    let score = 0;
    for (const token of wanted) {
      if (seen.has(token)) score += 1;
    }
    return { sentence, index, score };
  });
  if (scored.every((item) => item.score === 0)) {
    return firstSentences(text, count);
  }
  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, count)
    .sort((a, b) => a.index - b.index)
    .map((item) => item.sentence)
    .join(" ");
}

export function composeReply(
  question: string,
  hits: RankedHit[],
  company: CompanyProfile,
): AssistantReply {
  const safety = classify(question);
  const sensitive = Boolean(safety);
  const crisis = Boolean(safety?.crisis);
  const top = hits[0];

  if (crisis) {
    return {
      text: "",
      sources: [],
      sourceRefs: [],
      escalate: false,
      sensitive: true,
      crisis: true,
      category: safety?.cat,
      mode: "handbook",
    };
  }

  if (!top || top.score < LOW_CONFIDENCE) {
    return {
      text: `I do not have a confident match in the ${company.name} handbook. Send a confidential note to People Ops (${company.peopleEmail}) or IT (${company.itEmail}). That note is not copied to your manager.${sensitive ? ` If this is a safety or ethics concern, call ${company.ethicsHotline}.` : ""}`,
      sources: [],
      sourceRefs: [],
      escalate: true,
      sensitive,
      crisis: false,
      category: safety?.cat,
      mode: "handbook",
    };
  }

  const confident = hits.filter((hit) => hit.score >= LOW_CONFIDENCE);
  const extras = confident.slice(1).map((hit) => hit.article.title);

  let text = `${bestSentences(top.article.body, question, 3)} Source: ${top.article.title}.`;
  if (extras.length > 0) {
    text += ` Related: ${extras.join("; ")}.`;
  }
  if (sensitive) {
    text += ` You can handle this without your manager. People Ops: ${company.peopleEmail}. Ethics hotline: ${company.ethicsHotline}.`;
  }

  return {
    text,
    sources: confident.map((hit) => hit.article.title),
    sourceRefs: confident.map((hit) => ({
      id: hit.article.id,
      title: hit.article.title,
    })),
    escalate: sensitive,
    sensitive,
    crisis: false,
    category: safety?.cat,
    mode: "handbook",
  };
}
