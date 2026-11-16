"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

const ThemeContext = createContext<{ theme: Theme; setTheme: (t: Theme) => void }>({
  theme: "system",
  setTheme: () => undefined,
});

function apply(theme: Theme) {
  const dark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("harbor-theme") as Theme | null;
      const next = saved === "light" || saved === "dark" || saved === "system" ? saved : "system";
      setThemeState(next);
      apply(next);
    } catch {
      apply("system");
    }
  }, []);

  function setTheme(next: Theme) {
    setThemeState(next);
    try {
      window.localStorage.setItem("harbor-theme", next);
    } catch {
      // Storage can be unavailable.
    }
    apply(next);
  }

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
