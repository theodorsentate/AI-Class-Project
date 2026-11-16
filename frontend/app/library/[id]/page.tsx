import Link from "next/link";
import { notFound } from "next/navigation";
import { articles, getArticle } from "@/lib/knowledge";
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

  return (
    <article className="mx-auto max-w-3xl">
      <p className="text-sm font-semibold text-[var(--blue)]">{article.category}</p>
      <h1 className="mt-2 text-3xl font-semibold">{article.title}</h1>
      <p className="mt-6 text-lg leading-8 text-[var(--muted)]">{article.summary}</p>
      <p className="mt-2 text-sm text-[var(--muted)]">Last updated: company handbook on this device</p>
      <details className="mt-6 md:open" open>
        <summary className="cursor-pointer text-sm font-semibold">On this page</summary>
        <nav aria-label="On this page" className="mt-2">
          <a className="text-sm text-[var(--blue)]" href="#article-body">
            Article text
          </a>
        </nav>
      </details>
      <div id="article-body" className="mt-6 space-y-4 text-base leading-8 whitespace-pre-wrap break-words">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      <p className="mt-8 no-print flex flex-wrap items-center gap-4">
        <Link href="/library" className="font-semibold text-[var(--blue)]">
          Back to handbook
        </Link>
        <PrintArticle />
      </p>
    </article>
  );
}
