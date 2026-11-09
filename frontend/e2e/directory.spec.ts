import { expect, test } from "@playwright/test";

test("people directory filters by team and data tables are readable", async ({ page }) => {
  await page.goto("/people");
  await expect(page.getByText(/Sample directory for Northshore Goods/)).toBeVisible();
  await page.getByLabel("Team").selectOption("IT");
  await expect(page.getByRole("heading", { name: "Sam Ortiz" })).toBeVisible();
  await page.goto("/data");
  await expect(page.getByRole("heading", { name: "Holidays" })).toBeVisible();
  await expect(page.getByText("Employee Assistance Program")).toBeVisible();
});
