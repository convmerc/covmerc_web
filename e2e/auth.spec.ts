import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("login page renders email sign-in", async ({ page }) => {
    await page.goto("/auth/login");
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator("form button[type='submit']")).toHaveText("Sign in");
  });

  test("account orders redirects unauthenticated users to login", async ({ page }) => {
    await page.goto("/account/orders");
    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(page.url()).toContain("next=");
  });

  test("account wishlist redirects unauthenticated users to login", async ({ page }) => {
    await page.goto("/account/wishlist");
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});
