import { describe, expect, it } from "vitest";
import { composeReply } from "./compose";
import { defaultCompany } from "./company";
import { articles } from "./knowledge";
import { retrieve } from "./retrieve";

describe("composeReply", () => {
  it("offers escalation when nothing matches", () => {
    const reply = composeReply("zzzz qqqq", [], defaultCompany);
    expect(reply.escalate).toBe(true);
    expect(reply.sources).toEqual([]);
  });

  it("cites the handbook for a lockout question", () => {
    const hits = retrieve("I am locked out of email", articles);
    const reply = composeReply("I am locked out of email", hits, defaultCompany);
    expect(reply.escalate).toBe(false);
    expect(reply.sources.join(" ")).toMatch(/Accounts/i);
  });

  it("adds the hotline for harassment questions", () => {
    const hits = retrieve("How do I report harassment?", articles);
    const reply = composeReply("How do I report harassment?", hits, defaultCompany);
    expect(reply.sensitive).toBe(true);
    expect(reply.text).toContain(defaultCompany.ethicsHotline);
  });
});
