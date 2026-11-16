import { describe, expect, it } from "vitest";
import { defaultCompany } from "./company";
import { localDraft } from "./draft";

describe("localDraft", () => {
  it("builds a usable email with no server", () => {
    const d = localDraft("benefits", "", defaultCompany);
    expect(d.subject).toContain("benefits enrollment question");
    expect(d.body).toContain(defaultCompany.name);
    expect(d.body).toContain("manager is not copied");
    expect(d.to).toBe(defaultCompany.peopleEmail);
  });

  it("routes access problems to IT", () => {
    const d = localDraft("access", "", defaultCompany);
    expect(d.team).toBe("it");
    expect(d.to).toBe(defaultCompany.itEmail);
  });

  it("keeps what the person already typed", () => {
    const d = localDraft("timeoff", "I need Friday off for a move", defaultCompany);
    expect(d.body).toContain("I need Friday off for a move");
  });
});
