"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { articles } from "@/lib/knowledge";
import { Input, Select } from "@/components/ui/Input";
import { EmptyState, PageHeader } from "@/components/ui/Card";
import { useCompany } from "@/context/CompanyContext";

export default function LibraryPage() {
  const { company } = useCompany();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const categories = ["All", ...new Set(articles.map((article) => article.category))];
  const visible = useMemo(
    () =>
      articles.filter((article) => {
        const catOk = category === "All" || article.category === category;
        const blob = `${article.title} ${article.summary} ${article.body}`.toLowerCase();
        return catOk && (!query || blob.includes(query.toLowerCase()));
      }),
    [query, category],
  );
  const groups = [...new Set(visible.map((article) => article.category))];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Handbook"
        description={`${company.name} handbook sections. Ask privately searches these pages.`}
      />
      <div className="flex flex-wrap gap-4">
        <label className="text-sm font-semibold">
          Search handbook
          <Input value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <label className="text-sm font-semibold">
          Category
          <Select
            className="mt-2 block"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
        </label>
      </div>
      {groups.length > 1 ? (
        <nav aria-label="Jump to a section" className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-4">
          <p className="text-sm font-semibold">Jump to a section</p>
          <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {groups.map((group) => (
              <li key={group}>
                <a className="font-semibold text-[var(--blue)] underline-offset-4 hover:underline" href={`#cat-${group.replace(/\s+/g, "-")}`}>
                  {group}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
      {visible.length === 0 ? (
        <EmptyState title="No matching articles" body="Clear the search or pick another category." />
      ) : null}
      {groups.map((group) => (
          <section key={group} aria-labelledby={`cat-${group.replace(/\s+/g, "-")}`}>
          <h2 id={`cat-${group.replace(/\s+/g, "-")}`} className="scroll-mt-24 text-xl font-semibold">
            {group}
          </h2>
          <ul className="mt-4 grid gap-4 md:grid-cols-2">
            {visible
              .filter((article) => article.category === group)
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
