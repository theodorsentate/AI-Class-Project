"use client";

import { useEffect, useState } from "react";
import { CHECKLIST_KEY, defaultChecklist } from "@/lib/checklist";
import { addBusinessDays, businessDayNumber, formatDueBadge } from "@/lib/dates";
import { loadStartDate, saveStartDate } from "@/lib/hire";
import { useCompany } from "@/context/CompanyContext";
import { Input } from "@/components/ui/Input";
import { Alert, PageHeader } from "@/components/ui/Card";

const sections = ["You", "IT", "People Ops"] as const;

export default function WeekPage() {
  const { company } = useCompany();
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [ready, setReady] = useState(false);
  const [start, setStart] = useState("");

  useEffect(() => {
    const raw = window.localStorage.getItem(CHECKLIST_KEY);
    if (raw) {
      setDone(JSON.parse(raw));
    }
    setStart(loadStartDate());
    setReady(true);
  }, []);

  function toggle(id: string) {
    setDone((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      window.localStorage.setItem(CHECKLIST_KEY, JSON.stringify(next));
      return next;
    });
  }

  const completed = defaultChecklist.filter((item) => done[item.id]).length;
  const day = businessDayNumber(start);
  const allDone = completed === defaultChecklist.length;

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
      {sections.map((section) => {
        const items = defaultChecklist.filter((item) => item.owner === section);
        const doneHere = items.filter((item) => done[item.id]).length;
        return (
          <section key={section} className="space-y-3">
            <h2 className="text-xl font-semibold">
              {section}{" "}
              <span className="text-sm font-medium text-[var(--muted)]">
                {doneHere} of {items.length} done
              </span>
            </h2>
            <ul className="space-y-3">
              {items.map((item) => {
                const due =
                  item.dueBusinessDay && start ? addBusinessDays(start, item.dueBusinessDay) : null;
                const today = Boolean(item.dueBusinessDay && day === item.dueBusinessDay);
                return (
                  <li key={item.id} className={`card p-5 ${today ? "border-[var(--yellow)]" : ""}`}>
                    <div className="flex gap-4">
                      <input
                        id={item.id}
                        type="checkbox"
                        className="mt-1 size-6 min-h-11 min-w-11"
                        checked={Boolean(done[item.id])}
                        disabled={!ready}
                        onChange={() => toggle(item.id)}
                      />
                      <div>
                        <label htmlFor={item.id} className="text-lg font-semibold">
                          {item.title}
                        </label>
                        <p className="mt-1 text-sm text-[var(--blue)]">Owner: {item.owner}</p>
                        <p className="mt-2 leading-7 text-[var(--muted)]">{item.detail}</p>
                        {due ? <p className="mt-2 text-sm font-semibold">{formatDueBadge(due)}</p> : null}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
