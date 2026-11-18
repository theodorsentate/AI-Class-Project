import { describe, expect, it } from "vitest";
import { articles } from "./knowledge";
import { defaultChecklist } from "./checklist";
import { tables } from "./tables";
import { people } from "./people";
import { defaultCompany } from "./company";
import { fullCorpusText, canSendAll } from "./corpus";

describe("handbook content", () => {
  it("has a full set of sections", () => {
    expect(articles.length).toBeGreaterThanOrEqual(28);
  });

  it("every section is complete and unique", () => {
    const ids = new Set<string>();
    const titles = new Set<string>();
    for (const a of articles) {
      expect(a.id).toMatch(/^[a-z0-9-]+$/);
      expect(ids.has(a.id), `duplicate id ${a.id}`).toBe(false);
      expect(titles.has(a.title), `duplicate title ${a.title}`).toBe(false);
      ids.add(a.id);
      titles.add(a.title);
      expect(a.title.length).toBeGreaterThan(5);
      expect(a.category.length).toBeGreaterThanOrEqual(2);
      expect(a.summary.length).toBeGreaterThan(20);
      expect(a.body.length, `${a.id} body too short`).toBeGreaterThan(300);
      expect(a.tags.length, `${a.id} needs tags`).toBeGreaterThanOrEqual(4);
      expect(a.body, `${a.id} should not contain emoji`).not.toMatch(/\p{Extended_Pictographic}/u);
    }
  });

  it("covers the topics the first-week checklist sends people to", () => {
    for (const id of ["pay", "time-off", "equipment", "respectful-workplace", "benefits", "it-setup", "first-day"]) {
      expect(articles.some((a) => a.id === id), `missing ${id}`).toBe(true);
    }
  });

  it("deadlines in the handbook match the checklist and the deadlines table", () => {
    const due = Object.fromEntries(defaultChecklist.filter((c) => c.dueBusinessDay).map((c) => [c.id, c.dueBusinessDay]));
    expect(due).toEqual({ access: 1, eligibility: 3, certification: 5, accounts: 5, shadow: 5, benefits: 10 });
    const text = Object.fromEntries(articles.map((a) => [a.id, a.body]));
    expect(text["first-day"]).toContain("business day 3");
    expect(text["it-setup"]).toContain("business day 1");
    expect(text["benefits"]).toContain("business day 10");
    const deadlines = tables.find((t) => t.id === "key-deadlines");
    expect(deadlines?.rows.map((r) => r[1])).toEqual(["Business day 1", "Business day 3", "Business day 5", "Business day 10"]);
  });

  it("uses the company's real contact details and no invented ones", () => {
    const all = articles.map((a) => a.body).join(" ") + JSON.stringify(tables) + JSON.stringify(people);
    const phones = new Set(all.match(/1-800-555-\d{4}/g) ?? []);
    expect([...phones].sort()).toEqual(["1-800-555-0142", "1-800-555-0199"]);
    expect(all).toContain(defaultCompany.ethicsHotline);
    const emails = new Set(all.match(/[a-z.]+@lumenfield\.example/g) ?? []);
    for (const e of emails) {
      expect(["people@lumenfield.example", "it@lumenfield.example", "safety@lumenfield.example", "revops@lumenfield.example", "enablement@lumenfield.example", "compliance@lumenfield.example", "press@lumenfield.example", "priya.natarajan@lumenfield.example", "marcus.hill@lumenfield.example"]).toContain(e);
    }
  });

  it("dollar amounts in articles agree with the money-limits table", () => {
    const limits = JSON.stringify(tables.find((t) => t.id === "money-limits"));
    const body = (id: string) => articles.find((a) => a.id === id)!.body;
    expect(body("equipment")).toContain("$250");
    expect(limits).toContain("$250");
    expect(body("expenses")).toContain("$25");
    expect(body("expenses")).toContain("$200");
    expect(limits).toContain("$200");
    expect(body("learning")).toContain("$500");
    expect(limits).toContain("$500");
    expect(body("gifts-conflicts")).toContain("$50");
    expect(limits).toContain("$50");
  });

  it("still fits comfortably in a single model prompt", () => {
    expect(canSendAll()).toBe(true);
    expect(fullCorpusText().length).toBeLessThan(120000);
  });
});
