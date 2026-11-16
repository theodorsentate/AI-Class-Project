"use client";

import { useEffect, useState } from "react";
import { loadStartDate, saveStartDate } from "@/lib/hire";
import { businessDayNumber } from "@/lib/dates";
import { Input } from "@/components/ui/Input";

export function StartDateField() {
  const [start, setStart] = useState("");

  useEffect(() => {
    setStart(loadStartDate());
  }, []);

  const day = businessDayNumber(start);

  return (
    <div className="card p-5">
      <label htmlFor="start-date" className="block text-sm font-semibold">
        Your start date
      </label>
      <Input
        id="start-date"
        type="date"
        className="mt-2 max-w-xs"
        value={start}
        onChange={(event) => {
          setStart(event.target.value);
          saveStartDate(event.target.value);
        }}
      />
      <p className="mt-2 text-sm text-[var(--muted)]">
        {day && day > 0 ? `Business day ${day}.` : "Saved on this device when available."}
      </p>
    </div>
  );
}
