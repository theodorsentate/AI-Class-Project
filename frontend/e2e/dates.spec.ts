import { expect, test } from "@playwright/test";

test("start date drives first-week due badges and home up next", async ({ page }) => {
  await page.goto("/week");
  await page.getByLabel("Your start date").fill("2026-11-09");
  await expect(page.getByText(/business day/i)).toBeVisible();
  await expect(page.getByText(/Due |Overdue|Due today/).first()).toBeVisible();
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Up next" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Finish employment eligibility/i })).toBeVisible();
});
