import Link from "next/link";
import { notFound } from "next/navigation";
import { articles, getArticle } from "@/lib/knowledge";
import { Button } from "@/components/ui/Button";
import { PrintArticle } from "@/components/PrintArticle";

export function generateStaticParams() {
  return articles.map((article) => ({ id: article.id }));
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = getArticle(id);
  if (!article) {
    notFound();
  }

  const paragraphs = article.body.split(/\n{2,}/).filter(Boolean);
  const siblings = articles.filter((item) => item.category === article.category);
  const index = siblings.findIndex((item) => item.id === article.id);
  const prev = index > 0 ? siblings[index - 1] : undefined;
  const next = index < siblings.length - 1 ? siblings[index + 1] : undefined;

  return (
    <article className="max-w-3xl">
      <p className="text-sm font-semibold text-[var(--blue)]">{article.category}</p>
      <h1 className="mt-2 text-3xl font-semibold">{article.title}</h1>
      <div className="mt-6 rounded-[var(--radius)] border border-[var(--line)] border-l-[4px] border-l-[var(--yellow)] bg-[var(--wash)] p-4">
        <p className="text-sm font-semibold">In short</p>
        <p className="mt-1 text-lg leading-8">{article.summary}</p>
      </div>
      <div id="article-body" className="mt-6 space-y-4 text-base leading-8 whitespace-pre-wrap break-words">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      {prev || next ? (
        <nav aria-label="More in this section" className="no-print mt-10 grid gap-4 sm:grid-cols-2">
          {prev ? (
            <Link href={`/library/${prev.id}`} className="card block p-4 hover:border-[var(--blue)]">
              <span className="text-sm text-[var(--muted)]">Previous in {article.category}</span>
              <span className="mt-1 block font-semibold">{prev.title}</span>
            </Link>
          ) : <span />}
          {next ? (
            <Link href={`/library/${next.id}`} className="card block p-4 hover:border-[var(--blue)] sm:text-right">
              <span className="text-sm text-[var(--muted)]">Next in {article.category}</span>
              <span className="mt-1 block font-semibold">{next.title}</span>
            </Link>
          ) : null}
        </nav>
      ) : null}
      <div className="no-print mt-8 flex flex-wrap items-center gap-3">
        <Button href="/library" variant="secondary" size="sm">
          Back to handbook
        </Button>
        <Button href="/ask" variant="secondary" size="sm">
          Ask a question about this
        </Button>
        <PrintArticle />
      </div>
    </article>
  );
}
