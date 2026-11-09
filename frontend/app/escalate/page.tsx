"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCompany } from "@/context/CompanyContext";

function EscalateForm() {
  const { company } = useCompany();
  const params = useSearchParams();
  const [team, setTeam] = useState<"people" | "it">("people");
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const preset = params.get("q");
    if (preset) {
      setMessage(preset);
    }
  }, [params]);

  const inbox = team === "people" ? company.peopleEmail : company.itEmail;

  return (
    <div className="max-w-2xl space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">Send to People Ops or IT</h1>
        <p className="mt-3 text-[var(--muted)] leading-7">
          Use this when you cannot or do not want to go to your manager. This
          demo stores nothing on a server. In a live deployment, the note would
          go only to {inbox}.
        </p>
      </header>
      {sent ? (
        <div className="card p-6" role="status">
          <h2 className="text-xl font-semibold">Note queued for {inbox}</h2>
          <p className="mt-3 leading-7 text-[var(--muted)]">
            Your manager is not in the copy list. If this is urgent and unsafe,
            call {company.ethicsHotline} or local emergency services.
          </p>
          <button type="button" className="btn-secondary mt-6" onClick={() => setSent(false)}>
            Write another note
          </button>
        </div>
      ) : (
        <form
          className="card space-y-4 p-6"
          onSubmit={(event) => {
            event.preventDefault();
            setSent(true);
            setMessage("");
          }}
        >
          <fieldset>
            <legend className="text-sm font-semibold">Send to</legend>
            <div className="mt-3 flex flex-col gap-2">
              <label className="flex min-h-11 items-center gap-2">
                <input
                  type="radio"
                  name="team"
                  checked={team === "people"}
                  onChange={() => setTeam("people")}
                />
                People Ops ({company.peopleEmail})
              </label>
              <label className="flex min-h-11 items-center gap-2">
                <input
                  type="radio"
                  name="team"
                  checked={team === "it"}
                  onChange={() => setTeam("it")}
                />
                IT ({company.itEmail})
              </label>
            </div>
          </fieldset>
          <div>
            <label htmlFor="note" className="block text-sm font-semibold">
              What do you need?
            </label>
            <textarea
              id="note"
              required
              rows={6}
              className="mt-2 w-full rounded-xl border border-[var(--line)] p-3"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
          </div>
          <p className="text-sm font-semibold">Draft it for me</p>
          <div className="flex flex-wrap gap-2">
            {[
              ["benefits", "Benefits question"],
              ["access", "Laptop or access"],
              ["schedule", "Schedule"],
              ["timeoff", "Time off"],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                className="rounded-full border border-[var(--line)] bg-white px-3 py-2 text-sm"
                onClick={async () => {
                  setTeam(id === "access" ? "it" : "people");
                  const response = await fetch("/api/draft", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      topic: id,
                      need: message,
                      company,
                      team: id === "access" ? "it" : "people",
                    }),
                  });
                  if (response.ok) {
                    const draft = (await response.json()) as { subject: string; body: string };
                    setSubject(draft.subject);
                    setMessage(draft.body);
                  }
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <label htmlFor="subject" className="block text-sm font-semibold">
            Subject
          </label>
          <input
            id="subject"
            className="w-full rounded-xl border border-[var(--line)] p-3"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
          />
          <p className="text-sm text-[var(--muted)]">
            Ethics hotline if email is the wrong channel: {company.ethicsHotline}
          </p>
          <a
            className="btn-secondary inline-flex items-center"
            href={`mailto:${inbox}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`}
          >
            Open in mail app
          </a>
          <button type="submit" className="btn-primary">
            Queue confidential note
          </button>
        </form>
      )}
    </div>
  );
}

export default function EscalatePage() {
  return (
    <Suspense fallback={<p>Loading</p>}>
      <EscalateForm />
    </Suspense>
  );
}
