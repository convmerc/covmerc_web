import { test, expect } from "@playwright/test";

test.describe("Storefront commerce", () => {
  test("guest can add to cart and reach checkout payment", async ({ page }) => {
    await page.goto("/shop");
    const addButton = page.getByTestId("product-add").first();
    await expect(addButton).toBeVisible({ timeout: 30_000 });
    await addButton.click();

    await page.goto("/cart");
    await expect(page.getByRole("heading", { name: /review your cart/i })).toBeVisible();
    await expect(page.getByText(/your cart is empty/i)).not.toBeVisible();

    await page.getByRole("link", { name: /proceed to checkout/i }).click();
    await expect(page).toHaveURL(/\/checkout/);

    await page.getByLabel(/full name/i).fill("E2E Guest");
    await page.getByLabel(/^email$/i).fill("e2e-guest@example.com");
    await page.getByLabel(/phone/i).fill("08000000000");
    await page.getByLabel(/street address/i).fill("12 Admiralty Way");
    await page.getByLabel(/^city$/i).fill("Lagos");
    await page.getByLabel(/postal/i).fill("101241");

    await page.getByRole("button", { name: /continue to payment/i }).click();
    await expect(page.getByRole("heading", { name: /payment method/i })).toBeVisible();

    await page.locator("select").first().selectOption("Pay on Delivery");
    await expect(page.getByRole("button", { name: /confirm order/i })).toBeVisible();
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
