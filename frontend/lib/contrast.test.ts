import { describe, expect, it } from "vitest";

function hexToRgb(hex: string): [number, number, number] {
  const n = hex.replace("#", "");
  return [parseInt(n.slice(0, 2), 16), parseInt(n.slice(2, 4), 16), parseInt(n.slice(4, 6), 16)];
}

function channel(c: number) {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function contrast(a: string, b: string) {
  const [ar, ag, ab] = hexToRgb(a).map(channel);
  const [br, bg, bb] = hexToRgb(b).map(channel);
  const l1 = 0.2126 * ar + 0.7152 * ag + 0.0722 * ab;
  const l2 = 0.2126 * br + 0.7152 * bg + 0.0722 * bb;
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

const light = {
  text: "#032147",
  muted: "#3d4a57",
  paper: "#f6f4ef",
  surface: "#ffffff",
  blue: "#147096",
};

const dark = {
  text: "#e8eef5",
  muted: "#c5d0db",
  paper: "#071525",
  surface: "#0e2136",
  blue: "#6ec4e8",
};

describe("token contrast", () => {
  it("meets 4.5:1 for body text on paper and surface", () => {
    expect(contrast(light.text, light.paper)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(light.text, light.surface)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(light.muted, light.paper)).toBeGreaterThanOrEqual(4.5);
  });

  it("meets 3:1 for primary blue on white", () => {
    expect(contrast(light.blue, light.surface)).toBeGreaterThanOrEqual(3);
  });

  it("meets 4.5:1 in dark mode for body text", () => {
    expect(contrast(dark.text, dark.paper)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(dark.muted, dark.paper)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(dark.blue, dark.paper)).toBeGreaterThanOrEqual(3);
  });
});
