"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Calendar, Database, HelpCircle, Home, MessageCircle, MoreHorizontal, Users } from "lucide-react";
import { AppFooter, Breadcrumbs, GetHelpLink, SearchControl, ThemeToggle } from "@/components/ui/PageChrome";
import { useCompany } from "@/context/CompanyContext";
import { HANDBOOK_KEY, sanitizeHandbook } from "@/lib/handbook-validate";
import { setArticles } from "@/lib/knowledge";

const groups = [
  {
    label: "Today",
    items: [
      { href: "/", label: "Home", icon: Home },
      { href: "/week", label: "First week", icon: Calendar },
    ],
  },
  {
    label: "Ask",
    items: [{ href: "/ask", label: "Ask privately", icon: MessageCircle }],
  },
  {
    label: "Library",
    items: [
      { href: "/library", label: "Handbook", icon: BookOpen },
      { href: "/people", label: "People", icon: Users },
      { href: "/data", label: "Data", icon: Database },
    ],
  },
  {
    label: "Get help",
    items: [
      { href: "/escalate", label: "Send to People Ops or IT", icon: HelpCircle },
      { href: "/support", label: "Need support?", icon: HelpCircle },
      { href: "/setup", label: "Company setup", icon: MoreHorizontal },
    ],
  },
];

const mobile = [
  { href: "/", label: "Home", icon: Home },
  { href: "/ask", label: "Ask", icon: MessageCircle },
  { href: "/library", label: "Library", icon: BookOpen },
  { href: "/escalate", label: "Get help", icon: HelpCircle },
];

function isCurrent(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

function BrandMark() {
  const { company } = useCompany();
  const accent = company.accent || "var(--yellow)";
  return (
    <div className="flex min-w-0 items-center gap-3">
      {company.logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={company.logoUrl}
          alt=""
          width={120}
          height={32}
          className="h-8 w-auto max-w-[120px] object-contain"
        />
      ) : null}
      <p className="min-w-0 break-words font-semibold" style={{ borderBottomColor: accent }}>
        {company.name}
      </p>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { company } = useCompany();
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(HANDBOOK_KEY);
      if (!raw) {
        return;
      }
      const clean = sanitizeHandbook(JSON.parse(raw) as unknown);
      if (clean) {
        setArticles(clean);
      }
    } catch {
      // Keep the built-in handbook.
    }
  }, []);

  useEffect(() => {
    const titles: Record<string, string> = {
      "/": "Home",
      "/ask": "Ask privately",
      "/week": "First week",
      "/library": "Handbook",
      "/people": "People",
      "/data": "Data",
      "/escalate": "Send to People Ops or IT",
      "/support": "Need support?",
      "/setup": "Company setup",
    };
    const page = titles[pathname] || (pathname.startsWith("/library/") ? "Handbook article" : "Onboarding");
    document.title = `${page} | ${company.name}`;
  }, [pathname, company.name]);

  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-dvh bg-[var(--paper)] text-[var(--navy)]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[var(--z-dialog)] focus:bg-[var(--surface)] focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <aside aria-label="Sidebar" className="no-print hidden w-64 shrink-0 border-r border-[var(--line)] bg-[var(--surface)] md:block">
        <div className="px-4 py-5">
          <p className="text-xs font-semibold tracking-[0.16em] text-[var(--blue)] uppercase">
            Employee onboarding
          </p>
          <div className="mt-2">
            <BrandMark />
          </div>
        </div>
        <nav aria-label="Primary" className="px-2 pb-6">
          {groups.map((group) => (
            <div key={group.label} className="mb-4">
              <p className="px-3 text-xs font-semibold uppercase text-[var(--muted)]">{group.label}</p>
              <ul>
                {group.items.map((item) => {
                  const current = isCurrent(pathname, item.href);
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={current ? "page" : undefined}
                        className={`mt-1 flex min-h-11 items-center gap-2 rounded-[var(--radius)] px-3 text-sm font-medium ${
                          current ? "bg-[var(--navy)] text-[var(--paper)]" : "hover:bg-[var(--wash)]"
                        }`}
                      >
                        <Icon size={18} aria-hidden />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="no-print border-b border-[var(--line)] bg-[var(--surface)]" role="banner">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-8">
            <BrandMark />
            <div className="ml-auto flex flex-wrap items-center gap-2">
              <SearchControl />
              <GetHelpLink />
              <ThemeToggle />
            </div>
          </div>
          <div className="h-1 bg-[var(--yellow)]" />
        </header>
        <main id="main" className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-8 pb-24 md:px-8 md:pb-8">
          <Breadcrumbs />
          {children}
        </main>
        <AppFooter />
        <nav
          aria-label="Mobile"
          className="no-print sticky bottom-0 z-[var(--z-nav)] border-t border-[var(--line)] bg-[var(--surface)] md:hidden"
        >
          <ul className="grid grid-cols-5">
            {mobile.map((item) => {
              const current = isCurrent(pathname, item.href);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    className={`flex min-h-14 flex-col items-center justify-center text-xs ${
                      current ? "font-semibold text-[var(--blue)]" : ""
                    }`}
                  >
                    <Icon size={18} aria-hidden />
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li>
              <button
                type="button"
                className="flex min-h-14 w-full flex-col items-center justify-center text-xs"
                aria-expanded={moreOpen}
                onClick={() => setMoreOpen((open) => !open)}
              >
                <MoreHorizontal size={18} aria-hidden />
                More
              </button>
            </li>
          </ul>
          {moreOpen ? (
            <ul className="border-t border-[var(--line)] p-3">
              {[
                { href: "/week", label: "First week" },
                { href: "/people", label: "People" },
                { href: "/data", label: "Data" },
                { href: "/support", label: "Need support?" },
                { href: "/setup", label: "Company setup" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="flex min-h-11 items-center px-2 text-sm font-medium">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </nav>
      </div>
    </div>
  );
}
