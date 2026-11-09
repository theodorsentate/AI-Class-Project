import { articles } from "./knowledge";

export type SearchHit = {
  href: string;
  title: string;
  detail: string;
  kind: "page" | "handbook" | "ask";
};

export const appPages: SearchHit[] = [
  { href: "/", title: "Home", detail: "Hub, start date, up next", kind: "page" },
  { href: "/ask", title: "Ask privately", detail: "Questions without going to a manager", kind: "page" },
  { href: "/week", title: "First week", detail: "Checklist and due dates", kind: "page" },
  { href: "/library", title: "Handbook", detail: "Browse policies", kind: "page" },
  { href: "/escalate", title: "Send to People Ops or IT", detail: "Confidential note", kind: "page" },
  { href: "/support", title: "Need support?", detail: "988 and People Ops", kind: "page" },
  { href: "/setup", title: "Company setup", detail: "Name, contacts, handbook editor", kind: "page" },
  { href: "/people", title: "People directory", detail: "Who to contact", kind: "page" },
  { href: "/data", title: "Lookup tables", detail: "Holidays, pay dates, benefits", kind: "page" },
];

export function searchAll(query: string): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return appPages.slice(0, 6);
  }
  const pages = appPages.filter(
    (page) => page.title.toLowerCase().includes(q) || page.detail.toLowerCase().includes(q),
  );
  const sections = articles
    .filter((article) =>
      [article.title, article.summary, article.body, article.tags.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(q),
    )
    .slice(0, 8)
    .map((article) => ({
      href: `/library/${article.id}`,
      title: article.title,
      detail: article.category,
      kind: "handbook" as const,
    }));
  const hits = [...pages, ...sections];
  hits.push({
    href: `/ask?q=${encodeURIComponent(query)}`,
    title: `Ask the assistant: ${query}`,
    detail: "Open Ask privately with this question",
    kind: "ask",
  });
  return hits;
}
