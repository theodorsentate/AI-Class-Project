"use client";

import { createContext, useContext, useState } from "react";

const ToastContext = createContext<(message: string) => void>(() => undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState("");

  function toast(next: string) {
    setMessage(next);
    window.setTimeout(() => setMessage(""), 4000);
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {message}
      </div>
      {message ? (
        <div className="fixed bottom-20 right-4 z-[var(--z-toast)] rounded-[var(--radius)] bg-[var(--navy)] px-4 py-3 text-sm text-[var(--paper)] md:bottom-4">
          {message}
        </div>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
