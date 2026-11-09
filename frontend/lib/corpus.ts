import { articles } from "./knowledge";
import type { Article } from "./types";

export const FULL_MAX_CHARS = 420000;

export function excerptText(secs: Article[]): string {
  return secs.map((section) => `## ${section.title}\n${section.body}`).join("\n\n");
}

export function extraContextText(): string {
  return "";
}

export function fullCorpusText(source = articles): string {
  return [excerptText(source), extraContextText()].filter(Boolean).join("\n\n");
}

export function canSendAll(source = articles): boolean {
  const n = source.reduce((sum, section) => sum + section.title.length + section.body.length + 6, 0);
  return n + extraContextText().length <= FULL_MAX_CHARS;
}
