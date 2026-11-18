import { describe, expect, it } from "vitest";
import { defaultCompany } from "./company";
import { DRAFT_ORDER, DRAFT_TOPICS, hasPlaceholders, inboxFor, localDraft } from "./draft";

describe("localDraft", () => {
  it("builds a complete, signed email with no server", () => {
    const d = localDraft("benefits", "", defaultCompany);
    expect(d.subject).toContain("benefits enrollment");
    expect(d.body).toContain("Hello People Ops");
    expect(d.body).toContain(defaultCompany.name);
    expect(d.body).toContain("Jordan Reyes");
    expect(d.body.trim().endsWith("Jordan Reyes")).toBe(true);
    expect(d.to).toBe(defaultCompany.peopleEmail);
  });

  it("routes each topic to the right inbox", () => {
    expect(localDraft("access", "", defaultCompany).to).toBe(defaultCompany.itEmail);
    expect(localDraft("credit", "", defaultCompany).to).toBe("revops@lumenfield.example");
    expect(localDraft("certification", "", defaultCompany).to).toBe("enablement@lumenfield.example");
    expect(localDraft("compliance", "", defaultCompany).to).toBe("compliance@lumenfield.example");
    expect(inboxFor("people", defaultCompany)).toBe(defaultCompany.peopleEmail);
  });

  it("keeps what the person already typed and leaves clear blanks for the rest", () => {
    const d = localDraft("timeoff", "Friday 4 December, for a move", defaultCompany);
    expect(d.body).toContain("Friday 4 December, for a move");
    expect(d.body).not.toContain("{{");
    expect(hasPlaceholders(d.body)).toBe(true);
  });

  it("uses a bracketed hint when nothing was typed", () => {
    const d = localDraft("paycheck", "", defaultCompany);
    expect(d.body).toContain("[what looks wrong on the statement]");
  });

  it("drafts a general note when no topic is chosen", () => {
    const d = localDraft(undefined, "I cannot find my badge", defaultCompany);
    expect(d.subject).toBe("Request: I cannot find my badge");
    expect(d.body).toContain("I cannot find my badge");
  });

  it("does not invent a name when there is no new hire set", () => {
    const d = localDraft("access", "", { ...defaultCompany, hireName: undefined, hireRole: undefined });
    expect(d.body).toContain("[your name]");
  });

  it("every ordered topic exists and has a subject, a body and a details slot", () => {
    for (const id of DRAFT_ORDER) {
      const t = DRAFT_TOPICS[id];
      expect(t, id).toBeTruthy();
      expect(t.subject.length).toBeGreaterThan(10);
      expect(t.body).toContain("{{details}}");
    }
    expect(Object.keys(DRAFT_TOPICS).sort()).toEqual([...DRAFT_ORDER].sort());
  });
});
