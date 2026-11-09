import { expect, test } from "@playwright/test";

test("keyboard path from home to ask, source, checklist, and escalate", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await page.getByRole("link", { name: "Ask privately" }).first().click();
  await page.getByLabel("Your question").fill("How do I request time off?");
  await page.getByRole("button", { name: "Get an answer" }).click();
  await page.getByRole("link", { name: /Time off, sick days, and holidays/i }).click();
  await expect(page.getByRole("heading", { name: "Time off, sick days, and holidays" })).toBeVisible();
  await page.getByRole("link", { name: "First week" }).first().click();
  const box = page.getByRole("checkbox", { name: "Finish employment eligibility paperwork" });
  await box.focus();
  await page.keyboard.press("Space");
  await expect(box).toBeChecked();
  await page.getByRole("link", { name: "Send to People Ops or IT" }).first().click();
  await page.getByLabel("What do you need?").fill("Need a laptop charger");
  await page.getByRole("button", { name: "Queue confidential note" }).click();
  await expect(page.getByText(/Your manager is not in the copy list/)).toBeVisible();
});
