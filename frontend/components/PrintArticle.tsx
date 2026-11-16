"use client";

import { Button } from "@/components/ui/Button";

export function PrintArticle() {
  return (
    <Button type="button" variant="ghost" size="sm" onClick={() => window.print()}>
      Print
    </Button>
  );
}
