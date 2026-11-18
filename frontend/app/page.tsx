import Link from "next/link";
import { StartDateField } from "@/components/StartDateField";
import { UpNext } from "@/components/UpNext";
import { Welcome } from "@/components/Welcome";
import { Card, PageHeader } from "@/components/ui/Card";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="One place for new-hire questions"
        description="Ask the handbook a question, or work through your first week."
      />
      <Welcome />
      <div className="grid gap-6 md:grid-cols-2 md:items-start">
        <UpNext />
        <StartDateField />
      </div>
      <section aria-label="Main actions" className="grid gap-4 md:grid-cols-3">
        {[
          { href: "/ask", title: "Ask privately", body: "Handbook answers. Confidential unless you send them." },
          { href: "/week", title: "First week", body: "Access, pay setup, buddy, and benefits windows." },
          { href: "/library", title: "Handbook", body: "Policies you can browse or print." },
        ].map((action) => (
          <Link key={action.href} href={action.href}>
            <Card className="h-full p-6 hover:border-[var(--blue)]">
              <h2 className="text-xl font-semibold">{action.title}</h2>
              <p className="mt-3 leading-7 text-[var(--muted)]">{action.body}</p>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  );
}
