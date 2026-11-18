"use client";

import { Card } from "@/components/ui/Card";
import { useCompany } from "@/context/CompanyContext";

export function Welcome() {
  const { company } = useCompany();
  if (!company.hireName) {
    return null;
  }
  const first = company.hireName.split(" ")[0];
  return (
    <Card className="p-6" data-testid="welcome">
      <h2 className="text-lg font-semibold">Welcome to {company.name}, {first}</h2>
      <p className="mt-2 max-w-[72ch] leading-7 text-[var(--muted)]">
        You are joining as {company.hireRole ?? "a new hire"}. Your onboarding buddy is {company.buddyName}.
        Ask anything about your role, pay, time off or the rules for contacting prospects. Answers come from the {company.name} handbook and are not shared with your manager.
      </p>
    </Card>
  );
}
