import { test, expect } from '../fixtures/sauceFixtures';
import * as allure from "allure-js-commons";

test.describe('Advanced Testing Scenarios', () => {
  test.beforeAll(() => {
    allure.epic('Advanced E-commerce Tests');
  });

  test('should navigate between product details pages', async ({ productDetailsPage, allureStep }) => {
    allure.feature('Product Navigation');
    
    // View first product
    const page = await productDetailsPage(0);
    const firstProductName = await page.locator('.inventory_details_name').textContent();
    
    await allureStep('Return to product list and view second product', async () => {
      await page.click('#back-to-products');
      await page.locator('.inventory_item_name').nth(1).click();
      
      // Verify we're on a different product
      const secondProductName = await page.locator('.inventory_details_name').textContent();
      expect(secondProductName).not.toEqual(firstProductName);
      
      allure.parameter('First Product', firstProductName || 'Unknown');
      allure.parameter('Second Product', secondProductName || 'Unknown');
    });
  });

  test('should add multiple items and verify cart total', async ({ loggedInPage, addMultipleItemsToCart, allureStep }) => {
    allure.feature('Cart Management');
    
    // Add 3 items to cart
    const page = await addMultipleItemsToCart(3);
    
    await allureStep('Navigate to cart and verify items', async () => {
      await page.click('.shopping_cart_link');
      
      // Count items in cart
      const itemCount = await page.locator('.cart_item').count();
      expect(itemCount).toBe(3);
      
      // Calculate expected total
      const prices = await page.$$eval('.inventory_item_price', 
        elements => elements.map(el => parseFloat(el.textContent!.replace('$', '')))
      );
      
      const total = prices.reduce((sum, price) => sum + price, 0);
      allure.parameter('Cart Total', `$${total.toFixed(2)}`);
      
      const screenshot = await page.screenshot();
      await allure.attachment('Cart with multiple items', screenshot, {
        contentType: 'image/png'
      });
    });
  });

  test('should measure performance of key user flows', async ({ page, userCredentials, performanceMetrics, allureStep }) => {
    allure.feature('Performance Measurement');
    
    await allureStep('Measure login performance', async () => {
      await page.goto('/');
      
      // Measure login performance for standard user
      const loginDuration = await performanceMetrics.measureAction('Standard user login', async () => {
        await page.fill('#user-name', userCredentials.standard.username);
        await page.fill('#password', userCredentials.standard.password);
        await page.click('#login-button');
        await page.waitForURL(/inventory.html/);
      });
      
      // Log performance to console and report
      console.log(`Login took: ${loginDuration}ms`);
    });
    
    await allureStep('Measure product browsing performance', async () => {
      // Measure time to add items to cart
      await performanceMetrics.measureAction('Add item to cart', async () => {
        await page.click('#add-to-cart-sauce-labs-backpack');
      });
      
      // Measure cart navigation time
      await performanceMetrics.measureAction('Navigate to cart', async () => {
        await page.click('.shopping_cart_link');
        await page.waitForURL(/cart.html/);
      });
    });
  });

  test('should complete checkout with different payment information', async ({ checkoutPage, allureStep }) => {
    allure.feature('Checkout Variations');
    
    await allureStep('Complete form with long name and address', async () => {
      // Test boundary conditions with long strings
      await checkoutPage.fill('#first-name', 'Johnathon Alexander');
      await checkoutPage.fill('#last-name', 'Smith-Johnson');
      await checkoutPage.fill('#postal-code', '90210-1234');
      
      const screenshot = await checkoutPage.screenshot();
      await allure.attachment('Checkout form with long inputs', screenshot, {
        contentType: 'image/png'
      });
      
      await checkoutPage.click('#continue');
      await expect(checkoutPage).toHaveURL(/checkout-step-two.html/);
    });
    
    await allureStep('Verify order summary information', async () => {
      // Verify tax calculation is approximately 8%
      const subtotalText = await checkoutPage.locator('.summary_subtotal_label').textContent();
      const taxText = await checkoutPage.locator('.summary_tax_label').textContent();
      const totalText = await checkoutPage.locator('.summary_total_label').textContent();
      
      // Parse out the numbers
      const subtotal = parseFloat(subtotalText!.replace(/[^0-9.]/g, ''));
      const tax = parseFloat(taxText!.replace(/[^0-9.]/g, ''));
      const total = parseFloat(totalText!.replace(/[^0-9.]/g, ''));
      
      // Verify tax is roughly 8% of subtotal
      const expectedTax = subtotal * 0.08;
      expect(tax).toBeCloseTo(expectedTax, 1);
      
      // Verify total equals subtotal + tax
      expect(total).toBeCloseTo(subtotal + tax, 1);
      
      // Log values to report
      allure.parameter('Subtotal', `$${subtotal.toFixed(2)}`);
      allure.parameter('Tax', `$${tax.toFixed(2)} (${(tax/subtotal*100).toFixed(2)}%)`);
      allure.parameter('Total', `$${total.toFixed(2)}`);
    });
  });

  test('should handle errors and network conditions', async ({ page, allureStep }) => {
    allure.feature('Error Handling');
    
    await allureStep('Simulate slow network connection', async () => {
      // Slow down network responses
      await page.route('**/*', route => route.continue({ headers: { 'X-Slow-Connection': '500ms' } }));
      
      // Navigate to login
      await page.goto('/');
      await page.fill('#user-name', 'standard_user');
      await page.fill('#password', 'secret_sauce');
      
      // Measure login under slow network
      const startTime = Date.now();
      await page.click('#login-button');
      await page.waitForURL(/inventory.html/);
      const duration = Date.now() - startTime;
      
      allure.parameter('Login time with 500ms delay', `${duration}ms`);
      
      // Remove the delay for subsequent tests
      await page.unroute('**/*');
    });
    
    await allureStep('Simulate network error for images', async () => {
      // Fail all image requests
      await page.route('**/*.jpg', route => route.abort());
      
      // Refresh page to see effect
      await page.reload();
      
      // Check for broken images
      const brokenImages = await page.$$eval('img.inventory_item_img', 
        imgs => (imgs as HTMLImageElement[]).filter(img => !img.complete || img.naturalWidth === 0).length
      );
      
      expect(brokenImages).toBe(0);
      allure.parameter('Broken images count', brokenImages.toString());
      
      const screenshot = await page.screenshot();
      await allure.attachment('Page with blocked images', screenshot, {
        contentType: 'image/png'
      });
      
      // Restore normal image loading
      await page.unroute('**/*.jpg');
    });
  });
});