"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCompany } from "@/context/CompanyContext";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { PageHeader } from "@/components/ui/Card";
import { useToast } from "@/context/ToastContext";
import {
  DRAFT_ORDER,
  DRAFT_TOPICS,
  TEAM_INFO,
  hasPlaceholders,
  inboxFor,
  localDraft,
  type DraftTeam,
} from "@/lib/draft";

const GROUPS: { title: string; teams: DraftTeam[] }[] = [
  { title: "People Ops", teams: ["people"] },
  { title: "IT", teams: ["it"] },
  { title: "Your sales team", teams: ["revops", "enablement", "compliance"] },
];

function EscalateForm() {
  const { company } = useCompany();
  const params = useSearchParams();
  const toast = useToast();
  const [team, setTeam] = useState<DraftTeam>("people");
  const [topic, setTopic] = useState<string>("");
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [drafting, setDrafting] = useState("");
  const lastDraft = useRef("");

  useEffect(() => {
    const preset = params.get("q");
    if (preset) {
      const d = localDraft(undefined, preset, company);
      lastDraft.current = d.body;
      setSubject(d.subject);
      setMessage(d.body);
    }
    // Only when the page opens with a question from Ask privately.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const inbox = inboxFor(team, company);
  const info = TEAM_INFO[team];
  const open = hasPlaceholders(message) || hasPlaceholders(subject);

  async function draftFor(id: string) {
    const t = DRAFT_TOPICS[id];
    setTopic(id);
    setTeam(t.team);
    setDrafting(id);
    // Keep the person's own words, but never feed a previous draft back in.
    const typed = message.trim() && message !== lastDraft.current ? message : "";
    let draft: { subject: string; body: string } | null = null;
    try {
      const response = await fetch("/api/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: id, need: typed, company, team: t.team }),
      });
      if (response.ok) {
        draft = (await response.json()) as { subject: string; body: string };
      }
    } catch {
      // Fall through to the local template.
    }
    if (!draft || !draft.subject || !draft.body) {
      draft = localDraft(id, typed, company);
    }
    lastDraft.current = draft.body;
    setSubject(draft.subject);
    setMessage(draft.body);
    setDrafting("");
  }

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader
        title="Email for help"
        description="Pick what this is about and we write the email for you. Edit anything, then open it in your mail app. Your manager is not copied."
      />
      {sent ? (
        <div className="card p-6" role="status">
          <h2 className="text-xl font-semibold">Note queued for {info.label}</h2>
          <p className="mt-3 leading-7 text-[var(--muted)]">
            Queued for {inbox}. {info.time}. Your manager is not in the copy list. If this is urgent and unsafe, call{" "}
            {company.ethicsHotline} or local emergency services.
          </p>
          <Button type="button" variant="secondary" className="mt-6" onClick={() => setSent(false)}>
            Write another note
          </Button>
        </div>
      ) : (
        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault();
            if (message.trim().length < 8) {
              setError("Write a short note (at least 8 characters) so the team knows what you need.");
              return;
            }
            setError("");
            setSent(true);
            setMessage("");
            setSubject("");
          }}
        >
          <section className="card space-y-5 p-6" aria-labelledby="pick-topic">
            <div>
              <h2 id="pick-topic" className="text-lg font-semibold">1. What is this about?</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                If you already typed a few words below, they go into the email.
              </p>
            </div>
            {GROUPS.map((group) => {
              const ids = DRAFT_ORDER.filter((id) => group.teams.includes(DRAFT_TOPICS[id].team));
              return (
                <div key={group.title}>
                  <h3 className="text-sm font-semibold text-[var(--navy)]">{group.title}</h3>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {ids.map((id) => (
                      <li key={id}>
                        <Button
                          type="button"
                          variant={topic === id ? "primary" : "secondary"}
                          size="sm"
                          aria-pressed={topic === id}
                          disabled={drafting !== ""}
                          onClick={() => draftFor(id)}
                        >
                          {drafting === id ? "Writing…" : DRAFT_TOPICS[id].label}
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </section>

          <section className="card space-y-4 p-6" aria-labelledby="check-email">
            <h2 id="check-email" className="text-lg font-semibold">2. Check and edit your email</h2>
            <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
              <div>
                <label htmlFor="team" className="block text-sm font-semibold">Send to</label>
                <Select
                  id="team"
                  className="mt-2 block w-full"
                  value={team}
                  onChange={(event) => setTeam(event.target.value as DraftTeam)}
                >
                  {(Object.keys(TEAM_INFO) as DraftTeam[]).map((id) => (
                    <option key={id} value={id}>
                      {TEAM_INFO[id].label} ({inboxFor(id, company)})
                    </option>
                  ))}
                </Select>
              </div>
              <p className="text-sm text-[var(--muted)] sm:max-w-[16rem]">
                {info.handles}. {info.time}.
              </p>
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-semibold">Subject</label>
              <Input
                id="subject"
                className="mt-2"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
              />
            </div>
            <div>
              <label htmlFor="note" className="block text-sm font-semibold">Message</label>
              <Textarea
                id="note"
                required
                rows={16}
                className="mt-2 leading-7"
                placeholder="Pick a topic above to get a draft, or write your own."
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
              {error ? (
                <p className="mt-2 text-sm text-[var(--danger)]" role="alert">
                  {error}
                </p>
              ) : null}
              {open ? (
                <p className="mt-2 rounded-[var(--radius)] border border-l-[4px] border-[var(--line)] border-l-[var(--yellow)] bg-[var(--wash)] p-3 text-sm" role="status">
                  Replace the [bracketed] parts with your details before you send.
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                href={`mailto:${inbox}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`}
              >
                Open in mail app
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(`To: ${inbox}\nSubject: ${subject}\n\n${message}`);
                    toast("Copied the email");
                  } catch {
                    toast("Could not copy. Select the text and copy it.");
                  }
                }}
              >
                Copy email
              </Button>
              <Button type="submit" variant="ghost">Queue confidential note</Button>
            </div>
            <p className="text-sm text-[var(--muted)]">
              This demo stores nothing on a server. Your manager is not copied. If email is the wrong channel, call the ethics hotline at {company.ethicsHotline}.
            </p>
          </section>
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
