import Link from "next/link";
import { resourcesBlock } from "@/lib/safety";

export default function SupportPage() {
  const links = resourcesBlock(true);

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-semibold">Need support?</h1>
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
        <Link href="/escalate" className="btn-primary inline-flex items-center">
          Reach People Ops or IT
        </Link>
      </p>
    </div>
  );
}
