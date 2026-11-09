import { expect, test } from "@playwright/test";

test("search dialog finds handbook sections and can ask the assistant", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Search" }).click();
  await expect(page.getByRole("dialog", { name: "Search" })).toBeVisible();
  await page.getByLabel("Find a page, handbook section, or ask").fill("time off");
  await expect(page.getByRole("button", { name: /Time off, sick days/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /Ask the assistant: time off/i })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Search" })).toHaveCount(0);
});
