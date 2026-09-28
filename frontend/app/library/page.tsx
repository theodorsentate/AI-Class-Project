import Link from "next/link";
import { articles } from "@/lib/knowledge";

export default function LibraryPage() {
  const categories = [...new Set(articles.map((article) => article.category))];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold">Handbook</h1>
        <p className="mt-3 max-w-2xl text-[var(--muted)] leading-7">
          Generic, business-ready articles. Replace contacts in Company setup.
          Search by asking the private assistant; this page is for browsing.
        </p>
      </header>
      {categories.map((category) => (
        <section key={category} aria-labelledby={category}>
          <h2 id={category} className="text-xl font-semibold">
            {category}
          </h2>
          <ul className="mt-4 grid gap-4 md:grid-cols-2">
            {articles
              .filter((article) => article.category === category)
              .map((article) => (
                <li key={article.id}>
                  <Link href={`/library/${article.id}`} className="card block p-5 hover:border-[var(--blue)]">
                    <h3 className="font-semibold">{article.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{article.summary}</p>
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
