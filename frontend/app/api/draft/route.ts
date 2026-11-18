import { defaultCompany } from "@/lib/company";
import { excerptText } from "@/lib/corpus";
import { complete, llmProvider } from "@/lib/llm";
import { articles } from "@/lib/knowledge";
import { retrieve } from "@/lib/retrieve";
import { DRAFT_TOPICS, fallbackTemplate } from "@/lib/draft";
import type { CompanyProfile } from "@/lib/types";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    need?: string;
    team?: "people" | "it";
    topic?: string;
    company?: CompanyProfile;
  };
  const topic = body.topic ? DRAFT_TOPICS[body.topic] : null;
  const team = topic?.team ?? body.team ?? "people";
  const company = { ...defaultCompany, ...body.company };
  const need = (body.need || topic?.prompt || "").trim();
  const template = fallbackTemplate(team, company, need);
  if (!llmProvider()) {
    return Response.json({ ...template, mode: "template" });
  }
  const hits = retrieve(need, articles, 4);
  try {
    const raw = await complete(
      `Write a short email from a new employee at ${company.name} to ${team === "people" ? "People Ops" : "IT"} (${team === "people" ? company.peopleEmail : company.itEmail}). Plain, polite, one clear ask. Never invent policies. Do not mention AI. Reply JSON only: {"subject": string, "body": string}\n\nHANDBOOK:\n${excerptText(hits.map((hit) => hit.article))}`,
      need,
    );
    if (!raw) {
      return Response.json({ ...template, mode: "template" });
    }
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
