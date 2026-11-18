"use client";

import { useCompany } from "@/context/CompanyContext";
import { resourcesBlock } from "@/lib/safety";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/Card";

export default function SupportPage() {
  const { company } = useCompany();
  const links = resourcesBlock(true);

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title="Need support?" />
      <p className="leading-7 text-[var(--muted)]">
        If you or someone else is in immediate danger, call your local emergency
        number (911 in the US). You do not have to go through your manager.
      </p>
      <ul className="card space-y-4 p-6">
        {links.map((item) => (
          <li key={item.href}>
            <a href={item.href} className="font-semibold text-[var(--blue)]">
              {item.label}
            </a>
            <p className="text-sm text-[var(--muted)]">{item.detail}</p>
          </li>
        ))}
      </ul>
      <section className="card p-6" aria-labelledby="not-crisis">
        <h2 id="not-crisis" className="text-lg font-semibold">Something at work, not an emergency?</h2>
        <p className="mt-2 leading-7 text-[var(--muted)]">
          For anything unsafe, illegal or unethical, call the ethics hotline at{" "}
          <a className="font-semibold text-[var(--blue)]" href={`tel:${company.ethicsHotline.replace(/[^\d+]/g, "")}`}>
            {company.ethicsHotline}
          </a>
          . For pay, leave, accommodations or a concern about a person, email People Ops. Neither goes to your manager.
        </p>
        <p className="mt-4">
          <Button href="/escalate">Email for help</Button>
        </p>
      </section>
    </div>
  );
}
