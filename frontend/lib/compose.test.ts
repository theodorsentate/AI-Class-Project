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
    expect(reply.sourceRefs).toEqual([]);
  });

  it("cites the handbook for a lockout question", () => {
    const hits = retrieve("I am locked out of email", articles);
    const reply = composeReply("I am locked out of email", hits, defaultCompany);
    expect(reply.escalate).toBe(false);
    expect(reply.sources.join(" ")).toMatch(/Accounts/i);
    expect(reply.sourceRefs[0]?.id).toBeTruthy();
  });

  it("answers informational harassment-policy questions without crisis routing", () => {
    const hits = retrieve("How do I report harassment?", articles);
    const reply = composeReply("How do I report harassment?", hits, defaultCompany);
    expect(reply.crisis).toBeFalsy();
    expect(reply.sensitive).toBe(false);
    expect(reply.text.length).toBeGreaterThan(20);
  });

  it("routes a personal harassment report to a human", () => {
    const hits = retrieve("My manager keeps harassing me", articles);
    const reply = composeReply("My manager keeps harassing me", hits, defaultCompany);
    expect(reply.sensitive).toBe(true);
    expect(reply.escalate).toBe(true);
  });
});
