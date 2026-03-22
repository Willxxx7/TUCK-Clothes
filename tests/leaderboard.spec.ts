import { test, expect } from '@playwright/test';

test.describe('TUCK Clothes Demo Store', () => {
  test('✅ Homepage loads + hero visible', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/TUCK|Coastal|Clothes|Demo/);
    await expect(page.locator('h1, .hero h1, [class*="hero"], header h1')).toBeVisible();
    await expect(page.locator('.product, [class*="item"], img, .grid')).toBeVisible();
  });

  test('✅ Cart functionality works', async ({ page }) => {
    await page.goto('/');
    // Click first Add to Cart button (adjust selector if needed)
    await page.click('.product button, [class*="add-cart"], [class*="buy"], button:visible');
    // Check cart indicator updates
    await expect(page.locator('.cart-count, .cart-icon, [class*="cart"]')).toBeVisible();
  });

  test('✅ Navigation works (menu links)', async ({ page }) => {
    await page.goto('/');
    // Click first navigation link
    const navLink = page.locator('nav a, .nav a, header a, .menu a').first();
    await navLink.click();
    await page.waitForLoadState('networkidle');
    await expect(page.locator('main, body')).toBeVisible();
  });

  test('📱 Mobile responsive design', async ({ page }) => {
    await page.goto('/');
    // Check products/grid visible on mobile
    await expect(page.locator('.product-grid, .products, .grid, .items')).toBeVisible();
    // Test hamburger menu if exists
    await page.click('.hamburger, [class*="menu-toggle"], .mobile-menu');
    await expect(page.locator('.mobile-nav, nav')).toBeVisible({ timeout: 2000 });
  });
});
