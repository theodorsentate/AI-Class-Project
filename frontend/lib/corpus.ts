import { articles } from "./knowledge";
import { people } from "./people";
import { tables } from "./tables";
import type { Article } from "./types";

export const FULL_MAX_CHARS = 420000;

export function excerptText(secs: Article[]): string {
  return secs.map((section) => `## ${section.title}\n${section.body}`).join("\n\n");
}

export function extraContextText(): string {
  const tableBlock = tables
    .map((table) => {
      const rows = table.rows.map((row) =>
        table.columns.map((column, index) => `${column}: ${row[index] ?? ""}`).join("; "),
      );
      return `## Table: ${table.title}\n${table.summary}\n${rows.join("\n")}`;
    })
    .join("\n\n");
  const peopleBlock = people
    .map(
      (person) =>
        `## Person: ${person.name}\nRole: ${person.role}. Team: ${person.team}. Email: ${person.email}. Handles: ${person.handles}.`,
    )
    .join("\n\n");
  return [tableBlock, peopleBlock].join("\n\n");
}

export function fullCorpusText(source = articles): string {
  return [excerptText(source), extraContextText()].filter(Boolean).join("\n\n");
}

export function canSendAll(source = articles): boolean {
  const n = source.reduce((sum, section) => sum + section.title.length + section.body.length + 6, 0);
  return n + extraContextText().length <= FULL_MAX_CHARS;
}
