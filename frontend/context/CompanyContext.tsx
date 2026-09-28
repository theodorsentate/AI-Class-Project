"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { defaultCompany, loadCompany, saveCompany } from "@/lib/company";
import type { CompanyProfile } from "@/lib/types";

type CompanyContextValue = {
  company: CompanyProfile;
  update: (next: CompanyProfile) => void;
  ready: boolean;
};

const CompanyContext = createContext<CompanyContextValue>({
  company: defaultCompany,
  update: () => undefined,
  ready: false,
});

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const [company, setCompany] = useState<CompanyProfile>(defaultCompany);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCompany(loadCompany());
    setReady(true);
  }, []);

  const value = useMemo(
    () => ({
      company,
      ready,
      update: (next: CompanyProfile) => {
        setCompany(next);
        saveCompany(next);
      },
    }),
    [company, ready],
  );

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
}

export function useCompany() {
  return useContext(CompanyContext);
}
