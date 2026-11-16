function startOfDay(value: Date): Date {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

function isWeekend(value: Date): boolean {
  const day = value.getDay();
  return day === 0 || day === 6;
}

export function parseStart(iso: string): Date | null {
  if (!iso) {
    return null;
  }
  const date = new Date(`${iso}T12:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function businessDayNumber(startISO: string, today = new Date()): number | null {
  const start = parseStart(startISO);
  if (!start) {
    return null;
  }
  const end = startOfDay(today);
  const cursor = startOfDay(start);
  if (end < cursor) {
    return 0;
  }
  let n = 0;
  for (let day = new Date(cursor); day <= end; day.setDate(day.getDate() + 1)) {
    if (!isWeekend(day)) {
      n += 1;
    }
  }
  return n;
}

export function addBusinessDays(startISO: string, count: number): Date | null {
  const start = parseStart(startISO);
  if (!start || count < 1) {
    return null;
  }
  const day = startOfDay(start);
  let remaining = count;
  while (isWeekend(day)) {
    day.setDate(day.getDate() + 1);
  }
  remaining -= 1;
  while (remaining > 0) {
    day.setDate(day.getDate() + 1);
    if (!isWeekend(day)) {
      remaining -= 1;
    }
  }
  return day;
}

export function formatDueBadge(due: Date, today = new Date()): string {
  const a = startOfDay(due);
  const b = startOfDay(today);
  const diff = Math.round((a.getTime() - b.getTime()) / 86400000);
  const label = due.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  if (diff === 0) {
    return "Due today";
  }
  if (diff < 0) {
    return "Overdue";
  }
  return `Due ${label}, in ${diff} day${diff === 1 ? "" : "s"}`;
}
