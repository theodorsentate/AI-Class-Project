"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BookOpen, Send } from "lucide-react";
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
import { safeLocal, safeSession } from "@/lib/safe-storage";

const HISTORY_KEY = "harbor-ask-thread-v2";

type Message = { id: number; q: string; reply: AssistantReply };

function Avatar() {
  return (
    <span
      aria-hidden
      className="mt-1 grid size-9 shrink-0 place-items-center rounded-[10px] bg-[var(--btn-ai)] text-[var(--on-btn-ai)] ring-2 ring-[var(--yellow)]/60"
    >
      <BookOpen size={18} />
    </span>
  );
}

function AssistantBubble({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <div className="flex max-w-[92%] gap-3 sm:max-w-[85%]">
      <Avatar />
      <div className="min-w-0">
        <p className="text-xs font-semibold text-[var(--muted)]">{label ?? "Handbook Buddy"}</p>
        <div className="mt-1 rounded-[14px] rounded-tl-[4px] border border-[var(--line)] bg-[var(--surface)] px-4 py-3">
          {children}
        </div>
      </div>
    </div>
  );
}

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[88%] sm:max-w-[75%]">
        <p className="text-right text-xs font-semibold text-[var(--muted)]">You</p>
        <p className="mt-1 break-words whitespace-pre-wrap rounded-[14px] rounded-tr-[4px] bg-[var(--btn)] px-4 py-3 leading-7 text-[var(--on-btn)]">
          {text}
        </p>
      </div>
    </div>
  );
}

