"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { searchAll, type SearchHit } from "@/lib/search";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function SearchDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const hits = searchAll(query);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setActive(0);
      queueMicrotask(() => inputRef.current?.focus());
    }
  }, [open]);

  function close() {
    setOpen(false);
    setQuery("");
  }

  function go(hit: SearchHit) {
    close();
    router.push(hit.href);
  }

  function onPanelKey(event: React.KeyboardEvent) {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => Math.min(index + 1, hits.length - 1));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => Math.max(index - 1, 0));
    }
    if (event.key === "Enter" && hits[active]) {
      event.preventDefault();
      go(hits[active]);
    }
    if (event.key === "Tab" && panelRef.current) {
      const focusable = panelRef.current.querySelectorAll<HTMLElement>("input, button");
      if (focusable.length === 0) {
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  return (
    <>
      <Button type="button" variant="secondary" onClick={() => setOpen(true)}>
        Search
      </Button>
      {open ? (
        <div
          className="fixed inset-0 z-40 bg-black/30"
          onClick={close}
        >
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="search-title"
            className="card mx-auto mt-24 max-w-xl p-4"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={onPanelKey}
          >
            <div className="flex items-center justify-between gap-3">
              <h2 id="search-title" className="text-lg font-semibold">
                Search
              </h2>
              <Button type="button" variant="ghost" size="sm" onClick={close}>
                Close
              </Button>
            </div>
            <label htmlFor="site-search" className="mt-3 block text-sm font-semibold">
              Find a page, handbook section, or ask
            </label>
            <Input
              ref={inputRef}
              id="site-search"
              className="mt-2"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActive(0);
              }}
            />
            <ul className="mt-3 max-h-80 overflow-auto">
              {hits.map((hit, index) => (
                <li key={hit.href + hit.title}>
                  <button
                    type="button"
                    className={`w-full rounded-xl px-3 py-2 text-left ${
                      index === active ? "bg-[var(--wash)]" : ""
                    }`}
                    onClick={() => go(hit)}
                  >
                    <span className="font-medium">{hit.title}</span>
                    <span className="block text-sm text-[var(--muted)]">{hit.detail}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );
}
