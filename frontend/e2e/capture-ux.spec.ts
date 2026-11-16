import { test } from "@playwright/test";
import path from "node:path";

const routes = [
  ["home", "/"],
  ["ask", "/ask"],
  ["week", "/week"],
  ["library", "/library"],
  ["article", "/library/time-off"],
  ["people", "/people"],
  ["data", "/data"],
  ["escalate", "/escalate"],
  ["setup", "/setup"],
  ["support", "/support"],
];

const widths = [1440, 1024, 768, 390];
const out = path.join(process.cwd(), "..", "docs", "ux", process.env.UX_SHOTS === "after" ? "after" : "before");

test.describe("ux screenshots", () => {
  test.skip(!process.env.UX_SHOTS, "set UX_SHOTS=before|after to capture");

  for (const [name, route] of routes) {
    for (const width of widths) {
      test(`${name}-${width}`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.emulateMedia({ colorScheme: "light" });
        await page.goto(route);
        await page.screenshot({
          path: path.join(out, `${name}-${width}.png`),
          fullPage: true,
        });
      });
    }
  }
});
