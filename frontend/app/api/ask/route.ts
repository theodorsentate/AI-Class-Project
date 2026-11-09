import { composeReply } from "@/lib/compose";
import { defaultCompany } from "@/lib/company";
import { canSendAll, excerptText, fullCorpusText } from "@/lib/corpus";
import { articles as defaultArticles, getArticle } from "@/lib/knowledge";
import { sectionIndex, systemPrompt } from "@/lib/prompts";
import { retrieve } from "@/lib/retrieve";
import type { Article, AskRequest, AssistantReply, CompanyProfile } from "@/lib/types";

function refsFromTitles(titles: string[], pool: Article[]) {
  return titles
    .map((title) => {
      const match =
        pool.find((article) => article.title === title) ||
        pool.find((article) => article.title.toLowerCase() === title.toLowerCase());
      return match ? { id: match.id, title: match.title } : null;
    })
    .filter((item): item is { id: string; title: string } => Boolean(item));
}

function fallback(
  question: string,
  hits: ReturnType<typeof retrieve>,
  company: CompanyProfile,
): AssistantReply {
  return composeReply(question, hits, company);
}

export async function POST(request: Request) {
  const body = (await request.json()) as AskRequest;
  const question = (body.question ?? "").trim();
  const company = { ...defaultCompany, ...body.company };
  const pool = body.articles?.length ? body.articles : defaultArticles;
  const hits = retrieve(question, pool);
  const handbook = fallback(question, hits, company);
  const key = process.env.OPENAI_API_KEY;

  if (!key) {
    return Response.json(handbook);
  }

  const thorough = body.thorough !== false;
  const full = thorough && canSendAll(pool);
  const excerpts = full
    ? fullCorpusText(pool)
    : excerptText(hits.map((hit) => hit.article));
  const snapshot = {
    startDate: body.startDate ?? "",
    doneTitles: body.doneTitles ?? [],
    openTitles: body.openTitles ?? [],
  };

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
            content: systemPrompt(
              excerpts,
              company,
              snapshot,
              full,
              sectionIndex(pool),
            ),
          },
          { role: "user", content: question },
        ],
      }),
      signal: AbortSignal.timeout(20000),
    });

    if (!response.ok) {
      return Response.json(handbook);
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    let raw = data.choices?.[0]?.message?.content?.trim() ?? "";
    raw = raw.replace(/^```json\s*|\s*```$/g, "");
    const parsed = JSON.parse(raw) as {
      answer?: string;
      sources?: string[];
      answerable?: boolean;
      sensitive?: boolean;
      category?: string;
      followups?: string[];
    };
    const titles = Array.isArray(parsed.sources) ? parsed.sources : handbook.sources;
    const sourceRefs = refsFromTitles(titles, pool);
    const text =
      parsed.answerable === false
        ? parsed.answer || handbook.text
        : parsed.answer || handbook.text;

    const reply: AssistantReply = {
      ...handbook,
      text,
      sources: sourceRefs.map((item) => item.title),
      sourceRefs,
      sensitive: Boolean(parsed.sensitive) || handbook.sensitive,
      category: parsed.category || handbook.category,
      followups: parsed.followups,
      escalate: parsed.answerable === false || handbook.escalate,
      mode: "llm",
    };
    if (sourceRefs.length === 0 && parsed.answerable !== false) {
      const top = getArticle(hits[0]?.article.id ?? "");
      if (top) {
        reply.sourceRefs = [{ id: top.id, title: top.title }];
        reply.sources = [top.title];
      }
    }
    return Response.json(reply);
  } catch {
    return Response.json(handbook);
  }
}
