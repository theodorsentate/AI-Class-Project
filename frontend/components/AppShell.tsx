"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchDialog } from "@/components/SearchDialog";
import { useCompany } from "@/context/CompanyContext";

const links = [
  { href: "/", label: "Home" },
  { href: "/ask", label: "Ask privately" },
  { href: "/week", label: "First week" },
  { href: "/library", label: "Handbook" },
  { href: "/escalate", label: "Send to People Ops or IT" },
  { href: "/support", label: "Need support?" },
  { href: "/setup", label: "Company setup" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { company } = useCompany();

  return (
    <div className="min-h-full bg-[var(--paper)] text-[var(--navy)]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-20 focus:bg-white focus:px-4 focus:py-2 focus:shadow"
      >
        Skip to content
      </a>
      <header className="border-b border-[var(--line)] bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-[var(--blue)] uppercase">
              Employee onboarding
            </p>
            <p className="mt-1 text-2xl font-semibold tracking-tight">{company.name}</p>
            <p className="mt-1 max-w-xl text-sm text-[var(--muted)]">
              Answers, first-week needs, and a private path that does not require your manager.
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <p className="text-sm text-[var(--muted)]">{company.industry}</p>
            <SearchDialog />
          </div>
        </div>
        <nav aria-label="Primary" className="border-t border-[var(--line)]">
          <ul className="mx-auto flex max-w-6xl flex-wrap gap-1 px-4 py-2">
            {links.map((link) => {
              const current =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={current ? "page" : undefined}
                    className={`inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium ${
                      current
                        ? "bg-[var(--navy)] text-white"
                        : "text-[var(--navy)] hover:bg-[var(--wash)]"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>
      <div className="h-1 bg-[var(--yellow)]" />
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        {children}
      </main>
    </div>
  );
}
