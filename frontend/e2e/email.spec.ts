import { expect, test } from "@playwright/test";

test("escalate page can fill a draft template without an API key", async ({ page }) => {
  await page.goto("/escalate");
  await page.getByRole("button", { name: "Laptop or access" }).click();
  await expect(page.getByLabel("Subject")).not.toHaveValue("");
  await expect(page.getByLabel("What do you need?")).toContainText("Northshore Goods");
  await expect(page.getByRole("link", { name: "Open in mail app" })).toBeVisible();
});
