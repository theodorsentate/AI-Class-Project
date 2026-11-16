import { afterEach, describe, expect, it, vi } from "vitest";

function blockedWindow() {
  const deny = () => {
    throw new DOMException("denied", "SecurityError");
  };
  return {
    get localStorage() {
      return deny();
    },
    get sessionStorage() {
      return deny();
    },
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetModules();
});

describe("safe storage", () => {
  it("does not throw when storage is blocked and keeps values in memory", async () => {
    vi.stubGlobal("window", blockedWindow());
    const { safeLocal, safeSession } = await import("./safe-storage");
    expect(safeLocal.getItem("a")).toBeNull();
    expect(() => safeLocal.setItem("a", "1")).not.toThrow();
    expect(safeLocal.getItem("a")).toBe("1");
    safeSession.setItem("b", "2");
    expect(safeSession.getItem("b")).toBe("2");
    safeSession.removeItem("b");
    expect(safeSession.getItem("b")).toBeNull();
  });

  it("works with no window at all (server render)", async () => {
    vi.stubGlobal("window", undefined);
    const { safeLocal } = await import("./safe-storage");
    expect(safeLocal.getItem("x")).toBeNull();
    safeLocal.setItem("x", "y");
    expect(safeLocal.getItem("x")).toBe("y");
  });

  it("uses real storage when available", async () => {
    const data = new Map<string, string>();
    const fake = {
      getItem: (k: string) => (data.has(k) ? (data.get(k) as string) : null),
      setItem: (k: string, v: string) => void data.set(k, v),
      removeItem: (k: string) => void data.delete(k),
    };
    vi.stubGlobal("window", { localStorage: fake, sessionStorage: fake });
    const { safeLocal } = await import("./safe-storage");
    safeLocal.setItem("k", "v");
    expect(data.get("k")).toBe("v");
  });
});
