import { test, expect } from "@playwright/test";

test.describe("Marketing smoke", () => {
  test("home page loads", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: "Shop" }).first()).toBeVisible();
  });

  test("shop catalog loads products", async ({ page }) => {
    await page.goto("/shop");
    await expect(page.getByRole("heading", { name: /curated furniture/i })).toBeVisible();
    await expect(page.getByTestId("product-add").first()).toBeVisible({
      timeout: 30_000
    });
  });

  test("blog index loads", async ({ page }) => {
    await page.goto("/blog");
    await expect(
      page.getByRole("heading", { name: /ideas for homes you actually live in/i })
    ).toBeVisible();
  });
});
