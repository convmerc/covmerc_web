import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("forgot password page renders", async ({ page }) => {
    await page.goto("/auth/forgot-password");
    await expect(page.getByRole("heading", { name: /reset your password/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /send reset link/i })).toBeVisible();
  });

  test("login page renders email sign-in", async ({ page }) => {
    await page.goto("/auth/login");
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator("form button[type='submit']")).toHaveText("Sign in");
    await expect(page.getByRole("link", { name: /forgot password/i })).toBeVisible();
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

  test("sell page is public without sign-in", async ({ page }) => {
    await page.goto("/sell");
    await expect(page.getByRole("heading", { name: /sell furniture on covmerc/i })).toBeVisible();
    await expect(page.getByText(/no account needed/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /create account/i })).toBeVisible();
  });

  test("admin login page redirects to shared auth", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page).toHaveURL(/\/auth\/login/);
    const next = new URL(page.url()).searchParams.get("next");
    expect(next).toBe("/admin");
  });

  test("checkout redirects unauthenticated users to login", async ({ page }) => {
    await page.goto("/checkout");
    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(page.url()).toContain("next=");
  });
});
