import { afterEach, describe, expect, it, vi } from "vitest";
import { complete, llmProvider } from "./llm";

afterEach(() => vi.restoreAllMocks());

describe("llm adapter", () => {
  it("picks a provider from the environment", () => {
    expect(llmProvider({} as NodeJS.ProcessEnv)).toBeNull();
    expect(llmProvider({ OPENAI_API_KEY: "o" } as unknown as NodeJS.ProcessEnv)).toBe("openai");
    expect(
      llmProvider({ OPENAI_API_KEY: "o", ANTHROPIC_API_KEY: "a" } as unknown as NodeJS.ProcessEnv),
    ).toBe("anthropic");
  });

  it("returns null without a key and never calls the network", async () => {
    const spy = vi.spyOn(globalThis, "fetch");
    expect(await complete("s", "q", {} as NodeJS.ProcessEnv)).toBeNull();
    expect(spy).not.toHaveBeenCalled();
  });

  it("calls the Anthropic Messages API and strips code fences", async () => {
    const spy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ content: [{ type: "text", text: "```json\n{\"answer\":\"hi\"}\n```" }] }), {
        status: 200,
      }),
    );
    const out = await complete("sys", "question", { ANTHROPIC_API_KEY: "k" } as unknown as NodeJS.ProcessEnv);
    expect(out).toBe('{"answer":"hi"}');
    const [url, init] = spy.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.anthropic.com/v1/messages");
    expect((init.headers as Record<string, string>)["x-api-key"]).toBe("k");
    const body = JSON.parse(init.body as string);
    expect(body.system).toBe("sys");
    expect(body.messages[0]).toEqual({ role: "user", content: "question" });
  });

  it("calls OpenAI when only that key is set", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ choices: [{ message: { content: "ok" } }] }), { status: 200 }),
    );
    expect(await complete("s", "q", { OPENAI_API_KEY: "k" } as unknown as NodeJS.ProcessEnv)).toBe("ok");
  });

  it("returns null on a provider error or a network failure", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(new Response("no", { status: 500 }));
    expect(await complete("s", "q", { ANTHROPIC_API_KEY: "k" } as unknown as NodeJS.ProcessEnv)).toBeNull();
    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(new Error("down"));
    expect(await complete("s", "q", { ANTHROPIC_API_KEY: "k" } as unknown as NodeJS.ProcessEnv)).toBeNull();
  });
});
