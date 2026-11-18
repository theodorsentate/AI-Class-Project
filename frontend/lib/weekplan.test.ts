import { describe, expect, it } from "vitest";
import { defaultChecklist } from "./checklist";
import { DRAFT_TOPICS } from "./draft";
import { articles } from "./knowledge";
import { WEEK_PLAN, planDayFor } from "./weekplan";

describe("first-week plan", () => {
  it("has a card for every day that a task is due", () => {
    const days = new Set(WEEK_PLAN.map((d) => d.day));
    for (const item of defaultChecklist) {
      if (item.dueBusinessDay) expect(days.has(planDayFor(item.dueBusinessDay)), item.id).toBe(true);
    }
  });

  it("mentions the same deadlines the checklist enforces", () => {
    const text = (n: number) => JSON.stringify(WEEK_PLAN.find((d) => d.day === n));
    expect(text(1)).toContain("multi-factor");
    expect(text(3)).toContain("eligibility");
    expect(text(5)).toContain("certification");
    expect(text(6)).toContain("business day 10");
  });

  it("links every task to a real article and a real email topic", () => {
    for (const item of defaultChecklist) {
      if (item.articleId) expect(articles.some((a) => a.id === item.articleId), item.id).toBe(true);
      if (item.askTopic) expect(DRAFT_TOPICS[item.askTopic], item.id).toBeTruthy();
    }
  });

  it("orders days one to five then week two", () => {
    expect(WEEK_PLAN.map((d) => d.day)).toEqual([1, 2, 3, 4, 5, 6]);
  });
});
