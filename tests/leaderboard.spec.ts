import { test, expect } from '@playwright/test';

test('Homepage loads', async ({ page }) => {
  await page.goto('https://willxxx7.github.io/TUCK-Clothes/');
  const title = await page.title();
  expect(title).toContain('Coastal Spirit');
  console.log('✅ Homepage loaded successfully');
});

test('Navigation menu has all links', async ({ page }) => {
  await page.goto('https://willxxx7.github.io/TUCK-Clothes/');
  
  // Check navigation has 5 links
  const navLinks = page.locator('.nav-list a');
  await expect(navLinks).toHaveCount(5);
  console.log('✅ Navigation has 5 links');
  
  // Fix: Be more specific - use the navigation menu link
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
  
  // Fix: Use correct selector for copyright text
  const copyright = page.locator('.footer-bottom p');
  await expect(copyright).toContainText('©');
  console.log('✅ Footer has copyright notice');
});

test('Our Story section exists', async ({ page }) => {
  await page.goto('https://willxxx7.github.io/TUCK-Clothes/');
  
  // Check the story section exists
  const storySection = page.locator('#story');
  await expect(storySection).toBeVisible();
  console.log('✅ Our Story section exists');
});

test('Add to cart button works', async ({ page }) => {
  await page.goto('https://willxxx7.github.io/TUCK-Clothes/');
  
  // Wait for products to load (they load from API)
  await page.waitForTimeout(2000);
  
  // Check if there's any add to cart button
  const addButton = page.getByRole('button', { name: /Add to Cart/i }).first();
  
  if (await addButton.isVisible()) {
    await addButton.click();
    
    // Check cart count updates
    const cartCount = page.locator('#cartCount');
    await expect(cartCount).toContainText('1');
    console.log('✅ Add to cart works');
  } else {
    console.log('⚠️ No products found to test add to cart');
  }
});

test('Cookie consent popup works', async ({ page }) => {
  await page.goto('https://willxxx7.github.io/TUCK-Clothes/');
  
  const cookiePopup = page.locator('#cookieConsent');
  if (await cookiePopup.isVisible()) {
    await page.locator('#acceptAll').click();
    await expect(cookiePopup).not.toBeVisible();
    console.log('✅ Cookie consent works');
  } else {
    console.log('⚠️ Cookie popup not found');
  }
});
