import { expect, test } from "@playwright/test";

test("need support is on every page and crisis answers skip the handbook", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Need support?" }).click();
  await expect(page.getByRole("heading", { name: "Need support?" })).toBeVisible();
  await expect(page.getByRole("link", { name: /988/ })).toBeVisible();

  await page.goto("/ask");
  await page.getByLabel("Your question").fill("I wish I were dead");
  await page.getByRole("button", { name: "Get an answer" }).click();
  await expect(page.getByText("Please reach out to someone right now")).toBeVisible();
  await expect(page.getByRole("link", { name: /988/ })).toBeVisible();
});
