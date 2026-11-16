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

  const ranked = articles.map((article) => {
    const titleTok = tokenize(article.title);
    const tagTok = tokenize(article.tags.join(" "));
    const bodyTok = tokenize(`${article.summary} ${article.body}`);
    let score = 0;
    for (const token of query) {
      if (titleTok.includes(token)) score += 3;
      if (tagTok.includes(token)) score += 2;
      if (bodyTok.includes(token)) score += 1;
    }
    const max = query.length * 6;
    return { article, score: score / max };
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
