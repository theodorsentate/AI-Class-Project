/**
 * Storage that never throws.
 *
 * Browsers can block localStorage/sessionStorage (private mode, locked-down company
 * laptops, sandboxed iframes, "block all cookies"). Direct access then throws a
 * SecurityError and a React app renders a blank page. These wrappers fall back to
 * an in-memory store for the life of the page, so the app keeps working and simply
 * forgets its settings on reload.
 */
type Kind = "localStorage" | "sessionStorage";

function makeStore(kind: Kind) {
  const memory = new Map<string, string>();

  function backing(): Storage | null {
    try {
      if (typeof window === "undefined") return null;
      const s = window[kind];
      const probe = "__storage_probe__";
      s.setItem(probe, "1");
      s.removeItem(probe);
      return s;
    } catch {
      return null;
    }
  }

  return {
    getItem(key: string): string | null {
      const s = backing();
      if (s) {
        try {
          return s.getItem(key);
        } catch {
          /* fall through to memory */
        }
      }
      return memory.has(key) ? (memory.get(key) as string) : null;
    },
    setItem(key: string, value: string): void {
      memory.set(key, value);
      const s = backing();
      if (s) {
        try {
          s.setItem(key, value);
        } catch {
          /* quota or blocked: memory copy still works */
        }
      }
    },
    removeItem(key: string): void {
      memory.delete(key);
      const s = backing();
      if (s) {
        try {
          s.removeItem(key);
        } catch {
          /* ignore */
        }
      }
    },
  };
}

export const safeLocal = makeStore("localStorage");
export const safeSession = makeStore("sessionStorage");
