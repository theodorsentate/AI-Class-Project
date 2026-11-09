import Link from "next/link";
import { StartDateField } from "@/components/StartDateField";
import { UpNext } from "@/components/UpNext";

const actions = [
  {
    href: "/ask",
    title: "Ask privately",
    body: "Get an answer from the handbook. Confidential questions stay on this device unless you send them.",
  },
  {
    href: "/week",
    title: "First week",
    body: "A short list of new-hire needs: access, pay setup, buddy, and benefits windows.",
  },
  {
    href: "/library",
    title: "Handbook",
    body: "Policies written so they work in any business once Company setup is filled in.",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight text-[var(--navy)]">
          One place for new-hire questions
        </h1>
        <p className="mt-4 text-lg leading-8 text-[var(--muted)]">
          Use this when you need a setup step, a policy in plain language, or a
          path that does not go through your manager. People Ops, IT, and the
          ethics hotline are listed whenever the topic is sensitive.
        </p>
      </section>
      <section aria-label="Main actions" className="grid gap-4 md:grid-cols-3">
        {actions.map((action) => (
          <Link key={action.href} href={action.href} className="card p-6 hover:border-[var(--blue)]">
            <h2 className="text-xl font-semibold">{action.title}</h2>
            <p className="mt-3 text-[var(--muted)] leading-7">{action.body}</p>
            <p className="mt-6 text-sm font-semibold text-[var(--blue)]">Open</p>
          </Link>
        ))}
      </section>
      <StartDateField />
      <UpNext />
      <section className="card p-6">
        <h2 className="text-xl font-semibold">Reliable by design</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-[var(--muted)] leading-7">
          <li>Answers are grounded in the handbook, not invented culture tips.</li>
          <li>If confidence is low, you are offered a confidential escalation.</li>
          <li>Company setup lets any business replace the sample name, contacts, and hours.</li>
          <li>This page is keyboard-friendly, labeled, and uses a readable color contrast.</li>
        </ul>
      </section>
    </div>
  );
}