function ReplyBody({
  message,
  onAsk,
}: {
  message: Message;
  onAsk: (question: string) => void;
}) {
  const { reply } = message;
  const toast = useToast();
  return (
    <div className="space-y-4">
      <h2 className="sr-only">Answer</h2>
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
        <p className="break-words leading-7 whitespace-pre-wrap">{reply.text}</p>
      )}
      {reply.sourceRefs.length > 0 ? (
        <div>
          <p className="text-sm font-semibold">Sources</p>
          <p className="sr-only">From the handbook</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {reply.sourceRefs.map((source) => (
              <li key={source.id}>
                <Link
                  href={`/library/${source.id}`}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--wash)] px-3 text-sm font-medium text-[var(--blue)] hover:border-[var(--blue)]"
                >
                  <BookOpen size={14} aria-hidden />
                  {source.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {reply.followups && reply.followups.length > 0 ? (
        <div>
          <p className="text-sm font-semibold">Follow up</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {reply.followups.map((item) => (
              <li key={item}>
                <Button type="button" variant="secondary" size="sm" onClick={() => onAsk(item)}>
                  {item}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-[var(--line)] pt-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(reply.text);
              toast("Answer copied");
            } catch {
              toast("Could not copy. Select the text and copy it.");
            }
          }}
        >
          Copy answer
        </Button>
        <Link
          href={`/escalate?q=${encodeURIComponent(message.q)}`}
          className="inline-flex min-h-9 items-center text-sm font-semibold text-[var(--blue)] underline-offset-4 hover:underline"
        >
          Not what you needed? Email a person
        </Link>
      </div>
      {reply.escalate && !reply.crisis ? (
        <Button href={`/escalate?q=${encodeURIComponent(message.q)}`}>Send a confidential note</Button>
      ) : null}
    </div>
  );
}

function AskForm() {
  const { company } = useCompany();
  const params = useSearchParams();
  const [question, setQuestion] = useState("");
  const [confidential, setConfidential] = useState(true);
  const [thorough, setThorough] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [pending, setPending] = useState(false);
  const run = useRef(0);
  const endRef = useRef<HTMLDivElement>(null);
  const first = company.hireName?.split(" ")[0];

  useEffect(() => {
    setThorough(loadThorough());
    const preset = params.get("q");
    if (preset) {
      setQuestion(preset);
    }
    try {
      const saved = safeSession.getItem(HISTORY_KEY);
      if (saved) {
        setMessages(JSON.parse(saved) as Message[]);
        setConfidential(false);
      }
    } catch {
      // Session storage can be blocked.
    }
  }, [params]);

  // Confidential means nothing is written down. Turning it back on erases what was saved.
  useEffect(() => {
    try {
      if (confidential) {
        safeSession.removeItem(HISTORY_KEY);
      } else {
        safeSession.setItem(HISTORY_KEY, JSON.stringify(messages.filter((m) => m.reply)));
      }
    } catch {
      // Ignore.
    }
  }, [messages, confidential]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages, pending]);

  const suggested = useMemo(
    () => [
      "Do I have to ask my manager about pay?",
      "How do I request time off?",
      "When does a meeting count toward my quota?",
      "Can I quote a price to a prospect?",
      "How do I report harassment?",
    ],
    [],
  );

  async function submit(nextQuestion: string) {
    const trimmed = nextQuestion.trim();
    if (!trimmed || pending) {
      return;
    }
    const id = ++run.current;
    setPending(true);
    setQuestion("");
    setMessages((prev) => [...prev, { id, q: trimmed, reply: null as unknown as AssistantReply }]);
    const hits = retrieve(trimmed, articles);
    let next = composeReply(trimmed, hits, company);
    let done: Record<string, boolean> = {};
    try {
      done = JSON.parse(safeLocal.getItem(CHECKLIST_KEY) || "{}");
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
    if (run.current !== id) {
      return;
    }
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, reply: next } : m)));
    setPending(false);
  }

  function stop() {
    run.current += 1;
    setMessages((prev) => prev.filter((m) => m.reply));
    setPending(false);
  }

  function clearThread() {
    run.current += 1;
    setMessages([]);
    setPending(false);
    setQuestion("");
  }

  const answered = messages.filter((m) => m.reply);
  const waiting = messages.find((m) => !m.reply);

  return (
    <div className="max-w-3xl">
      <span className="eyebrow-rule" aria-hidden />
      <h1 className="text-3xl">Ask privately</h1>
      <p className="mt-3 max-w-2xl leading-7 text-[var(--muted)]">
        Ask in everyday words. Answers come from the {company.name} handbook, with links to the sections used. Nobody
        else sees what you ask.
      </p>

      <section
        aria-label="Conversation with Handbook Buddy"
        className="mt-6 overflow-hidden rounded-[var(--radius)] border border-[var(--line)] bg-[var(--paper)]"
      >
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] bg-[var(--surface)] px-4 py-3">
          <div className="flex items-center gap-3">
            <Avatar />
            <div>
              <p className="font-semibold text-[var(--navy)]">Handbook Buddy</p>
              <p className="text-xs text-[var(--muted)]">Answers from the {company.name} handbook</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <label htmlFor="confidential" className="flex min-h-9 items-center gap-2 text-sm">
              <input
                id="confidential"
                type="checkbox"
                checked={confidential}
                onChange={(event) => setConfidential(event.target.checked)}
                className="size-4"
              />
              Confidential
            </label>
            {messages.length > 0 ? (
              <Button type="button" variant="ghost" size="sm" onClick={clearThread}>
                Clear conversation
              </Button>
            ) : null}
          </div>
        </header>

        <div
          role="log"
          aria-live="polite"
          aria-relevant="additions"
          className="max-h-[62vh] min-h-[22rem] space-y-5 overflow-y-auto px-4 py-5"
        >
          <AssistantBubble>
            <p className="leading-7">
              {first ? `Hi ${first}, I am Handbook Buddy.` : "Hi, I am Handbook Buddy."} Ask me about your role, pay,
              time off, or the rules for contacting prospects. I answer only from the handbook, and I will point you
              to a person when it is better to ask one.
            </p>
            {messages.length === 0 ? (
              <div className="mt-3">
                <p className="text-sm font-semibold">Try asking</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {suggested.map((item) => (
                    <li key={item}>
                      <Button type="button" variant="secondary" size="sm" onClick={() => void submit(item)}>
                        {item}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </AssistantBubble>

          {answered.map((message) => (
            <div key={message.id} className="space-y-5">
              <UserBubble text={message.q} />
              <AssistantBubble>
                <ReplyBody message={message} onAsk={(q) => void submit(q)} />
              </AssistantBubble>
            </div>
          ))}

          {waiting ? (
            <div className="space-y-5">
              <UserBubble text={waiting.q} />
              <AssistantBubble>
                <p role="status" className="flex items-center gap-2 text-sm text-[var(--muted)]">
                  <span className="flex gap-1" aria-hidden>
                    <span className="size-2 animate-pulse rounded-full bg-[var(--muted)]" />
                    <span className="size-2 animate-pulse rounded-full bg-[var(--muted)] [animation-delay:150ms]" />
                    <span className="size-2 animate-pulse rounded-full bg-[var(--muted)] [animation-delay:300ms]" />
                  </span>
                  Searching the handbook...
                  <button type="button" onClick={stop} className="ml-2 font-semibold text-[var(--blue)] underline underline-offset-4">
                    Stop
                  </button>
                </p>
              </AssistantBubble>
            </div>
          ) : null}
          <div ref={endRef} />
        </div>

        <form
          className="border-t border-[var(--line)] bg-[var(--surface)] p-3"
          onSubmit={(event) => {
            event.preventDefault();
            void submit(question);
          }}
        >
          <label htmlFor="question" className="sr-only">
            Your question
          </label>
          <div className="flex items-end gap-2">
            <Textarea
              id="question"
              name="question"
              rows={2}
              className="min-h-12 flex-1 resize-none"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void submit(question);
                }
              }}
              placeholder="Ask a question, like: I do not want to ask my manager about sick leave"
            />
            <Button type="submit" variant="ai" aria-label="Get an answer" disabled={pending} className="size-12 shrink-0 !px-0">
              <Send size={18} aria-hidden />
            </Button>
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-[var(--muted)]">
            <p>Enter sends. Shift+Enter adds a line. Do not paste passwords or sensitive personal details.</p>
            <details className="text-xs">
              <summary className="cursor-pointer font-semibold text-[var(--blue)]">More options</summary>
              <label htmlFor="thorough" className="mt-2 flex items-center gap-2">
                <input
                  id="thorough"
                  type="checkbox"
                  checked={thorough}
                  onChange={(event) => {
                    setThorough(event.target.checked);
                    saveThorough(event.target.checked);
                  }}
                  className="size-4"
                />
                Read the whole handbook when an AI key is set (more thorough, a little slower)
              </label>
            </details>
          </div>
        </form>
      </section>
      <p className="mt-3 text-sm text-[var(--muted)]">
        {confidential
          ? "Confidential is on. Nothing from this conversation is saved on this device."
          : "Confidential is off. This conversation is kept in this browser tab until you close it or turn Confidential back on."}
      </p>
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
