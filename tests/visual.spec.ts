import { test, expect } from '../fixtures/sauceFixtures';
import * as allure from "allure-js-commons";

test.describe('Visual Comparison Tests', () => {
  test.beforeAll(() => {
    allure.epic('User Interface');
    allure.feature('Visual Testing');
  });

  test('should match login page snapshot', async ({ page, allureStep }) => {
    await allureStep('Capture login page', async () => {
      await page.goto('/');
      
      // Take a screenshot and compare it with a baseline
      // Need to set up visual comparison in Playwright config
      await expect(page).toHaveScreenshot('login-page.png', {
        maxDiffPixelRatio: 0.01
      });
      
      const screenshot = await page.screenshot();
      await allure.attachment('Login page', screenshot, {
        contentType: 'image/png'
      });
    });
  });

  test('should match product page layout across browsers', async ({ loggedInPage, allureStep }) => {
    await allureStep('Verify consistent layout', async () => {
      // Set consistent viewport for cross-browser comparison
      await loggedInPage.setViewportSize({ width: 1280, height: 800 });
      
      // Take element-specific screenshots
      const productGrid = await loggedInPage.locator('.inventory_list');
      
      // Compare with baseline - good for cross-browser testing
      await expect(productGrid).toHaveScreenshot('product-grid.png', {
        maxDiffPixelRatio: 0.05
      });
      
      const screenshot = await productGrid.screenshot();
      await allure.attachment('Product grid', screenshot, {
        contentType: 'image/png'
      });
    });
  });
});