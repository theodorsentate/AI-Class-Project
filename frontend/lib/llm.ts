// One small adapter so the API routes work with either provider.
// ANTHROPIC_API_KEY wins if both are set. No key means "no AI": callers fall back
// to handbook search and templates.

export type LlmProvider = "anthropic" | "openai";

export function llmProvider(env: NodeJS.ProcessEnv = process.env): LlmProvider | null {
  if (env.ANTHROPIC_API_KEY) return "anthropic";
  if (env.OPENAI_API_KEY) return "openai";
  return null;
}

/** Returns the model's raw text, or null if no key is set or the call fails. */
export async function complete(
  system: string,
  user: string,
  env: NodeJS.ProcessEnv = process.env,
): Promise<string | null> {
  const provider = llmProvider(env);
  if (!provider) return null;
  try {
    if (provider === "anthropic") {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": env.ANTHROPIC_API_KEY as string,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: env.ANTHROPIC_MODEL || "claude-haiku-5-5",
          max_tokens: 1500,
          temperature: 0.2,
          system,
          messages: [{ role: "user", content: user }],
        }),
        signal: AbortSignal.timeout(25000),
      });
      if (!response.ok) return null;
      const data = (await response.json()) as { content?: { type?: string; text?: string }[] };
      const text = data.content?.find((part) => part.type === "text")?.text?.trim();
      return text ? stripFence(text) : null;
    }
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0.2,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
      signal: AbortSignal.timeout(25000),
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { choices?: { message?: { content?: string } }[] };
    const text = data.choices?.[0]?.message?.content?.trim();
    return text ? stripFence(text) : null;
  } catch {
    return null;
  }
}

function stripFence(text: string): string {
  return text.replace(/^```(?:json)?\s*|\s*```$/g, "").trim();
}
