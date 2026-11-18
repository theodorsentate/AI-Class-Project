"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HelpCircle, Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { getArticle } from "@/lib/knowledge";
import { Button } from "@/components/ui/Button";
import { SearchDialog } from "@/components/SearchDialog";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const dark =
    theme === "dark" ||
    (typeof document !== "undefined" &&
      theme === "system" &&
      document.documentElement.classList.contains("dark"));
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      aria-pressed={dark}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(dark ? "light" : "dark")}
    >
      {dark ? <Sun size={18} aria-hidden /> : <Moon size={18} aria-hidden />}
      <span className="hidden sm:inline">{dark ? "Light" : "Dark"}</span>
    </Button>
  );
}

export function GetHelpLink() {
  return (
    <Link href="/escalate" className="inline-flex min-h-11 items-center gap-2 font-semibold text-[var(--blue)] underline-offset-2 hover:underline">
      <HelpCircle size={18} aria-hidden />
      <span className="hidden sm:inline">Get help</span>
      <span className="sr-only sm:hidden">Get help</span>
    </Link>
  );
}

export function SearchControl() {
  return <SearchDialog />;
}

export function Breadcrumbs() {
  const pathname = usePathname();
  if (!pathname.startsWith("/library/") || pathname === "/library") {
    return null;
  }
  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-sm">
      <ol className="flex min-w-0 gap-2">
        <li>
          <Link href="/library" className="text-[var(--blue)]">
            Handbook
          </Link>
        </li>
        <li aria-hidden>/</li>
        <li aria-current="page" className="min-w-0 truncate">
          {getArticle(pathname.split("/")[2])?.title ?? "Article"}
        </li>
      </ol>
    </nav>
  );
}

export function AppFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--line)] px-6 py-6 text-sm text-[var(--muted)]">
      <p>
        Answers come from your company handbook and may be incomplete. For anything
        sensitive, use Get help or Need support.{" "}
        <Link href="/escalate?q=Report%20a%20problem%20with%20this%20answer" className="text-[var(--blue)] underline">
          Report a problem with this answer
        </Link>
        .
      </p>
    </footer>
  );
}
