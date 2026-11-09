import { describe, expect, it } from "vitest";
import { parseHandbookInput, sanitizeHandbook, stripHtml, validateDraft } from "./handbook-validate";
import type { Article } from "./types";

const sample: Article = {
  id: "a",
  title: "Pay",
  category: "Pay",
  tags: [],
  summary: "Pay",
  body: "Paid every two weeks.",
};

describe("validateDraft", () => {
  it("rejects blank titles, blank bodies, and duplicate ids", () => {
    expect(validateDraft([{ ...sample, title: "" }])[0]).toMatch(/title/i);
    expect(validateDraft([{ ...sample, body: "" }])[0]).toMatch(/no text/i);
    expect(validateDraft([sample, { ...sample, title: "Other" }])[0]).toMatch(/twice/i);
  });
});

describe("sanitizeHandbook", () => {
  it("strips HTML and drops empty titles", () => {
    const clean = sanitizeHandbook({
      sections: [{ id: "x", title: "<b>Hi</b>", body: "<script>bad</script>ok", category: "A", tags: [], summary: "" }],
    });
    expect(clean?.[0].title).toBe("Hi");
    expect(clean?.[0].body).toContain("ok");
    expect(clean?.[0].body).not.toContain("script");
  });
});

describe("parseHandbookInput", () => {
  it("reads markdown headings", () => {
    const parsed = parseHandbookInput("## Time off\n\nRequest in the portal.");
    expect(parsed.articles?.[0].title).toBe("Time off");
  });
});

describe("stripHtml", () => {
  it("removes tags", () => {
    expect(stripHtml("<p>Hi</p>")).toBe("Hi");
  });
});
