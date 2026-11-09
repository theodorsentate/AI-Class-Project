"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CHECKLIST_KEY, defaultChecklist } from "@/lib/checklist";
import { addBusinessDays, businessDayNumber, formatDueBadge } from "@/lib/dates";
import { loadStartDate } from "@/lib/hire";

export function UpNext() {
  const [start, setStart] = useState("");
  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setStart(loadStartDate());
    try {
      setDone(JSON.parse(window.localStorage.getItem(CHECKLIST_KEY) || "{}"));
    } catch {
      setDone({});
    }
  }, []);

  const day = businessDayNumber(start) ?? 0;
  const open = defaultChecklist
    .filter((item) => !done[item.id])
    .map((item) => {
      const due = item.dueBusinessDay && start ? addBusinessDays(start, item.dueBusinessDay) : null;
      return { item, due };
    })
    .sort((a, b) => {
      if (a.due && b.due) {
        return a.due.getTime() - b.due.getTime();
      }
      if (a.due) {
        return -1;
      }
      if (b.due) {
        return 1;
      }
      return 0;
    })
    .slice(0, 3);

  return (
    <section className="card p-6">
      <h2 className="text-xl font-semibold">Up next</h2>
      {open.length === 0 ? (
        <p className="mt-3 text-[var(--muted)]">Checklist complete.</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {open.map(({ item, due }) => (
            <li key={item.id}>
              <Link href="/week" className="font-medium text-[var(--blue)]">
                {item.title}
              </Link>
              {due ? (
                <span className="ml-2 text-sm text-[var(--muted)]">{formatDueBadge(due)}</span>
              ) : null}
              {item.dueBusinessDay && day === item.dueBusinessDay ? (
                <span className="ml-2 text-sm font-semibold">Today</span>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
