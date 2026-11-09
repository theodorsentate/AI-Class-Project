"use client";

import { useMemo, useState } from "react";
import { people, peopleNote } from "@/lib/people";

export default function PeoplePage() {
  const [query, setQuery] = useState("");
  const [team, setTeam] = useState("All");
  const teams = ["All", ...new Set(people.map((person) => person.team))];
  const rows = useMemo(
    () =>
      people.filter((person) => {
        const blob = `${person.name} ${person.role} ${person.handles} ${person.email}`.toLowerCase();
        const q = query.toLowerCase();
        const teamOk = team === "All" || person.team === team;
        return teamOk && (!q || blob.includes(q));
      }),
    [query, team],
  );

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">People directory</h1>
        <p className="mt-3 text-[var(--muted)] leading-7">{peopleNote}</p>
      </header>
      <div className="flex flex-wrap gap-4">
        <label className="text-sm font-semibold">
          Search
          <input
            className="mt-2 block rounded-xl border border-[var(--line)] p-3"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <label className="text-sm font-semibold">
          Team
          <select
            className="mt-2 block rounded-xl border border-[var(--line)] p-3"
            value={team}
            onChange={(event) => setTeam(event.target.value)}
          >
            {teams.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      </div>
      <ul className="grid gap-4 md:grid-cols-2">
        {rows.map((person) => (
          <li key={person.id} className="card p-5">
            <h2 className="font-semibold">{person.name}</h2>
            <p className="text-sm text-[var(--blue)]">
              {person.role} · {person.team}
            </p>
            <p className="mt-2 leading-7 text-[var(--muted)]">{person.handles}</p>
            <a className="mt-2 inline-block text-[var(--blue)]" href={`mailto:${person.email}`}>
              {person.email}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
