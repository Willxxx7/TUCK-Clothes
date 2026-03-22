import { test, expect } from '@playwright/test';

test('Website loads', async ({ page }) => {
  // Go to the site
  await page.goto('https://willxxx7.github.io/TUCK-Clothes/');
  
  // Just check the page loaded
  const title = await page.title();
  console.log('Page title:', title);
  
  // Simple check that title exists
  expect(title.length).toBeGreaterThan(0);
  
  console.log('Test completed successfully!');
});
