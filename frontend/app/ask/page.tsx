"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CHECKLIST_KEY, defaultChecklist } from "@/lib/checklist";
import { composeReply } from "@/lib/compose";
import { loadStartDate, loadThorough, saveThorough } from "@/lib/hire";
import { articles } from "@/lib/knowledge";
import { retrieve } from "@/lib/retrieve";
import { useCompany } from "@/context/CompanyContext";
import { resourcesBlock } from "@/lib/safety";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { useToast } from "@/context/ToastContext";
import type { AssistantReply } from "@/lib/types";

function AskForm() {
  const { company } = useCompany();
  const params = useSearchParams();
  const [question, setQuestion] = useState("");
  const [confidential, setConfidential] = useState(true);
  const [thorough, setThorough] = useState(true);
  const [reply, setReply] = useState<AssistantReply | null>(null);
  const [pending, setPending] = useState(false);
  const [history, setHistory] = useState<{ q: string; a: string }[]>([]);
  const toast = useToast();
  const [stopped, setStopped] = useState(false);

  useEffect(() => {
    setThorough(loadThorough());
    const preset = params.get("q");
    if (preset) {
      setQuestion(preset);
    }
    try {
      const saved = sessionStorage.getItem("harbor-ask-history");
      if (saved) {
        setHistory(JSON.parse(saved) as { q: string; a: string }[]);
      }
    } catch {
      // Session storage can be blocked.
    }
  }, [params]);

  useEffect(() => {
    try {
      sessionStorage.setItem("harbor-ask-history", JSON.stringify(history));
    } catch {
      // Ignore.
    }
  }, [history]);

  const suggested = useMemo(
    () => [
      "Do I have to ask my manager about pay?",
      "How do I request time off?",
      "I am locked out of email",
      "How do I report harassment?",
    ],
    [],
  );

  async function submit(nextQuestion: string) {
    const trimmed = nextQuestion.trim();
    if (!trimmed) {
      return;
    }
    setPending(true);
    const hits = retrieve(trimmed, articles);
    let next = composeReply(trimmed, hits, company);
    let done: Record<string, boolean> = {};
    try {
      done = JSON.parse(window.localStorage.getItem(CHECKLIST_KEY) || "{}");
    } catch {
      done = {};
    }
    const doneTitles = defaultChecklist.filter((item) => done[item.id]).map((item) => item.title);
    const openTitles = defaultChecklist.filter((item) => !done[item.id]).map((item) => item.title);
    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: trimmed,
          company,
          startDate: loadStartDate(),
          doneTitles,
          openTitles,
          thorough,
        }),
      });
      if (response.ok) {
        next = (await response.json()) as AssistantReply;
      }
    } catch {
      // Handbook reply already prepared.
    }
    if (stopped) {
      setPending(false);
      return;
    }
    setReply(next);
    setHistory((prev) => [...prev, { q: trimmed, a: next.text }]);
    setPending(false);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <section>
        <h1 className="text-3xl font-semibold">Ask privately</h1>
        <p className="mt-3 max-w-2xl text-[var(--muted)] leading-7">
          Type a question in everyday language. The assistant searches the
          company handbook and links the sections it used. Turn confidential on
          to keep the thread off the local history.
        </p>
        <form
          className="sticky bottom-16 z-10 mt-6 space-y-4 rounded-[var(--radius)] bg-[var(--paper)] py-3 md:bottom-4"
          onSubmit={(event) => {
            event.preventDefault();
            setStopped(false);
            void submit(question);
          }}
        >
          <label htmlFor="question" className="block text-sm font-semibold">
            Your question
          </label>
          <Textarea
            id="question"
            name="question"
            rows={4}
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void submit(question);
              }
            }}
            placeholder="Example: I do not want to ask my manager about sick leave"
          />
          <p className="text-sm text-[var(--muted)]">
            Do not paste passwords or sensitive personal information. Enter sends. Shift+Enter adds a line.
          </p>
          <div className="flex items-center gap-3">
            <input
              id="confidential"
              type="checkbox"
              checked={confidential}
              onChange={(event) => setConfidential(event.target.checked)}
              className="size-5"
            />
            <label htmlFor="confidential" className="text-sm leading-6">
              Confidential: do not save this question on this device
            </label>
          </div>
          <div className="flex items-center gap-3">
            <input
              id="thorough"
              type="checkbox"
              checked={thorough}
              onChange={(event) => {
                setThorough(event.target.checked);
                saveThorough(event.target.checked);
              }}
              className="size-5"
            />
            <label htmlFor="thorough" className="text-sm leading-6">
              Read the whole handbook when an API key is set
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="submit" variant="ai" loading={pending} disabled={pending}>
              Get an answer
            </Button>
            {pending ? (
              <Button type="button" variant="ghost" onClick={() => setStopped(true)}>
                Stop
              </Button>
            ) : null}
            {reply && !pending ? (
              <Button type="button" variant="ghost" onClick={() => void submit(question)}>
                Retry
              </Button>
            ) : null}
          </div>
          {pending ? (
            <p role="status" className="text-sm">
              Searching the handbook...
            </p>
          ) : null}
        </form>
        <div className="mt-4 flex flex-wrap gap-2" aria-label="Suggested questions">
          {suggested.map((item) => (
            <Button
              key={item}
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                setQuestion(item);
                void submit(item);
              }}
            >
              {item}
            </Button>
          ))}
        </div>
        <div className="card mt-8 p-6" aria-live="polite" aria-atomic="true">
          <h2 className="text-lg font-semibold">Answer</h2>
          {reply ? (
            <div className="mt-3 space-y-4">
              {reply.crisis ? (
                <div>
                  <p className="font-semibold">Please reach out to someone right now</p>
                  <p className="mt-2 leading-7">
                    If you or someone else is in immediate danger, call your local emergency number.
                  </p>
                  <ul className="mt-3 space-y-2">
                    {resourcesBlock(true).map((item) => (
                      <li key={item.href}>
                        <a href={item.href} className="font-medium text-[var(--blue)]">
                          {item.label}
                        </a>
                        <span className="block text-sm text-[var(--muted)]">{item.detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="break-words leading-7">{reply.text}</p>
              )}
              {reply.followups && reply.followups.length > 0 ? (
                <div>
                  <p className="text-sm font-semibold">Follow up</p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {reply.followups.map((item) => (
                      <li key={item}>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setQuestion(item);
                            void submit(item);
                          }}
                        >
                          {item}
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {reply.sourceRefs.length > 0 ? (
                <div>
                  <p className="text-sm font-semibold">Sources</p>
                  <p className="sr-only">From the handbook</p>
                  <ul className="mt-2 space-y-2">
                    {reply.sourceRefs.map((source) => (
                      <li key={source.id}>
                        <Link
                          href={`/library/${source.id}`}
                          className="font-medium text-[var(--blue)]"
                        >
                          {source.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    await navigator.clipboard.writeText(reply.text);
                    toast("Answer copied");
                  }}
                >
                  Copy answer
                </Button>
                <span className="text-sm">Was this helpful?</span>
                <Link href={`/escalate?q=${encodeURIComponent(question)}`} className="text-sm font-semibold text-[var(--blue)]">
                  Talk to a person
                </Link>
              </div>
              {reply.escalate && !reply.crisis ? (
                <Button href={`/escalate?q=${encodeURIComponent(question)}`}>
                  Send a confidential note
                </Button>
              ) : null}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setReply(null);
                  setHistory([]);
                  setQuestion("");
                  try {
                    sessionStorage.removeItem("harbor-ask-history");
                  } catch {
                    // Ignore.
                  }
                }}
              >
                Clear conversation
              </Button>
            </div>
          ) : (
            <p className="mt-3 text-[var(--muted)]">
              Answers appear here, with links into the matching handbook
              sections. If nothing matches, you will be offered People Ops or IT.
            </p>
          )}
        </div>
      </section>
      <aside className="space-y-4" aria-label="About this assistant">
        <div className="card p-5">
          <h2 className="font-semibold">Why this exists</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            New hires often skip questions about pay, access, or conflict because
            the only obvious person is their manager. This channel is the
            official alternative.
          </p>
        </div>
        {!confidential && history.length > 0 ? (
          <div className="card p-5">
            <h2 className="font-semibold">Saved on this device</h2>
            <ul className="mt-3 space-y-3 text-sm">
              {history.map((item) => (
                <li key={item.q}>
                  <p className="font-medium">{item.q}</p>
                  <p className="text-[var(--muted)]">{item.a}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="card p-5">
            <h2 className="font-semibold">Confidential is on</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Nothing from this session is written to local history.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}

export default function AskPage() {
  return (
    <Suspense fallback={<p>Loading</p>}>
      <AskForm />
    </Suspense>
  );
}
