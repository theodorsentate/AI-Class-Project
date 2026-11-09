import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = ["/", "/ask", "/week", "/library", "/library/time-off", "/escalate", "/setup", "/support", "/people", "/data"];

for (const path of pages) {
  test(`axe ${path}`, async ({ page }) => {
    await page.goto(path);
    const light = await new AxeBuilder({ page }).analyze();
    expect(light.violations, path + " light").toEqual([]);
    await page.emulateMedia({ colorScheme: "dark" });
    await page.evaluate(() => document.documentElement.classList.add("dark"));
    await page.waitForFunction(() => document.documentElement.classList.contains("dark"));
    await page.evaluate(() => new Promise((resolve) => window.setTimeout(resolve, 300)));
    const dark = await new AxeBuilder({ page }).analyze();
    expect(dark.violations, path + " dark").toEqual([]);
  });
}
