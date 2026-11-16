"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCompany } from "@/context/CompanyContext";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { PageHeader } from "@/components/ui/Card";
import { useToast } from "@/context/ToastContext";

const teams = [
  { id: "people", label: "People Ops", time: "Usually one business day" },
  { id: "it", label: "IT", time: "Usually the same business day for access issues" },
  { id: "facilities", label: "Facilities", time: "Usually two business days" },
  { id: "manager", label: "Manager", time: "Only if you choose this path" },
] as const;

function EscalateForm() {
  const { company } = useCompany();
  const params = useSearchParams();
  const toast = useToast();
  const [team, setTeam] = useState<(typeof teams)[number]["id"]>("people");
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const preset = params.get("q");
    if (preset) {
      setMessage(preset);
    }
  }, [params]);

  const inbox =
    team === "it" ? company.itEmail : team === "people" ? company.peopleEmail : company.peopleEmail;

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title="Send to People Ops or IT"
        description={`Use this when you cannot or do not want to go to your manager. This demo stores nothing on a server. In a live deployment, the note would go only to ${inbox}.`}
      />
      {sent ? (
        <div className="card p-6" role="status">
          <h2 className="text-xl font-semibold">Note queued for {inbox}</h2>
          <p className="mt-3 leading-7 text-[var(--muted)]">
            Sent to People Ops. Expect a reply by the next business day. Your
            manager is not in the copy list. If this is urgent and unsafe, call{" "}
            {company.ethicsHotline} or local emergency services.
          </p>
          <Button type="button" variant="secondary" className="mt-6" onClick={() => setSent(false)}>
            Write another note
          </Button>
        </div>
      ) : (
        <form
          className="card space-y-4 p-6"
          onSubmit={(event) => {
            event.preventDefault();
            if (message.trim().length < 8) {
              setError("Write a short note (at least 8 characters) so the team knows what you need.");
              return;
            }
            setError("");
            setSent(true);
            setMessage("");
          }}
        >
          <fieldset>
            <legend className="text-sm font-semibold">Send to</legend>
            <div className="mt-3 flex flex-col gap-2">
              {teams.map((item) => (
                <label key={item.id} className="flex min-h-11 items-start gap-2">
                  <input
                    type="radio"
                    name="team"
                    className="mt-1"
                    checked={team === item.id}
                    onChange={() => setTeam(item.id)}
                  />
                  <span>
                    {item.label}
                    {item.id === "people" ? ` (${company.peopleEmail})` : ""}
                    {item.id === "it" ? ` (${company.itEmail})` : ""}
                    <span className="block text-sm text-[var(--muted)]">{item.time}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <div>
            <label htmlFor="note" className="block text-sm font-semibold">
              What do you need?
            </label>
            <Textarea
              id="note"
              required
              rows={6}
              className="mt-2"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
            {error ? (
              <p className="mt-2 text-sm text-[var(--danger)]" role="alert">
                {error}
              </p>
            ) : null}
          </div>
          <p className="text-sm font-semibold">Draft it for me</p>
          <div className="flex flex-wrap gap-2">
            {[
              ["benefits", "Benefits question"],
              ["access", "Laptop or access"],
              ["schedule", "Schedule"],
              ["timeoff", "Time off"],
            ].map(([id, label]) => (
              <Button
                key={id}
                type="button"
                variant="secondary"
                size="sm"
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
              </Button>
            ))}
          </div>
          <label htmlFor="subject" className="block text-sm font-semibold">
            Subject
          </label>
          <Input
            id="subject"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
          />
          <p className="text-sm text-[var(--muted)]">
            Ethics hotline if email is the wrong channel: {company.ethicsHotline}
          </p>
          <Button
            href={`mailto:${inbox}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`}
            variant="secondary"
          >
            Open in mail app
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={async () => {
              await navigator.clipboard.writeText(`${subject}\n${message}\n${inbox}`);
              toast("Copied note text");
            }}
          >
            Copy note if email is unavailable
          </Button>
          <Button type="submit">Queue confidential note</Button>
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
