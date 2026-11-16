import { resourcesBlock } from "@/lib/safety";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/Card";

export default function SupportPage() {
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
      <p>
        <Button href="/escalate">Reach People Ops or IT</Button>
      </p>
    </div>
  );
}
