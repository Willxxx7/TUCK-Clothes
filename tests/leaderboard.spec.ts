import { test, expect } from '@playwright/test';

test('TUCK-Clothes: Homepage loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/TUCK|Coastal|Shop/);
});

test('TUCK-Clothes: Add to cart works', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Add.*Cart/i }).click();
  await expect(page.locator('.cart-count')).toContainText('1');
});

test('TUCK-Clothes: Navigation works', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Our Story' })).toBeVisible();
});
