import { describe, expect, it } from "vitest";
import { bestSentences, composeReply, promoteForSafety } from "./compose";
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

  it("quotes the sentence that answers the question, not just the opening of the article", () => {
    const q = "How many bereavement days do I get?";
    const reply = composeReply(q, retrieve(q, articles), defaultCompany);
    expect(reply.text).toContain("3 paid days");
    expect(reply.sourceRefs[0]?.id).toBe("protected-leave");
  });

  it("finds the dollar limit for a gift question", () => {
    const q = "Can a vendor give me a gift?";
    const reply = composeReply(q, retrieve(q, articles), defaultCompany);
    expect(reply.text).toContain("$50");
  });

  it("falls back to the opening sentences when no sentence matches", () => {
    const text = "First sentence here. Second sentence here. Third sentence here. Fourth sentence here.";
    expect(bestSentences(text, "zebra quokka", 2)).toBe("First sentence here. Second sentence here.");
  });

  it("keeps matched sentences in their original order", () => {
    const text = "Alpha one. Beta two. Gamma three. Delta four.";
    expect(bestSentences(text, "delta alpha", 2)).toBe("Alpha one. Delta four.");
  });

  it("cites the harassment section first for a personal harassment report", () => {
    const q = "My manager keeps harassing me";
    const reply = composeReply(q, retrieve(q, articles), defaultCompany);
    expect(reply.sourceRefs[0]?.id).toBe("respectful-workplace");
    expect(reply.escalate).toBe(true);
  });

  it("cites the injury section for a work injury", () => {
    const q = "I got hurt at work";
    const reply = composeReply(q, retrieve(q, articles), defaultCompany);
    expect(reply.sourceRefs[0]?.id).toBe("work-injury");
  });

  it("does not change the order when the question is not sensitive", () => {
    const q = "How do I request time off?";
    const hits = retrieve(q, articles);
    expect(promoteForSafety(hits, undefined, q)).toEqual(hits);
  });
});
