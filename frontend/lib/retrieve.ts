import type { Article, RankedHit } from "./types";

const STOP = new Set([
  "the",
  "and",
  "for",
  "are",
  "but",
  "not",
  "you",
  "your",
  "how",
  "what",
  "when",
  "where",
  "who",
  "can",
  "does",
  "this",
  "that",
  "with",
  "from",
  "have",
  "has",
  "will",
  "would",
  "could",
  "should",
  "into",
  "about",
  "just",
  "dont",
  "want",
  "need",
  "please",
  "a",
  "an",
  "to",
  "of",
  "in",
  "on",
  "is",
  "my",
  "me",
  "do",
  "i",
]);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1 && !STOP.has(token));
}

export function retrieve(
  question: string,
  articles: Article[],
  limit = 5,
): RankedHit[] {
  const query = tokenize(question);
  if (query.length === 0) {
    return [];
  }

  // Rare words matter more than common ones: "bereavement" should beat "days".
  const docs = articles.map((article) => ({
    article,
    titleTok: tokenize(article.title),
    tagTok: tokenize(article.tags.join(" ")),
    bodyTok: tokenize(`${article.summary} ${article.body}`),
  }));
  const total = Math.max(docs.length, 1);
  const idf = new Map<string, number>();
  for (const token of new Set(query)) {
    const df = docs.filter(
      (d) => d.titleTok.includes(token) || d.tagTok.includes(token) || d.bodyTok.includes(token),
    ).length;
    idf.set(token, Math.log(1 + total / (df + 0.5)));
  }

  let max = 0;
  for (const token of query) max += (idf.get(token) ?? 0) * 6;

  const ranked = docs.map((d) => {
    let score = 0;
    for (const token of query) {
      const weight = idf.get(token) ?? 0;
      if (d.titleTok.includes(token)) score += 3 * weight;
      if (d.tagTok.includes(token)) score += 2 * weight;
      if (d.bodyTok.includes(token)) score += 1 * weight;
    }
    return { article: d.article, score: max > 0 ? score / max : 0 };
  });

  return ranked
    .filter((hit) => hit.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function isSensitiveQuestion(question: string): boolean {
  return /harass|discriminat|assault|bully|retaliat|whistle|illegal|unsafe|accommodat|disability|mental[\s-]health|pay error|underpaid|wage|ethics|hotline/.test(
    question.toLowerCase(),
  );
}
