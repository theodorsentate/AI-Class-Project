import { describe, expect, it } from "vitest";
import { articles } from "./knowledge";
import { retrieve, tokenize } from "./retrieve";

describe("tokenize", () => {
  it("drops stop words and punctuation", () => {
    expect(tokenize("How do I request time-off???")).toEqual(["request", "time", "off"]);
  });
});

describe("retrieve", () => {
  it("ranks time off questions onto the time off article", () => {
    const hits = retrieve("How do I request time off?", articles);
    expect(hits[0]?.article.id).toBe("time-off");
    expect(hits[0].score).toBeGreaterThan(0.12);
  });

  it("ranks manager-avoidance questions onto the skip-manager article", () => {
    const hits = retrieve("I do not want to ask my manager about pay", articles);
    expect(hits[0]?.article.id).toBe("skip-manager");
  });

  it("returns empty for nonsense with no overlap", () => {
    expect(retrieve("zzzz qqqq", articles)).toEqual([]);
  });
});
