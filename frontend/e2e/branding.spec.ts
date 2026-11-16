import { expect, test } from "@playwright/test";

const wide =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="32"><rect width="240" height="32" fill="#209dd7"/><text x="8" y="22" fill="white" font-size="16">Acme Co</text></svg>`,
  );
const square =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#753991"/></svg>`,
  );

async function noOverflow(page: import("@playwright/test").Page) {
  return page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
}

test("short name with a wide logo does not overflow", async ({ page }) => {
  await page.goto("/setup");
  await page.getByLabel("Company name").fill("Acme");
  await page.getByLabel("Logo URL (optional)").fill(wide);
  await page.getByRole("button", { name: "Save for this browser" }).click();
  await expect(page.getByRole("banner").getByText("Acme")).toBeVisible();
  expect(await noOverflow(page)).toBe(false);
});

test("long company name with no logo does not overflow", async ({ page }) => {
  await page.goto("/setup");
  const longName = "Northshore Goods Regional Distribution and Employee Experience Office";
  await page.getByLabel("Company name").fill(longName);
  await page.getByLabel("Logo URL (optional)").fill("");
  await page.getByRole("button", { name: "Save for this browser" }).click();
  await expect(page.getByRole("banner").getByText(longName)).toBeVisible();
  expect(await noOverflow(page)).toBe(false);
});

test("square logo does not overflow", async ({ page }) => {
  await page.goto("/setup");
  await page.getByLabel("Company name").fill("Harbor");
  await page.getByLabel("Logo URL (optional)").fill(square);
  await page.getByRole("button", { name: "Save for this browser" }).click();
  await expect(page.getByRole("banner").getByText("Harbor")).toBeVisible();
  expect(await noOverflow(page)).toBe(false);
});

test("no horizontal scroll at 320px on home", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto("/");
  expect(await noOverflow(page)).toBe(false);
});
