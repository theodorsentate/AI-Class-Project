import { defaultCompany } from "@/lib/company";
import { excerptText } from "@/lib/corpus";
import { complete, llmProvider } from "@/lib/llm";
import { articles } from "@/lib/knowledge";
import { retrieve } from "@/lib/retrieve";
import { DRAFT_TOPICS, TEAM_INFO, inboxFor, localDraft, type DraftTeam } from "@/lib/draft";
import type { CompanyProfile } from "@/lib/types";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    need?: string;
    team?: DraftTeam;
    topic?: string;
    company?: CompanyProfile;
  };
  const topic = body.topic ? DRAFT_TOPICS[body.topic] : undefined;
  const team: DraftTeam = topic?.team ?? body.team ?? "people";
  const company = { ...defaultCompany, ...body.company };
  const need = (body.need || "").trim();
  const template = localDraft(body.topic, need, company);
  if (!llmProvider()) {
    return Response.json({ subject: template.subject, body: template.body, to: template.to, mode: "template" });
  }
  const hits = retrieve(`${topic?.prompt ?? ""} ${need}`.trim() || "help", articles, 4);
  const to = inboxFor(team, company);
  const system = `You write a first email from a new employee to an internal team. Write it so the team can act on it without a follow-up question.

FROM: ${company.hireName || "the new hire"}${company.hireRole ? `, ${company.hireRole}` : ""}, at ${company.name}
TO: ${TEAM_INFO[team].label} (${to}), which handles: ${TEAM_INFO[team].handles}
TOPIC: ${topic?.prompt ?? "a request"}

Rules:
- 60 to 120 words in the body. Plain, warm and direct, like a capable colleague. No filler such as "I hope this email finds you well".
- Open with "Hello ${TEAM_INFO[team].label}," then one line saying who they are, then the ask in the first two sentences.
- Use ONLY the facts the person gave plus the handbook excerpts. Where a detail they did not give is needed (a date, an amount, an account name), write a short placeholder in square brackets such as [pay date]. Never invent facts, names, dates or policies.
- Name the handbook rule only when it helps, for example the business day 10 benefits deadline.
- End with a clear next step they want from the team, then "Thank you," and the sender's name.
- Subject line under 60 characters, specific, no "URGENT".
- If the person describes harassment, safety or a mental health struggle, keep the email short, ask for a private conversation, and mention the ethics hotline ${company.ethicsHotline}.
- Do not mention AI. Do not copy the manager.
Reply with JSON only: {"subject": string, "body": string}

HANDBOOK:
${excerptText(hits.map((hit) => hit.article))}`;
  try {
    const raw = await complete(system, need || template.body);
    if (!raw) {
      return Response.json({ subject: template.subject, body: template.body, to, mode: "template" });
    }
    const parsed = JSON.parse(raw.replace(/^```(?:json)?|```$/g, "").trim()) as { subject?: string; body?: string };
    return Response.json({
      subject: parsed.subject || template.subject,
      body: parsed.body || template.body,
      to,
      mode: "llm",
    });
  } catch {
    return Response.json({ subject: template.subject, body: template.body, to, mode: "template" });
  }
}
