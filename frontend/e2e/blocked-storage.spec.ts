import { expect, test } from "@playwright/test";

test("app still renders and works when browser storage is blocked", async ({ page }) => {
  await page.addInitScript(() => {
    for (const k of ["localStorage", "sessionStorage"]) {
      Object.defineProperty(window, k, {
        get() {
          throw new DOMException("denied", "SecurityError");
        },
      });
    }
  });
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
  for (const path of ["/week", "/ask", "/library", "/escalate", "/setup", "/people", "/data", "/support"]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
  }
  await page.goto("/week");
  const box = page.getByRole("checkbox", { name: "Finish employment eligibility paperwork" });
  await box.check();
  await expect(box).toBeChecked();
  expect(errors).toEqual([]);
});
