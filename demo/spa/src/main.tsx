// A static file has no server. Answer the app's own /api calls with "unavailable" so it
// uses its built-in handbook search, instead of the browser logging a failed network request.
const realFetch = window.fetch.bind(window);
window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
  const url = typeof input === "string" ? input : input instanceof URL ? input.pathname : input.url;
  if (url.startsWith("/api/")) return Promise.resolve(new Response("{}", { status: 503 }));
  return realFetch(input, init);
};

import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./app/globals.css";
import { AppShell } from "@/components/AppShell";
import { CompanyProvider } from "@/context/CompanyContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/context/ToastContext";
import { usePathname } from "next/navigation";
import Home from "./app/page";
import Ask from "./app/ask/page";
import Week from "./app/week/page";
import Library from "./app/library/page";
import ArticlePage from "./app/library/[id]/page";
import Escalate from "./app/escalate/page";
import Setup from "./app/setup/page";
import People from "./app/people/page";
import Data from "./app/data/page";
import Support from "./app/support/page";
import NotFound from "./app/not-found";

function Article({ id }: { id: string }) {
  const [node, setNode] = useState<React.ReactNode>(null);
  useEffect(() => {
    let live = true;
    (ArticlePage as unknown as (a: { params: Promise<{ id: string }> }) => Promise<React.ReactNode>)({ params: Promise.resolve({ id }) })
      .then((n) => live && setNode(n)).catch(() => live && setNode(<NotFound />));
    return () => { live = false; };
  }, [id]);
  return <>{node}</>;
}
function Router() {
  const p = usePathname();
  useEffect(() => { try { window.scrollTo(0, 0); } catch { /* ignore */ } }, [p]);
  if (p === "/") return <Home />;
  if (p === "/ask") return <Ask />;
  if (p === "/week") return <Week />;
  if (p === "/library") return <Library />;
  if (p.startsWith("/library/")) return <Article id={decodeURIComponent(p.slice(9))} />;
  if (p === "/escalate") return <Escalate />;
  if (p === "/setup") return <Setup />;
  if (p === "/people") return <People />;
  if (p === "/data") return <Data />;
  if (p === "/support") return <Support />;
  return <NotFound />;
}
document.addEventListener("click", (e) => {
  const a = (e.target as Element | null)?.closest?.("a[href^='#']") as HTMLAnchorElement | null;
  if (!a || e.defaultPrevented) return;
  const h = a.getAttribute("href") || "";
  if (h.startsWith("#/")) return; // routed by Link
  e.preventDefault();
  const el = document.getElementById(h.slice(1));
  if (el) el.scrollIntoView({ block: "start" });
});
createRoot(document.getElementById("root")!).render(
  <ThemeProvider><ToastProvider><CompanyProvider><AppShell><Router /></AppShell></CompanyProvider></ToastProvider></ThemeProvider>
);
