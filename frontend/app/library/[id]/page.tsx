import Link from "next/link";
import { notFound } from "next/navigation";
import { articles, getArticle } from "@/lib/knowledge";

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
      <div className="mt-6 space-y-4 text-base leading-8 whitespace-pre-wrap">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      <p className="mt-8">
        <Link href="/library" className="font-semibold text-[var(--blue)]">
          Back to handbook
        </Link>
      </p>
    </article>
  );
}
