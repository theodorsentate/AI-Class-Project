import { getArticle } from "./knowledge";
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

/**
 * When the safety check recognizes the topic, put the handbook section for that topic first.
 * A keyword match can otherwise rank an unrelated page higher (for example "manager" in
 * "My manager keeps harassing me"). The section is only used if it exists in the handbook.
 */
export function promoteForSafety(hits: RankedHit[], cat: string | undefined, question: string): RankedHit[] {
  if (!cat) return hits;
  const targets: Record<string, string> = {
    harassment: "respectful-workplace",
    discrimination: "respectful-workplace",
    mental_health: "wellbeing",
    safety: "emergency",
    medical: /hurt|injur/i.test(question) ? "work-injury" : "accommodations",
  };
  const id = targets[cat];
  const article = id ? getArticle(id) : undefined;
  if (!article) return hits;
  const existing = hits.find((hit) => hit.article.id === article.id);
  const floor = Math.max(hits[0]?.score ?? 0, LOW_CONFIDENCE);
  const promoted: RankedHit = { article, score: Math.max(existing?.score ?? 0, floor) };
  return [promoted, ...hits.filter((hit) => hit.article.id !== article.id)];
}

export function composeReply(
  question: string,
  hits: RankedHit[],
  company: CompanyProfile,
): AssistantReply {
  const safety = classify(question);
  const sensitive = Boolean(safety);
  const crisis = Boolean(safety?.crisis);
  const ranked = sensitive ? promoteForSafety(hits, safety?.cat, question) : hits;
  const top = ranked[0];

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

  const confident = ranked.filter((hit) => hit.score >= LOW_CONFIDENCE);

  // The sources are shown as links under the answer, so the text does not repeat them.
  let text = bestSentences(top.article.body, question, 3);
  if (sensitive) {
    text += `\n\nYou can handle this without your manager. People Ops: ${company.peopleEmail}. Ethics hotline: ${company.ethicsHotline}.`;
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
