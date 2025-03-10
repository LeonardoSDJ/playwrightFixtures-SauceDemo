import { test, expect } from '../fixtures/sauceFixtures';
import * as allure from "allure-js-commons";

test.describe('Checkout Form Validation', () => {
  test.beforeAll(() => {
    allure.epic('E-commerce');
    allure.feature('Checkout Validation');
  });

  test('should validate required fields', async ({ checkoutPage, allureStep }) => {
    await allureStep('Submit empty form', async () => {
      // Try to continue with empty form
      await checkoutPage.click('#continue');
      
      // Verify error message
      await expect(checkoutPage.locator('[data-test="error"]')).toBeVisible();
      await expect(checkoutPage.locator('[data-test="error"]')).toContainText('First Name is required');
      
      const screenshot = await checkoutPage.screenshot();
      await allure.attachment('Empty form validation', screenshot, {
        contentType: 'image/png'
      });
    });
    
    await allureStep('Fill only first name', async () => {
      // Fill only first name and try to continue
      await checkoutPage.fill('#first-name', 'John');
      await checkoutPage.click('#continue');
      
      // Verify new error message
      await expect(checkoutPage.locator('[data-test="error"]')).toBeVisible();
      await expect(checkoutPage.locator('[data-test="error"]')).toContainText('Last Name is required');
      
      const screenshot = await checkoutPage.screenshot();
      await allure.attachment('Partial form validation', screenshot, {
        contentType: 'image/png'
      });
    });
    
    await allureStep('Fill first and last name', async () => {
      // Fill first and last name but no zip
      await checkoutPage.fill('#first-name', 'John');
      await checkoutPage.fill('#last-name', 'Smith');
      await checkoutPage.click('#continue');
      
      // Verify final error message
      await expect(checkoutPage.locator('[data-test="error"]')).toBeVisible();
      await expect(checkoutPage.locator('[data-test="error"]')).toContainText('Postal Code is required');
      
      const screenshot = await checkoutPage.screenshot();
      await allure.attachment('Missing postal code validation', screenshot, {
        contentType: 'image/png'
      });
    });
  });

  test('should accept valid form data', async ({ checkoutPage, allureStep }) => {
    await allureStep('Fill all required fields', async () => {
      // Fill all required fields
      await checkoutPage.fill('#first-name', 'John');
      await checkoutPage.fill('#last-name', 'Smith');
      await checkoutPage.fill('#postal-code', '12345');
      
      const screenshot = await checkoutPage.screenshot();
      await allure.attachment('Completed form', screenshot, {
        contentType: 'image/png'
      });
    });
    
    await allureStep('Submit complete form', async () => {
      // Submit form and check we move to next step
      await checkoutPage.click('#continue');
      await expect(checkoutPage).toHaveURL(/checkout-step-two.html/);
      
      const screenshot = await checkoutPage.screenshot();
      await allure.attachment('Order summary page', screenshot, {
        contentType: 'image/png'
      });
    });
  });
});