import { expect, test } from "@playwright/test";

test("escalate page can fill a draft template without an API key", async ({ page }) => {
  await page.goto("/escalate");
  await page.getByRole("button", { name: "Laptop or access" }).click();
  await expect(page.getByLabel("Subject")).not.toHaveValue("");
  await expect(page.getByLabel("Message")).toContainText("Lumenfield");
  await expect(page.getByRole("link", { name: "Open in mail app" })).toBeVisible();
});

test("a topic writes a complete email to the right inbox and flags blanks", async ({ page }) => {
  await page.goto("/escalate");
  await page.getByLabel("Message").fill("Acme Corp, 3 June, held with Dana");
  await page.getByRole("button", { name: "Meeting credit" }).click();
  await expect(page.getByLabel("Subject")).toHaveValue(/Meeting credit question/);
  const body = page.getByLabel("Message");
  await expect(body).toContainText("Hello RevOps");
  await expect(body).toContainText("Jordan Reyes");
  await expect(body).toContainText("Acme Corp, 3 June, held with Dana");
  await expect(page.getByText("Replace the [bracketed] parts")).toBeVisible();
  const href = await page.getByRole("link", { name: "Open in mail app" }).getAttribute("href");
  expect(href).toContain("mailto:revops@lumenfield.example");
});

test("a question from Ask privately becomes a readable email", async ({ page }) => {
  await page.goto("/escalate?q=" + encodeURIComponent("Who can fix my commission statement?"));
  await expect(page.getByLabel("Subject")).toHaveValue("Request: Who can fix my commission statement");
  await expect(page.getByLabel("Message")).toContainText("Who can fix my commission statement?");
});
