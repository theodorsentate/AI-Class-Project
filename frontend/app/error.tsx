"use client";

import { Button } from "@/components/ui/Button";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Something went wrong</h1>
      <p className="max-w-[72ch] text-[var(--muted)]">
        Try again. If it keeps happening, send a note to People Ops.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button type="button" onClick={reset}>
          Try again
        </Button>
        <Button href="/escalate" variant="secondary">
          Get help
        </Button>
      </div>
    </div>
  );
}
