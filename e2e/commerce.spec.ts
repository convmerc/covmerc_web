import { test, expect } from "@playwright/test";

test.describe("Storefront commerce", () => {
  test("guest can browse shop and add to cart", async ({ page }) => {
    await page.goto("/shop");
    const addButton = page.getByTestId("product-add").first();
    await expect(addButton).toBeVisible({ timeout: 30_000 });
    await addButton.click();

    await page.goto("/cart");
    await expect(page.getByRole("heading", { name: /review your cart/i })).toBeVisible();
    await expect(page.getByText(/your cart is empty/i)).not.toBeVisible();
  });

  test("checkout requires sign in", async ({ page }) => {
    await page.goto("/shop");
    const addButton = page.getByTestId("product-add").first();
    await expect(addButton).toBeVisible({ timeout: 30_000 });
    await addButton.click();

    await page.goto("/cart");
    await page.getByRole("link", { name: /sign in to checkout/i }).click();
    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(page.url()).toContain("next=%2Fcheckout");
  });

  test("product detail page shows add to cart", async ({ page }) => {
    await page.goto("/shop");
    const addButton = page.getByTestId("product-add").first();
    await expect(addButton).toBeVisible({ timeout: 30_000 });

    const productLink = page.locator('a[href^="/product/"]').first();
    const href = await productLink.getAttribute("href");
    expect(href).toBeTruthy();

    await page.goto(href!);
    await expect(page.getByRole("button", { name: /add to cart/i })).toBeVisible();
  });
});
