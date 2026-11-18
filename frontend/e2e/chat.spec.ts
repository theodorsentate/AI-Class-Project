import { expect, test } from "@playwright/test";

test("ask privately is a chat thread with a greeting and quick replies", async ({ page }) => {
  await page.goto("/ask");
  const thread = page.getByRole("log");
  await expect(thread).toContainText("Hi Jordan, I am Handbook Buddy.");
  await page.getByRole("button", { name: "When does a meeting count toward my quota?" }).click();
  await expect(thread.getByText("When does a meeting count toward my quota?")).toBeVisible();
  await expect(thread.getByRole("link", { name: /Inbound leads, handoffs/ }).first()).toBeVisible();
  await page.getByLabel("Your question").fill("How many dials a day?");
  await page.getByRole("button", { name: "Get an answer" }).click();
  await expect(thread.getByText("How many dials a day?")).toBeVisible();
  await expect(thread.locator("h2", { hasText: "Answer" })).toHaveCount(2);
  await expect(page.getByLabel("Your question")).toHaveValue("");
});

test("confidential keeps nothing in the browser and off keeps the thread across a reload", async ({ page }) => {
  await page.goto("/ask");
  await page.getByLabel("Your question").fill("How do I request time off?");
  await page.getByRole("button", { name: "Get an answer" }).click();
  await expect(page.getByRole("log").getByRole("link", { name: /Paid time off/ })).toBeVisible();
  expect(await page.evaluate(() => sessionStorage.getItem("harbor-ask-thread-v2"))).toBeNull();
  await page.getByLabel("Confidential").uncheck();
  expect(await page.evaluate(() => sessionStorage.getItem("harbor-ask-thread-v2"))).toContain("request time off");
  await page.reload();
  await expect(page.getByRole("log")).toContainText("How do I request time off?");
  await page.getByLabel("Confidential").check();
  expect(await page.evaluate(() => sessionStorage.getItem("harbor-ask-thread-v2"))).toBeNull();
});
