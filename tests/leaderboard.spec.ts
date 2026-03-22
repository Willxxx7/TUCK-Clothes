import { test, expect } from '@playwright/test';

test('Website loads', async ({ page }) => {
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
  
  const storyLink = page.getByRole('link', { name: 'Our Story' });
  await expect(storyLink).toBeVisible();
  console.log('✅ Our Story link exists');
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
  await expect(copyright).toContain('©');
  console.log('✅ Footer has copyright notice');
});
