import { test, expect } from '../fixtures/sauceFixtures';
import * as allure from "allure-js-commons";

test.describe('Product Filtering and Sorting', () => {
  test.beforeAll(() => {
    allure.epic('E-commerce');
    allure.feature('Product Navigation');
  });

  test('should sort products by price low to high', async ({ loggedInPage, allureStep }) => {
    await allureStep('Apply price sorting (low to high)', async () => {
      await loggedInPage.selectOption('.product_sort_container', 'lohi');
      
      const screenshot = await loggedInPage.screenshot();
      await allure.attachment('Products sorted by price', screenshot, {
        contentType: 'image/png'
      });
    });
    
    await allureStep('Verify sorting order', async () => {
      // Get all product prices
      const prices = await loggedInPage.$$eval('.inventory_item_price', 
        elements => elements.map(el => parseFloat(el.textContent!.replace('$', '')))
      );
      
      // Check if prices are in ascending order
      for (let i = 0; i < prices.length - 1; i++) {
        expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
      }
      
      allure.parameter('Price Range', `$${prices[0]} - $${prices[prices.length - 1]}`);
    });
  });

  test('should view product details', async ({ productDetailsPage, allureStep }) => {
    // Using the productDetailsPage fixture instead of sorting test
    const detailsPage = await productDetailsPage(0); // Get first product details
    
    await allureStep('Verify product details page', async () => {
      // Check that we're on the details page
      await expect(detailsPage).toHaveURL(/inventory-item.html/);
      await expect(detailsPage.locator('.inventory_details_name')).toBeVisible();
      await expect(detailsPage.locator('.inventory_details_desc')).toBeVisible();
      await expect(detailsPage.locator('.inventory_details_price')).toBeVisible();
      
      // Get product information for reporting
      const name = await detailsPage.locator('.inventory_details_name').textContent();
      const price = await detailsPage.locator('.inventory_details_price').textContent();
      
      allure.parameter('Product Name', name || 'N/A');
      allure.parameter('Product Price', price || 'N/A');
    });
  });
});


