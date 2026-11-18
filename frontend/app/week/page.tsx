"use client";

import { useEffect, useState } from "react";
import { CHECKLIST_KEY, defaultChecklist } from "@/lib/checklist";
import { addBusinessDays, businessDayNumber, formatDueBadge } from "@/lib/dates";
import { loadStartDate, saveStartDate } from "@/lib/hire";
import { useCompany } from "@/context/CompanyContext";
import { Input } from "@/components/ui/Input";
import { Alert, PageHeader } from "@/components/ui/Card";
import { safeLocal } from "@/lib/safe-storage";

export default function WeekPage() {
  const { company } = useCompany();
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [ready, setReady] = useState(false);
  const [start, setStart] = useState("");

  useEffect(() => {
    const raw = safeLocal.getItem(CHECKLIST_KEY);
    if (raw) {
      setDone(JSON.parse(raw));
    }
    setStart(loadStartDate());
    setReady(true);
  }, []);

  function toggle(id: string) {
    setDone((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      safeLocal.setItem(CHECKLIST_KEY, JSON.stringify(next));
      return next;
    });
  }

  const completed = defaultChecklist.filter((item) => done[item.id]).length;
  const day = businessDayNumber(start);
  const allDone = completed === defaultChecklist.length;
  const ordered = [...defaultChecklist].sort(
    (a, b) => (a.dueBusinessDay ?? 99) - (b.dueBusinessDay ?? 99),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="First week"
        description={`Typical new-hire needs at ${company.name}. Hours: ${company.workHours}. Your buddy is ${company.buddyName}. Completed ${completed} of ${defaultChecklist.length}.${day && day > 0 ? ` You are on business day ${day}.` : ""}`}
      />
      {allDone ? (
        <Alert tone="success">First week list is complete. Keep Ask privately for later questions.</Alert>
      ) : null}
      <label htmlFor="week-start" className="block text-sm font-semibold">
        Your start date
      </label>
      <Input
        id="week-start"
        type="date"
        className="max-w-xs"
        value={start}
        onChange={(event) => {
          setStart(event.target.value);
          saveStartDate(event.target.value);
        }}
      />
      <section className="card p-5" aria-labelledby="progress-h">
        <div className="flex items-baseline justify-between gap-3">
          <h2 id="progress-h" className="text-lg font-semibold">Your progress</h2>
          <p className="text-sm font-semibold">
            {completed} of {defaultChecklist.length} done
          </p>
        </div>
        <div
          className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--wash)]"
          role="progressbar"
          aria-label="First week progress"
          aria-valuemin={0}
          aria-valuemax={defaultChecklist.length}
          aria-valuenow={completed}
        >
          <div
            className="h-full rounded-full bg-[var(--yellow)] transition-[width]"
            style={{ width: `${(completed / defaultChecklist.length) * 100}%` }}
          />
        </div>
        {!start ? (
          <p className="mt-3 text-sm text-[var(--muted)]">Set your start date above to see a due date on each task.</p>
        ) : null}
      </section>
      <ol className="space-y-3">
        {ordered.map((item, index) => {
          const due = item.dueBusinessDay && start ? addBusinessDays(start, item.dueBusinessDay) : null;
          const today = Boolean(item.dueBusinessDay && day === item.dueBusinessDay);
          return (
            <li key={item.id} className={`card p-5 ${today ? "border-[var(--yellow)]" : ""} ${done[item.id] ? "opacity-75" : ""}`}>
              <div className="flex gap-4">
                <input
                  id={item.id}
                  type="checkbox"
                  className="mt-1 size-6 shrink-0"
                  checked={Boolean(done[item.id])}
                  disabled={!ready}
                  onChange={() => toggle(item.id)}
                />
                <div className="min-w-0">
                  <label htmlFor={item.id} className={`block text-lg font-semibold ${done[item.id] ? "line-through decoration-[var(--muted)]" : ""}`}>
                    <span className="sr-only">Task {index + 1}: </span>
                    {item.title}
                  </label>
                  <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                    <span className="rounded-full bg-[var(--wash)] px-2.5 py-0.5 font-medium text-[var(--navy)]">
                      {item.owner === "You" ? "You do this" : `${item.owner} helps`}
                    </span>
                    {item.dueBusinessDay ? (
                      <span className="font-semibold">
                        {due ? formatDueBadge(due) : `Due business day ${item.dueBusinessDay}`}
                        {today ? " · today" : ""}
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-2 leading-7 text-[var(--muted)]">{item.detail}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
