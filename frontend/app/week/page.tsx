"use client";

import { useEffect, useState } from "react";
import { CHECKLIST_KEY, defaultChecklist } from "@/lib/checklist";
import { useCompany } from "@/context/CompanyContext";

export default function WeekPage() {
  const { company } = useCompany();
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(CHECKLIST_KEY);
    if (raw) {
      setDone(JSON.parse(raw));
    }
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

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">First week</h1>
        <p className="mt-3 max-w-2xl text-[var(--muted)] leading-7">
          Typical new-hire needs at {company.name}. Hours: {company.workHours}.
          Your buddy is {company.buddyName}. Completed {completed} of{" "}
          {defaultChecklist.length}.
        </p>
      </header>
      <ul className="space-y-3">
        {defaultChecklist.map((item) => (
          <li key={item.id} className="card p-5">
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
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
