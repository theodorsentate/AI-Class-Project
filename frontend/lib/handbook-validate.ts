import type { Article } from "./types";

export const HANDBOOK_KEY = "harbor-handbook-v1";
export const MAX_HANDBOOK_CHARS = 200000;

export function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, "");
}

export function validateDraft(sections: Article[]): string[] {
  const msgs: string[] = [];
  const seen = new Map<string, number>();
  const seenId = new Map<string, number>();
  let size = 0;
  sections.forEach((section, index) => {
    const title = (section.title || "").trim();
    const body = (section.body || "").trim();
    size += title.length + body.length;
    if (!title) {
      msgs.push(`Section ${index + 1} needs a title.`);
    } else if (seen.has(title.toLowerCase())) {
      msgs.push(`"${title}" is used twice. Titles must be unique because the assistant cites them.`);
    } else {
      seen.set(title.toLowerCase(), index);
    }
    if (!section.id?.trim()) {
      msgs.push(`Section ${index + 1} needs an id.`);
    } else if (seenId.has(section.id)) {
      msgs.push(`Id "${section.id}" is used twice.`);
    } else {
      seenId.set(section.id, index);
    }
    if (!body) {
      msgs.push(`"${title || "Section " + (index + 1)}" has no text.`);
    }
  });
  if (size > MAX_HANDBOOK_CHARS) {
    msgs.push(`Handbook is too large (${size} characters). Limit is ${MAX_HANDBOOK_CHARS}.`);
  }
  if (sections.length === 0) {
    msgs.push("Add at least one section.");
  }
  return msgs;
}

export function sanitizeHandbook(data: unknown): Article[] | null {
  if (!data || typeof data !== "object") {
    return null;
  }
  const raw = data as { sections?: unknown };
  const list = Array.isArray(raw.sections) ? raw.sections : Array.isArray(data) ? data : [];
  const sections = list
    .filter((item) => item && typeof item === "object")
    .map((item) => {
      const row = item as Article;
      return {
        id: stripHtml(String(row.id || "")).trim(),
        title: stripHtml(String(row.title || "")).trim(),
        category: stripHtml(String(row.category || "Other")).trim() || "Other",
        tags: Array.isArray(row.tags) ? row.tags.map((tag) => stripHtml(String(tag))) : [],
        summary: stripHtml(String(row.summary || "")),
        body: stripHtml(String(row.body || "")),
      };
    })
    .filter((item) => item.title);
  if (!sections.length) {
    return null;
  }
  return sections;
}

export function parseHandbookInput(raw: string): { articles: Article[] | null; error?: string } {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { articles: null, error: "Paste JSON or markdown first." };
  }
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      return { articles: sanitizeHandbook(parsed) };
    } catch {
      return { articles: null, error: "That JSON could not be read." };
    }
  }
  const chunks = trimmed.split(/\n(?=## )/);
  const articles = chunks
    .map((chunk, index) => {
      const [first, ...rest] = chunk.split("\n");
      const title = first.replace(/^##\s*/, "").trim();
      return {
        id: `custom-${index + 1}`,
        title,
        category: "Custom",
        tags: [],
        summary: rest.join(" ").trim().slice(0, 180),
        body: rest.join("\n").trim(),
      };
    })
    .filter((item) => item.title);
  return { articles: articles.length ? articles : null };
}
