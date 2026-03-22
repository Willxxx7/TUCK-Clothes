import { test, expect } from '@playwright/test';

test('Homepage loads', async ({ page }) => {
  await page.goto('https://willxxx7.github.io/TUCK-Clothes/');
  const title = await page.title();
  expect(title).toContain('Coastal Spirit');
  console.log('✅ Homepage loaded successfully');
});

test('Navigation menu has all links', async ({ page }) => {
  await page.goto('https://willxxx7.github.io/TUCK-Clothes/');
  
  const navLinks = page.locator('.nav-list a');
  await expect(navLinks).toHaveCount(5);
  console.log('✅ Navigation has 5 links');
  
  const storyLink = page.locator('.nav-list a').filter({ hasText: 'Our Story' }).first();
  await expect(storyLink).toBeVisible();
  console.log('✅ Our Story link exists in navigation');
});

test('Newsletter form is visible', async ({ page }) => {
  await page.goto('https://willxxx7.github.io/TUCK-Clothes/');
  
  const emailInput = page.locator('#email');
  await expect(emailInput).toBeVisible();
  console.log('✅ Newsletter form exists');
  
  const subscribeBtn = page.locator('.newsletter-form button');
  await expect(subscribeBtn).toBeVisible();
  console.log('✅ Subscribe button exists');
});

test('Footer has copyright information', async ({ page }) => {
  await page.goto('https://willxxx7.github.io/TUCK-Clothes/');
  
  const footer = page.locator('.site-footer');
  await expect(footer).toBeVisible();
  
  const copyright = page.locator('.footer-bottom p');
  await expect(copyright).toContainText('©');
  console.log('✅ Footer has copyright notice');
});

test('Our Story section exists', async ({ page }) => {
  await page.goto('https://willxxx7.github.io/TUCK-Clothes/');
  
  const storySection = page.locator('#story');
  await expect(storySection).toBeVisible();
  console.log('✅ Our Story section exists');
});

test('Add to cart button works', async ({ page }) => {
  await page.goto('https://willxxx7.github.io/TUCK-Clothes/');
  
  await page.waitForTimeout(2000);
  
  const addButton = page.getByRole('button', { name: /Add to Cart/i }).first();
  
  if (await addButton.isVisible()) {
    await addButton.click();
    const cartCount = page.locator('#cartCount');
    await expect(cartCount).toContainText('1');
    console.log('✅ Add to cart works');
  } else {
    console.log('⚠️ No products found to test add to cart');
  }
});

// Skip cookie test for now
test.skip('Cookie consent popup works', async ({ page }) => {
  await page.goto('https://willxxx7.github.io/TUCK-Clothes/');
  
  const cookiePopup = page.locator('#cookieConsent');
  const acceptAll = page.locator('#acceptAll');
  
  await expect(cookiePopup).toBeVisible();
  await acceptAll.click();
  await expect(cookiePopup).toBeHidden({ timeout: 5000 });
  
  const cookieValue = await page.evaluate(() => localStorage.getItem('cookieConsent'));
  expect(cookieValue).toBe('all');
  console.log('✅ Cookie consent works');
});

// Test failure example - will show you what a failed test looks like
test('Test failure example', async ({ page }) => {
  await page.goto('https://willxxx7.github.io/TUCK-Clothes/');
  // This will fail intentionally
  await expect(page.locator('#does-not-exist')).toBeVisible();
});
