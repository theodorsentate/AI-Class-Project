"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CHECKLIST_KEY, defaultChecklist } from "@/lib/checklist";
import { composeReply } from "@/lib/compose";
import { loadStartDate, loadThorough, saveThorough } from "@/lib/hire";
import { articles } from "@/lib/knowledge";
import { retrieve } from "@/lib/retrieve";
import { useCompany } from "@/context/CompanyContext";
import type { AssistantReply } from "@/lib/types";

export default function AskPage() {
  const { company } = useCompany();
  const [question, setQuestion] = useState("");
  const [confidential, setConfidential] = useState(true);
  const [thorough, setThorough] = useState(true);
  const [reply, setReply] = useState<AssistantReply | null>(null);
  const [pending, setPending] = useState(false);
  const [history, setHistory] = useState<{ q: string; a: string }[]>([]);

  useEffect(() => {
    setThorough(loadThorough());
  }, []);

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
    setReply(next);
    if (!confidential) {
      setHistory((prev) => [...prev, { q: trimmed, a: next.text }]);
    }
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
          className="mt-6 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            void submit(question);
          }}
        >
          <label htmlFor="question" className="block text-sm font-semibold">
            Your question
          </label>
          <textarea
            id="question"
            name="question"
            rows={4}
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            className="w-full rounded-xl border border-[var(--line)] bg-white p-4 text-base"
            placeholder="Example: I do not want to ask my manager about sick leave"
          />
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
          <button type="submit" className="btn-primary" disabled={pending}>
            {pending ? "Looking up" : "Get an answer"}
          </button>
        </form>
        <div className="mt-4 flex flex-wrap gap-2" aria-label="Suggested questions">
          {suggested.map((item) => (
            <button
              key={item}
              type="button"
              className="rounded-full border border-[var(--line)] bg-white px-3 py-2 text-sm"
              onClick={() => {
                setQuestion(item);
                void submit(item);
              }}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="card mt-8 p-6" aria-live="polite" aria-atomic="true">
          <h2 className="text-lg font-semibold">Answer</h2>
          {reply ? (
            <div className="mt-3 space-y-4">
              <p className="leading-7">{reply.text}</p>
              {reply.followups && reply.followups.length > 0 ? (
                <div>
                  <p className="text-sm font-semibold">Follow up</p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {reply.followups.map((item) => (
                      <li key={item}>
                        <button
                          type="button"
                          className="rounded-full border border-[var(--line)] bg-white px-3 py-2 text-sm"
                          onClick={() => {
                            setQuestion(item);
                            void submit(item);
                          }}
                        >
                          {item}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {reply.sourceRefs.length > 0 ? (
                <div>
                  <p className="text-sm font-semibold">From the handbook</p>
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
              {reply.escalate ? (
                <Link href="/escalate" className="inline-flex btn-primary items-center">
                  Send a confidential note
                </Link>
              ) : null}
            </div>
          ) : (
            <p className="mt-3 text-[var(--muted)]">
              Answers appear here, with links into the matching handbook
              sections. If nothing matches, you will be offered People Ops or IT.
            </p>
          )}
        </div>
      </section>
      <aside className="space-y-4">
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
