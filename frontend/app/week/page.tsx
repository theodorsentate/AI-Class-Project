"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BookOpen, CalendarDays, Mail } from "lucide-react";
import { CHECKLIST_KEY, defaultChecklist } from "@/lib/checklist";
import { addBusinessDays, businessDayNumber, formatDueBadge, parseStart } from "@/lib/dates";
import { loadStartDate, saveStartDate } from "@/lib/hire";
import { articles } from "@/lib/knowledge";
import { people } from "@/lib/people";
import { FACTS, WEEK_PLAN, planDayFor, type PlanDay } from "@/lib/weekplan";
import { useCompany } from "@/context/CompanyContext";
import { Input } from "@/components/ui/Input";
import { Alert, PageHeader } from "@/components/ui/Card";
import { safeLocal } from "@/lib/safe-storage";
import type { ChecklistItem } from "@/lib/types";

const MEET = ["marcus-hill", "priya-natarajan", "dana-whitfield", "sam-okafor", "leah-brooks"];

function shortDate(date: Date | null): string {
  return date ? date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) : "";
}

export default function WeekPage() {
  const { company } = useCompany();
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [ready, setReady] = useState(false);
  const [start, setStart] = useState("");

  useEffect(() => {
    try {
      const raw = safeLocal.getItem(CHECKLIST_KEY);
      if (raw) setDone(JSON.parse(raw));
    } catch {
      setDone({});
    }
    setStart(loadStartDate());
    setReady(true);
  }, []);

  function toggle(id: string) {
    setDone((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      safeLocal.setItem(CHECKLIST_KEY, JSON.stringify(next));
      return next;
    });
  }

  const total = defaultChecklist.length;
  const completed = defaultChecklist.filter((item) => done[item.id]).length;
  const day = businessDayNumber(start); // null: no date. 0: not started yet.
  const startDate = parseStart(start);
  const daysUntil = useMemo(() => {
    if (!startDate || day !== 0) return null;
    const a = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).getTime();
    const n = new Date();
    return Math.round((a - new Date(n.getFullYear(), n.getMonth(), n.getDate()).getTime()) / 86400000);
  }, [startDate, day]);
  const currentPlan = day && day > 0 ? planDayFor(Math.min(day, 6)) : null;
  const beyond = Boolean(day && day > 10);

  const tasksFor = (d: PlanDay) =>
    defaultChecklist.filter((item) => item.dueBusinessDay && planDayFor(item.dueBusinessDay) === d.day);
  const anytime = defaultChecklist.filter((item) => !item.dueBusinessDay);
  const nextTask = [...defaultChecklist]
    .filter((item) => !done[item.id])
    .sort((a, b) => (a.dueBusinessDay ?? 99) - (b.dueBusinessDay ?? 99))[0];
  const today = WEEK_PLAN.find((d) => d.day === currentPlan);

  function dueLabel(item: ChecklistItem): string {
    if (!item.dueBusinessDay) return "";
    if (done[item.id]) return "Done";
    const due = start ? addBusinessDays(start, item.dueBusinessDay) : null;
    return due ? formatDueBadge(due) : `Due business day ${item.dueBusinessDay}`;
  }

  function renderTask(item: ChecklistItem) {
    const article = item.articleId ? articles.find((a) => a.id === item.articleId) : undefined;
    const isToday = Boolean(item.dueBusinessDay && day === item.dueBusinessDay);
    return (
      <li key={item.id} className={`rounded-[var(--radius)] border p-4 ${isToday ? "border-[var(--yellow)] bg-[var(--wash)]" : "border-[var(--line)] bg-[var(--surface)]"} ${done[item.id] ? "opacity-70" : ""}`}>
        <div className="flex gap-3">
          <input
            id={item.id}
            type="checkbox"
            className="mt-1 size-6 shrink-0"
            checked={Boolean(done[item.id])}
            disabled={!ready}
            onChange={() => toggle(item.id)}
          />
          <div className="min-w-0">
            <label htmlFor={item.id} className={`block font-semibold ${done[item.id] ? "line-through decoration-[var(--muted)]" : ""}`}>
              {item.title}
            </label>
            <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              <span className="rounded-full bg-[var(--wash)] px-2.5 py-0.5 font-medium text-[var(--navy)] ring-1 ring-[var(--line)]">
                {item.owner === "You" ? "You do this" : `${item.owner} helps`}
              </span>
              {item.dueBusinessDay ? (
                <span className="font-semibold">
                  {dueLabel(item)}
                </span>
              ) : null}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.detail}</p>
            <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold">
              {article ? (
                <Link className="inline-flex items-center gap-1.5 text-[var(--blue)] underline-offset-4 hover:underline" href={`/library/${article.id}`}>
                  <BookOpen size={14} aria-hidden /> Read: {article.title}
                </Link>
              ) : null}
              {item.askTopic ? (
                <Link className="inline-flex items-center gap-1.5 text-[var(--blue)] underline-offset-4 hover:underline" href={`/escalate?topic=${item.askTopic}`}>
                  <Mail size={14} aria-hidden /> Email about this
                </Link>
              ) : null}
            </p>
          </div>
        </div>
      </li>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      <PageHeader
        title="First week"
        description={`Your first ten business days at ${company.name}, day by day. Completed ${completed} of ${total}.`}
      />

      {completed === total ? (
        <Alert tone="success">Everything on your first-week list is done. Keep Ask privately for later questions.</Alert>
      ) : null}

      <section className="card p-6" aria-labelledby="where-h" data-testid="week-status">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-start">
          <div>
            <p className="text-sm font-semibold text-[var(--blue)]">
              {!start ? "Set your date" : daysUntil !== null ? "Coming up" : beyond ? "You made it" : "Where you are"}
            </p>
            <h2 id="where-h" className="mt-1 text-2xl font-semibold">
              {!start
                ? "When do you start?"
                : daysUntil !== null
                  ? daysUntil === 0
                    ? "You start today"
                    : `You start in ${daysUntil} day${daysUntil === 1 ? "" : "s"}`
                  : beyond
                    ? "You are past your first two weeks"
                    : `Business day ${day} of 10`}
            </h2>
            <p className="mt-2 max-w-[60ch] leading-7 text-[var(--muted)]">
              {!start
                ? "Enter your start date and every task gets a due date. Today's plan appears here once you have started."
                : daysUntil !== null
                  ? `Your first day is ${shortDate(startDate)}. Day 1 starts at 8:30 with your badge and laptop. See the plan below and tick things off as you go.`
                  : beyond
                    ? "The first-week plan is behind you. Anything still open below is worth finishing, and the handbook is always one question away."
                    : today
                      ? `Today: ${today.title}. ${today.blurb}`
                      : ""}
            </p>
            {nextTask && start && !beyond ? (
              <p className="mt-3 text-sm">
                <span className="font-semibold">Next task: </span>
                <a className="text-[var(--blue)] underline underline-offset-4" href={`#${nextTask.id}`}>{nextTask.title}</a>
                {nextTask.dueBusinessDay ? <span className="text-[var(--muted)]"> · {dueLabel(nextTask)}</span> : null}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="week-start" className="block text-sm font-semibold">
              Your start date
            </label>
            <Input
              id="week-start"
              type="date"
              className="mt-2 w-full md:w-52"
              value={start}
              onChange={(event) => {
                setStart(event.target.value);
                saveStartDate(event.target.value);
              }}
            />
            <p className="mt-2 text-xs text-[var(--muted)]">Saved on this device.</p>
          </div>
        </div>
        <div className="mt-5">
          <div className="flex items-baseline justify-between text-sm font-semibold">
            <span>Your progress</span>
            <span>
              {completed} of {total} done
            </span>
          </div>
          <div
            className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--wash)] ring-1 ring-[var(--line)]"
            role="progressbar"
            aria-label="First week progress"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={completed}
          >
            <div className="h-full rounded-full bg-[var(--yellow)] transition-[width]" style={{ width: `${(completed / total) * 100}%` }} />
          </div>
        </div>
      </section>

      <nav aria-label="Jump to a day" className="no-print">
        <ul className="flex flex-wrap gap-2 text-sm">
          {WEEK_PLAN.map((d) => (
            <li key={d.day}>
              <a
                href={`#day-${d.day}`}
                className={`inline-flex min-h-9 items-center rounded-full border px-3 font-semibold ${currentPlan === d.day ? "border-[var(--yellow)] bg-[var(--wash)]" : "border-[var(--line)] bg-[var(--surface)]"} text-[var(--navy)]`}
              >
                {d.label}
              </a>
            </li>
          ))}
          <li>
            <a href="#anytime" className="inline-flex min-h-9 items-center rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 font-semibold text-[var(--navy)]">
              Anytime
            </a>
          </li>
        </ul>
      </nav>

      <ol className="space-y-6">
        {WEEK_PLAN.map((d) => {
          const dayTasks = tasksFor(d);
          const first = addBusinessDays(start, d.day === 6 ? 6 : d.day);
          const last = d.day === 6 ? addBusinessDays(start, 10) : null;
          const isNow = currentPlan === d.day;
          const allDone = dayTasks.length > 0 && dayTasks.every((t) => done[t.id]);
          return (
            <li key={d.day} id={`day-${d.day}`} className={`scroll-mt-24 rounded-[var(--radius)] border bg-[var(--surface)] ${isNow ? "border-[var(--yellow)] border-l-[6px]" : "border-[var(--line)]"}`}>
              <div className="flex flex-wrap items-start justify-between gap-2 border-b border-[var(--line)] px-5 py-4">
                <div>
                  <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-[var(--blue)]">
                    <CalendarDays size={14} aria-hidden />
                    {d.label}
                    {first ? <span className="text-[var(--muted)]">· {shortDate(first)}{last ? ` to ${shortDate(last)}` : ""}</span> : null}
                    {isNow ? <span className="rounded-full bg-[var(--yellow)] px-2 py-0.5 text-xs text-white">Today</span> : null}
                    {allDone ? <span className="rounded-full bg-[var(--wash)] px-2 py-0.5 text-xs text-[var(--navy)] ring-1 ring-[var(--line)]">Tasks done</span> : null}
                  </p>
                  <h2 className="mt-1 text-xl font-semibold">{d.title}</h2>
                </div>
              </div>
              <div className="space-y-4 px-5 py-4">
                <p className="leading-7 text-[var(--muted)]">{d.blurb}</p>
                <ul className="space-y-2">
                  {d.items.map((item) => (
                    <li key={item.text} className="grid grid-cols-[3.5rem_1fr] gap-x-3 text-sm leading-6">
                      <span className="font-semibold tabular-nums text-[var(--navy)]">{item.time ?? "·"}</span>
                      <span>
                        {item.text}
                        {item.with ? <span className="text-[var(--muted)]"> With {item.with}.</span> : null}
                      </span>
                    </li>
                  ))}
                </ul>
                {dayTasks.length > 0 ? (
                  <div>
                    <h3 className="text-sm font-semibold">{d.day === 6 ? "Due this week" : "Tasks for this day"}</h3>
                    <ul className="mt-2 space-y-3">
                      {dayTasks.map((t) => renderTask(t))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>

      <section id="anytime" className="scroll-mt-24" aria-labelledby="any-h">
        <h2 id="any-h" className="text-xl font-semibold">Anytime this week</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">No deadline, but earlier is easier.</p>
        <ul className="mt-3 space-y-3">
          {anytime.map((t) => renderTask(t))}
        </ul>
      </section>

      <section aria-labelledby="meet-h">
        <h2 id="meet-h" className="text-xl font-semibold">People you will meet</h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {MEET.map((id) => people.find((p) => p.id === id)).filter(Boolean).map((p) => (
            <li key={p!.id} className="card p-4">
              <p className="font-semibold">{p!.name}</p>
              <p className="text-sm text-[var(--blue)]">{p!.role}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Ask about: {p!.handles.toLowerCase()}.</p>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm">
          <Link href="/people" className="font-semibold text-[var(--blue)] underline-offset-4 hover:underline">See everyone in the directory</Link>
        </p>
      </section>

      <section aria-labelledby="facts-h" className="card p-5">
        <h2 id="facts-h" className="text-lg font-semibold">Good to know</h2>
        <dl className="mt-3 grid gap-x-6 gap-y-3 sm:grid-cols-2">
          {FACTS.map((f) => (
            <div key={f.label}>
              <dt className="text-sm font-semibold text-[var(--navy)]">{f.label}</dt>
              <dd className="text-sm leading-6 text-[var(--muted)]">{f.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-xs text-[var(--muted)]">Sample schedule for the Lumenfield demo. Times and meetings are invented.</p>
      </section>
    </div>
  );
}
