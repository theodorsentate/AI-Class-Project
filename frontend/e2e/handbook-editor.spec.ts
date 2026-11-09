import { expect, test } from "@playwright/test";

test("setup rejects a blank handbook section", async ({ page }) => {
  await page.goto("/setup");
  await page.getByLabel("Handbook JSON or markdown").fill('{"sections":[{"id":"x","title":"","body":"","category":"A","tags":[],"summary":""}]}');
  await page.getByRole("button", { name: "Validate and save handbook" }).click();
  await expect(page.getByRole("status").last()).toContainText(/title|Could not read|no text/i);
});
