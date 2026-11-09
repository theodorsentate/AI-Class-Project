"use client";

import { useEffect, useState } from "react";
import { CHECKLIST_KEY, defaultChecklist } from "@/lib/checklist";
import { addBusinessDays, businessDayNumber, formatDueBadge } from "@/lib/dates";
import { loadStartDate, saveStartDate } from "@/lib/hire";
import { useCompany } from "@/context/CompanyContext";

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

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">First week</h1>
        <p className="mt-3 max-w-2xl text-[var(--muted)] leading-7">
          Typical new-hire needs at {company.name}. Hours: {company.workHours}.
          Your buddy is {company.buddyName}. Completed {completed} of{" "}
          {defaultChecklist.length}.
          {day && day > 0 ? ` You are on business day ${day}.` : ""}
        </p>
        <label htmlFor="week-start" className="mt-4 block text-sm font-semibold">
          Your start date
        </label>
        <input
          id="week-start"
          type="date"
          className="mt-2 rounded-xl border border-[var(--line)] p-3"
          value={start}
          onChange={(event) => {
            setStart(event.target.value);
            saveStartDate(event.target.value);
          }}
        />
      </header>
      <ul className="space-y-3">
        {defaultChecklist.map((item) => {
          const due =
            item.dueBusinessDay && start ? addBusinessDays(start, item.dueBusinessDay) : null;
          const today = Boolean(item.dueBusinessDay && day === item.dueBusinessDay);
          return (
          <li key={item.id} className={`card p-5 ${today ? "border-[var(--yellow)]" : ""}`}>
            <div className="flex gap-4">
              <input
                id={item.id}
                type="checkbox"
                className="mt-1 size-5"
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
                {due ? (
                  <p className="mt-2 text-sm font-semibold">{formatDueBadge(due)}</p>
                ) : null}
              </div>
            </div>
          </li>
          );
        })}
      </ul>
    </div>
  );
}
