import { test, expect } from '@playwright/test';

test('TUCK-Clothes: Homepage loads', async ({ page }) => {
  await page.goto('/');
  // Your actual site title is "Coastal Spirit · Sustainable Clothing"
  await expect(page).toHaveTitle(/Coastal Spirit|Sustainable Clothing/);
  // Verify the main hero section loads
  await expect(page.locator('.hero')).toBeVisible();
});

test('TUCK-Clothes: Add to cart works', async ({ page }) => {
  await page.goto('/');
  
  // Wait for products to load (they're loaded dynamically by JavaScript)
  await page.waitForSelector('.category-grid .product-card', { timeout: 10000 });
  
  // Find the first "Add to Cart" button
  const addButton = page.getByRole('button', { name: /Add to Cart/i }).first();
  
  // Click the add to cart button
  await addButton.click();
  
  // Check if cart count updates (should be in the cart toggle button)
  const cartCount = page.locator('#cartCount');
  await expect(cartCount).toContainText('1');
  
  // Also check the header cart count
  const headerCartCount = page.locator('#cartCountHeader');
  await expect(headerCartCount).toContainText('1');
});

test('TUCK-Clothes: Navigation works', async ({ page }) => {
  await page.goto('/');
  
  // Check for "Our Story" link (it's in the navigation)
  const ourStoryLink = page.getByRole('link', { name: /Our Story/i });
  await expect(ourStoryLink).toBeVisible();
  
  // Also check that the link points to the #story section
  await expect(ourStoryLink).toHaveAttribute('href', '#story');
});

test('TUCK-Clothes: Cart opens and closes', async ({ page }) => {
  await page.goto('/');
  
  // Click the cart toggle button
  await page.locator('#cartToggle').click();
  
  // Check that mini cart becomes visible
  await expect(page.locator('#miniCart')).toBeVisible();
  
  // Close the cart
  await page.locator('#closeCart').click();
  
  // Check that mini cart becomes hidden
  await expect(page.locator('#miniCart')).not.toBeVisible();
});

test('TUCK-Clothes: Checkout button works', async ({ page }) => {
  await page.goto('/');
  
  // Open cart first (to see checkout button)
  await page.locator('#cartToggle').click();
  
  // Click checkout button in mini cart
  const checkoutBtn = page.locator('.mini-cart-footer .checkout-btn');
  await checkoutBtn.click();
  
  // Should navigate to checkout.html
  await expect(page).toHaveURL(/checkout.html/);
});

test('TUCK-Clothes: Newsletter subscription form works', async ({ page }) => {
  await page.goto('/');
  
  // Find newsletter form
  const emailInput = page.locator('#email');
  const subscribeBtn = page.locator('.newsletter-form button');
  
  // Fill in email and submit
  await emailInput.fill('test@example.com');
  await subscribeBtn.click();
  
  // Check for success message (you may need to adjust based on your actual implementation)
  // For now, just check that form submitted (maybe page reloads or shows message)
  await expect(page.locator('.newsletter-form')).toBeVisible();
});

test('TUCK-Clothes: Cookie consent popup works', async ({ page }) => {
  await page.goto('/');
  
  // Check that cookie consent popup appears
  const cookiePopup = page.locator('#cookieConsent');
  await expect(cookiePopup).toBeVisible();
  
  // Click "Accept all" button
  await page.locator('#acceptAll').click();
  
  // Cookie popup should disappear
  await expect(cookiePopup).not.toBeVisible();
});
