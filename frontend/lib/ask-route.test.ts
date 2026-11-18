import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "../app/api/ask/route";

const ask = (question: string) =>
  POST(new Request("http://x/api/ask", { method: "POST", body: JSON.stringify({ question }) }));

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

describe("/api/ask with an AI key", () => {
  it("uses the model's answer and maps its sources to real handbook sections", async () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "k");
    const spy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          content: [
            {
              type: "text",
              text: JSON.stringify({
                answer: "You get 3 paid bereavement days.",
                sources: ["Medical, family, and other protected leave"],
                answerable: true,
                sensitive: false,
                category: "Leave",
                followups: ["How do I request leave?"],
              }),
            },
          ],
        }),
        { status: 200 },
      ),
    );
    const reply = await (await ask("How many bereavement days do I get?")).json();
    expect(spy).toHaveBeenCalledOnce();
    expect(reply.mode).toBe("llm");
    expect(reply.text).toContain("3 paid bereavement days");
    expect(reply.sourceRefs.length).toBeGreaterThan(0);
  });

  it("falls back to handbook search when the model call fails", async () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "k");
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("boom", { status: 500 }));
    const reply = await (await ask("How many bereavement days do I get?")).json();
    expect(reply.mode).not.toBe("llm");
    expect(reply.text).toMatch(/3 paid/i);
  });

  it("never sends crisis wording to the model", async () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "k");
    const spy = vi.spyOn(globalThis, "fetch");
    const reply = await (await ask("I have been thinking about hurting myself")).json();
    expect(spy).not.toHaveBeenCalled();
    expect(reply.crisis).toBe(true);
  });
});
