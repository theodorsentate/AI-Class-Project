import { defaultCompany } from "@/lib/company";
import { excerptText } from "@/lib/corpus";
import { articles } from "@/lib/knowledge";
import { retrieve } from "@/lib/retrieve";
import type { CompanyProfile } from "@/lib/types";

const TOPICS: Record<string, { team: "people" | "it"; prompt: string }> = {
  benefits: { team: "people", prompt: "benefits enrollment question" },
  access: { team: "it", prompt: "laptop or account access issue" },
  schedule: { team: "people", prompt: "work schedule question" },
  timeoff: { team: "people", prompt: "time off request process" },
};

export function fallbackTemplate(
  team: "people" | "it",
  company: CompanyProfile,
  need: string,
): { subject: string; body: string } {
  const to = team === "people" ? company.peopleEmail : company.itEmail;
  return {
    subject: `New hire request: ${need.slice(0, 60) || "help"}`,
    body: `Hello,\n\nI am a new hire at ${company.name}. I need help with: ${need || "[describe what you need]"}.\n\nPlease reply to this note. My manager is not copied.\n\nThank you\n`,
    to,
  } as { subject: string; body: string };
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    need?: string;
    team?: "people" | "it";
    topic?: string;
    company?: CompanyProfile;
  };
  const topic = body.topic ? TOPICS[body.topic] : null;
  const team = topic?.team ?? body.team ?? "people";
  const company = { ...defaultCompany, ...body.company };
  const need = (body.need || topic?.prompt || "").trim();
  const template = fallbackTemplate(team, company, need);
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return Response.json({ ...template, mode: "template" });
  }
  const hits = retrieve(need, articles, 4);
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content: `Write a short email from a new employee at ${company.name} to ${team === "people" ? "People Ops" : "IT"} (${team === "people" ? company.peopleEmail : company.itEmail}). Plain, polite, one clear ask. Never invent policies. Do not mention AI. Reply JSON only: {"subject": string, "body": string}\n\nHANDBOOK:\n${excerptText(hits.map((hit) => hit.article))}`,
          },
          { role: "user", content: need },
        ],
      }),
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) {
      return Response.json({ ...template, mode: "template" });
    }
    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    let raw = data.choices?.[0]?.message?.content?.trim() ?? "";
    raw = raw.replace(/^```json\s*|\s*```$/g, "");
    const parsed = JSON.parse(raw) as { subject?: string; body?: string };
    return Response.json({
      subject: parsed.subject || template.subject,
      body: parsed.body || template.body,
      to: team === "people" ? company.peopleEmail : company.itEmail,
      mode: "llm",
    });
  } catch {
    return Response.json({ ...template, mode: "template" });
  }
}
