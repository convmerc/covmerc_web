import { test, expect } from "@playwright/test";

test.describe("Contact", () => {
  test("contact form renders required fields", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByRole("heading", { name: /we are here to help/i })).toBeVisible();
    await expect(page.getByLabel(/full name/i)).toBeVisible();
    await expect(page.getByLabel(/email address/i)).toBeVisible();
    await expect(page.getByLabel(/subject/i)).toBeVisible();
    await expect(page.getByLabel(/message/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /send message/i })).toBeVisible();
  });
});
