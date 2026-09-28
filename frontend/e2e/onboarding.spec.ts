import { expect, test } from "@playwright/test";

test("home offers the three main actions", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "One place for new-hire questions" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Ask privately" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "First week" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Handbook" }).first()).toBeVisible();
});

test("private ask returns a time off answer", async ({ page }) => {
  await page.goto("/ask");
  await page.getByLabel("Your question").fill("How do I request time off?");
  await page.getByRole("button", { name: "Get an answer" }).click();
  await expect(page.getByRole("heading", { name: "Answer" })).toBeVisible();
  await expect(page.getByText(/time off|leave|timekeeping/i).first()).toBeVisible();
});

test("first week checklist can be completed", async ({ page }) => {
  await page.goto("/week");
  const box = page.getByRole("checkbox", { name: "Finish employment eligibility paperwork" });
  await expect(box).toBeEnabled();
  await box.click();
  await expect(box).toBeChecked();
  await expect(page.getByText("Completed 1 of 7.")).toBeVisible();
});

test("handbook article opens", async ({ page }) => {
  await page.goto("/library");
  await page.getByRole("link", { name: "Questions you do not have to take to your manager" }).click();
  await expect(
    page.getByRole("heading", { name: "Questions you do not have to take to your manager" }),
  ).toBeVisible();
});

test("company setup updates the header", async ({ page }) => {
  await page.goto("/setup");
  const name = page.getByLabel("Company name");
  await name.fill("Harbor Clinics");
  await expect(name).toHaveValue("Harbor Clinics");
  await page.getByRole("button", { name: "Save for this browser" }).click();
  await expect(page.getByRole("status")).toContainText("Harbor Clinics");
  await expect(page.getByRole("banner").getByText("Harbor Clinics")).toBeVisible();
});

test("escalation confirms manager is not copied", async ({ page }) => {
  await page.goto("/escalate");
  const note = page.getByLabel("What do you need?");
  await note.fill("Need a laptop charger");
  await expect(note).toHaveValue("Need a laptop charger");
  await page.getByRole("button", { name: "Queue confidential note" }).click();
  await expect(page.getByText("Your manager is not in the copy list.")).toBeVisible();
});
