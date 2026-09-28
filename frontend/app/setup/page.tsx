"use client";

import { useEffect, useState } from "react";
import { defaultCompany } from "@/lib/company";
import { useCompany } from "@/context/CompanyContext";
import type { CompanyProfile } from "@/lib/types";

const fields: { key: keyof CompanyProfile; label: string; hint: string }[] = [
  { key: "name", label: "Company name", hint: "Shown in the header and answers" },
  { key: "industry", label: "Industry or team type", hint: "Helps new hires know they are in the right place" },
  { key: "peopleEmail", label: "People Ops email", hint: "Pay, leave, conflict, accommodations" },
  { key: "itEmail", label: "IT email", hint: "Accounts, devices, software" },
  { key: "ethicsHotline", label: "Ethics or safety hotline", hint: "Shown for harassment, illegal, or unsafe topics" },
  { key: "buddyName", label: "Default onboarding buddy", hint: "Peer contact, not the manager" },
  { key: "workHours", label: "Core hours", hint: "Repeated on the first-week list" },
];

export default function SetupPage() {
  const { company, update, ready } = useCompany();
  const [draft, setDraft] = useState<CompanyProfile>(company);
  const [hydrated, setHydrated] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (ready && !hydrated) {
      setDraft(company);
      setHydrated(true);
    }
  }, [ready, company, hydrated]);

  return (
    <div className="max-w-2xl space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">Company setup</h1>
        <p className="mt-3 text-[var(--muted)] leading-7">
          Point this tool at any business. Values stay in this browser so you
          can demo without a server. Replace the sample {defaultCompany.name}{" "}
          profile before you share it with hires.
        </p>
      </header>
      <form
        className="card space-y-5 p-6"
        onSubmit={(event) => {
          event.preventDefault();
          update(draft);
          setSaved(true);
        }}
      >
        {fields.map((field) => (
          <div key={field.key}>
            <label htmlFor={field.key} className="block text-sm font-semibold">
              {field.label}
            </label>
            <p id={`${field.key}-hint`} className="text-sm text-[var(--muted)]">
              {field.hint}
            </p>
            <input
              id={field.key}
              name={field.key}
              aria-describedby={`${field.key}-hint`}
              className="mt-2 w-full rounded-xl border border-[var(--line)] p-3"
              value={draft[field.key]}
              onChange={(event) =>
                setDraft({ ...draft, [field.key]: event.target.value })
              }
            />
          </div>
        ))}
        <button type="submit" className="btn-primary">
          Save for this browser
        </button>
        {saved ? (
          <p role="status" className="text-sm font-medium text-[var(--blue)]">
            Saved. The header now uses {draft.name}.
          </p>
        ) : null}
      </form>
    </div>
  );
}
