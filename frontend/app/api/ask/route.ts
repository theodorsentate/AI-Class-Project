import { composeReply } from "@/lib/compose";
import { defaultCompany } from "@/lib/company";
import { articles } from "@/lib/knowledge";
import { retrieve } from "@/lib/retrieve";
import type { AssistantReply, CompanyProfile } from "@/lib/types";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    question?: string;
    company?: CompanyProfile;
  };
  const question = (body.question ?? "").trim();
  const company = { ...defaultCompany, ...body.company };
  const hits = retrieve(question, articles);
  const handbook = composeReply(question, hits, company);
  const key = process.env.OPENAI_API_KEY;

  if (!key || hits.length === 0) {
    return Response.json(handbook);
  }

  const context = hits
    .map((hit) => `${hit.article.title}: ${hit.article.body}`)
    .join("\n\n");

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
          content:
            "You are an employee onboarding assistant. Answer only from the handbook excerpts. If the excerpts are not enough, say so and tell the hire to escalate to People Ops or IT, not their manager. Do not use emoji. Plain language. Short.",
        },
        {
          role: "user",
          content: `Company: ${company.name}. Hours: ${company.workHours}. People Ops: ${company.peopleEmail}. IT: ${company.itEmail}. Hotline: ${company.ethicsHotline}.\n\nHandbook:\n${context}\n\nQuestion:\n${question}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    return Response.json(handbook);
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) {
    return Response.json(handbook);
  }

  const reply: AssistantReply = {
    ...handbook,
    text,
    mode: "llm",
  };
  return Response.json(reply);
}
