import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticle } from "@/lib/knowledge";

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

  return (
    <article className="mx-auto max-w-3xl">
      <p className="text-sm font-semibold text-[var(--blue)]">{article.category}</p>
      <h1 className="mt-2 text-3xl font-semibold">{article.title}</h1>
      <p className="mt-6 text-lg leading-8 text-[var(--muted)]">{article.summary}</p>
      <p className="mt-6 text-base leading-8">{article.body}</p>
      <p className="mt-8">
        <Link href="/library" className="font-semibold text-[var(--blue)]">
          Back to handbook
        </Link>
      </p>
    </article>
  );
}
