import Link from "next/link";
import { StartDateField } from "@/components/StartDateField";
import { UpNext } from "@/components/UpNext";
import { Button } from "@/components/ui/Button";
import { Card, PageHeader } from "@/components/ui/Card";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="One place for new-hire questions"
        description="Start with the next incomplete task, or ask the handbook without going through your manager."
      />
      <Card className="p-6">
        <h2 className="text-lg font-semibold">What you should do next</h2>
        <p className="mt-2 max-w-[72ch] text-[var(--muted)]">
          Ask a question now if you are stuck. Otherwise open First week and finish the next item.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button href="/ask">Ask the assistant</Button>
          <Button href="/week" variant="secondary">
            Open first week
          </Button>
        </div>
      </Card>
      <StartDateField />
      <UpNext />
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
