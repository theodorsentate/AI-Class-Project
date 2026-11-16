import { describe, expect, it } from "vitest";
import { addBusinessDays, businessDayNumber, formatDueBadge } from "./dates";

describe("businessDayNumber", () => {
  it("counts the start weekday as day 1", () => {
    expect(businessDayNumber("2026-11-09", new Date("2026-11-09T15:00:00"))).toBe(1);
  });

  it("skips the weekend", () => {
    expect(businessDayNumber("2026-11-09", new Date("2026-11-11T12:00:00"))).toBe(3);
    expect(businessDayNumber("2026-11-09", new Date("2026-11-14T12:00:00"))).toBe(5);
  });
});

describe("addBusinessDays", () => {
  it("lands due dates on weekdays", () => {
    const due = addBusinessDays("2026-11-09", 1);
    expect(due?.getFullYear()).toBe(2026);
    expect(due?.getMonth()).toBe(10);
    expect(due?.getDate()).toBe(9);
    const tenth = addBusinessDays("2026-11-09", 10);
    expect(tenth?.getDay()).not.toBe(0);
    expect(tenth?.getDay()).not.toBe(6);
  });
});

describe("formatDueBadge", () => {
  it("labels today, future, and overdue", () => {
    const today = new Date("2026-11-13T12:00:00");
    expect(formatDueBadge(new Date("2026-11-13T12:00:00"), today)).toBe("Due today");
    expect(formatDueBadge(new Date("2026-11-09T12:00:00"), today)).toBe("Overdue");
    expect(formatDueBadge(new Date("2026-11-17T12:00:00"), today)).toMatch(/Due Nov 17, in 4 days/);
  });
});
