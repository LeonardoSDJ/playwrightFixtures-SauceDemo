import { test, expect } from '../fixtures/sauceFixtures';
import * as allure from "allure-js-commons";

test('should display product details correctly', async ({ productDetailsPage, allureStep }) => {
  allure.epic('E-commerce');
  allure.feature('Product Details');
  
  const page = await productDetailsPage(0);
  
  await allureStep('Verify product details elements', async () => {
    // Check expected elements on product detail page
    await expect(page.locator('.inventory_details_name')).toBeVisible();
    await expect(page.locator('.inventory_details_desc')).toBeVisible();
    await expect(page.locator('.inventory_details_price')).toBeVisible();
    await expect(page.locator('.inventory_details_img')).toBeVisible();
    
    // Get product information for reporting
    const productName = await page.locator('.inventory_details_name').textContent();
    const productPrice = await page.locator('.inventory_details_price').textContent();
    
    allure.parameter('Product', productName || 'Unknown');
    allure.parameter('Price', productPrice || 'Unknown');
  });
  
  await allureStep('Test add to cart functionality', async () => {
    // Test add to cart functionality
    await page.click('[data-test^="add-to-cart"]');
    await expect(page.locator('.shopping_cart_badge')).toBeVisible();
    
    // Test remove from cart functionality
    await page.click('[data-test^="remove"]');
    await expect(page.locator('.shopping_cart_badge')).toBeHidden();
  });
});