"use client";

import { useEffect, useState } from "react";
import { defaultCompany } from "@/lib/company";
import { HANDBOOK_KEY, parseHandbookInput, validateDraft } from "@/lib/handbook-validate";
import { articles, setArticles } from "@/lib/knowledge";
import { useCompany } from "@/context/CompanyContext";
import type { CompanyProfile } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { PageHeader } from "@/components/ui/Card";

const fields: { key: keyof CompanyProfile; label: string; hint: string }[] = [
  { key: "name", label: "Company name", hint: "Shown in the header and answers" },
  { key: "industry", label: "Industry or team type", hint: "Helps new hires know they are in the right place" },
  { key: "peopleEmail", label: "People Ops email", hint: "Pay, leave, conflict, accommodations" },
  { key: "itEmail", label: "IT email", hint: "Accounts, devices, software" },
  { key: "ethicsHotline", label: "Ethics or safety hotline", hint: "Shown for harassment, illegal, or unsafe topics" },
  { key: "buddyName", label: "Default onboarding buddy", hint: "Peer contact, not the manager" },
  { key: "workHours", label: "Core hours", hint: "Repeated on the first-week list" },
  { key: "logoUrl", label: "Logo URL (optional)", hint: "Square or wide. Leave blank if you have no logo." },
];

export default function SetupPage() {
  const { company, update, ready } = useCompany();
  const [draft, setDraft] = useState<CompanyProfile>(company);
  const [hydrated, setHydrated] = useState(false);
  const [saved, setSaved] = useState(false);
  const [handbookText, setHandbookText] = useState("");
  const [handbookMessage, setHandbookMessage] = useState("");
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (ready && !hydrated) {
      setDraft(company);
      setHydrated(true);
    }
  }, [ready, company, hydrated]);

  if (!hydrated) {
    return (
      <div className="max-w-2xl space-y-6">
        <PageHeader
          title="Company setup"
          description={`Point this tool at any business. Values stay in this browser so you can demo without a server. Replace the sample ${defaultCompany.name} profile before you share it with hires.`}
        />
        <p>Loading saved company profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title="Company setup"
        description={`Point this tool at any business. Values stay in this browser so you can demo without a server. Replace the sample ${defaultCompany.name} profile before you share it with hires.`}
      />
      <p className="text-sm font-semibold" aria-live="polite">
        Step {step} of 3 {saved ? "Saved in this browser" : "Not saved yet"}
      </p>
      <form
        className="card space-y-5 p-6"
        onSubmit={(event) => {
          event.preventDefault();
          update(draft);
          setSaved(true);
          setStep(2);
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
            <Input
              id={field.key}
              name={field.key}
              aria-describedby={`${field.key}-hint`}
              className="mt-2"
              value={draft[field.key] || ""}
              onChange={(event) =>
                setDraft({ ...draft, [field.key]: event.target.value })
              }
            />
          </div>
        ))}
        <Button type="submit">Save for this browser</Button>
        {saved ? (
          <p role="status" className="text-sm font-medium text-[var(--blue)]">
            Saved. The header now uses {draft.name}.
          </p>
        ) : null}
      </form>
      <form
        className="card space-y-4 p-6"
        onSubmit={(event) => {
          event.preventDefault();
          const parsed = parseHandbookInput(handbookText);
          if (!parsed.articles) {
            setHandbookMessage(parsed.error || "Could not read that handbook.");
            return;
          }
          const problems = validateDraft(parsed.articles);
          if (problems.length) {
            setHandbookMessage(problems[0] + (problems.length > 1 ? ` (and ${problems.length - 1} more)` : ""));
            return;
          }
          setArticles(parsed.articles);
          try {
            window.localStorage.setItem(HANDBOOK_KEY, JSON.stringify({ sections: parsed.articles }));
          } catch {
            setHandbookMessage("Saved in memory only. This browser blocked local storage.");
            return;
          }
          setHandbookMessage(`Saved ${parsed.articles.length} sections on this device.`);
          setStep(3);
        }}
      >
        <h2 className="text-xl font-semibold">Handbook editor</h2>
        <p className="text-sm text-[var(--muted)]">
          Paste JSON with a sections array, or markdown with ## headings. Unsafe HTML is
          stripped. Blank titles, duplicate ids, and oversize drafts are rejected.
        </p>
        <label htmlFor="handbook-draft" className="block text-sm font-semibold">
          Handbook JSON or markdown
        </label>
        <Textarea
          id="handbook-draft"
          rows={10}
          className="font-mono text-sm"
          value={handbookText}
          onChange={(event) => setHandbookText(event.target.value)}
        />
        <Button type="submit">Validate and save handbook</Button>
        {handbookMessage ? (
          <p role="status" className="text-sm">
            {handbookMessage}
          </p>
        ) : null}
        <p className="text-sm text-[var(--muted)]">
          Built-in sections on this device: {articles.length}.
        </p>
      </form>
    </div>
  );
}
