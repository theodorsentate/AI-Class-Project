import { expect, test } from "@playwright/test";

test("ask privately still answers from the handbook without an API key", async ({ page }) => {
  await page.goto("/ask");
  await expect(page.getByLabel("Read the whole handbook when an API key is set")).toBeVisible();
  await page.getByLabel("Your question").fill("How do I request time off?");
  await page.getByRole("button", { name: "Get an answer" }).click();
  await expect(page.getByRole("link", { name: /Time off, sick days, and holidays/i })).toBeVisible();
});
