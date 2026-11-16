// In-memory router for the single-file demo. Works inside sandboxed previews where
// following "#/route" links would navigate the frame to about:blank and wipe the page.
import { useSyncExternalStore } from "react";

type Loc = { path: string; query: string };
function parse(href: string): Loc {
  let h = href.replace(/^#/, "");
  const q = h.indexOf("?");
  const path = q >= 0 ? h.slice(0, q) : h;
  return { path: path.startsWith("/") ? path : "/", query: q >= 0 ? h.slice(q) : "" };
}
let loc: Loc = (() => { try { return parse(window.location.hash); } catch { return { path: "/", query: "" }; } })();
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());
function subscribe(f: () => void) { subs.add(f); return () => { subs.delete(f); }; }

export function navigate(href: string) {
  const next = parse(href);
  loc = next;
  try { window.history.replaceState(null, "", "#" + next.path + next.query); } catch { /* sandboxed: ignore */ }
  emit();
}
try {
  window.addEventListener("hashchange", () => { loc = parse(window.location.hash); emit(); });
} catch { /* ignore */ }

export function currentPath(): string { return loc.path; }
export function usePathname(): string {
  return useSyncExternalStore(subscribe, () => loc.path, () => "/");
}
const qCache = { s: "\u0000", v: new URLSearchParams() };
export function useSearchParams(): URLSearchParams {
  const s = useSyncExternalStore(subscribe, () => loc.query, () => "");
  if (qCache.s !== s) { qCache.s = s; qCache.v = new URLSearchParams(s); }
  return qCache.v;
}
export function useRouter() {
  return {
    push: (href: string) => navigate(href),
    replace: (href: string) => navigate(href),
    back: () => { try { window.history.back(); } catch { navigate("/"); } },
    refresh: () => {},
    prefetch: () => {},
  };
}
export function notFound(): never { throw new Error("not found"); }
