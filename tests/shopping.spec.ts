import { test, expect } from '../fixtures/sauceFixtures';
import * as allure from "allure-js-commons";

test.describe('Shopping Flow', () => {
  test.beforeAll(() => {
    allure.epic('E-commerce');
    allure.feature('Purchase Flow');
  });

  test('should complete checkout process', async ({ orderCompletePage, allureStep }) => {
    // Using the orderCompletePage fixture which already handles the entire flow
    await allureStep('Verify order completion', async () => {
      await expect(orderCompletePage.locator('.complete-header')).toHaveText('Thank you for your order!');
      
      // Capture confirmation screenshot
      const screenshot = await orderCompletePage.screenshot();
      await allure.attachment('Order confirmation', screenshot, 'image/png');
    });
  });

  test('should validate cart functionality', async ({ loggedInPage, addMultipleItemsToCart, allureStep }) => {
    // Using the addMultipleItemsToCart fixture
    await allureStep('Add item to cart', async () => {
      // Add just one item
      const cartPage = await addMultipleItemsToCart(1);
      await expect(cartPage.locator('.shopping_cart_badge')).toHaveText('1');
    });
    
    await allureStep('Remove items', async () => {
      // Cart items are already managed by the fixture's teardown
      await loggedInPage.click('.shopping_cart_link');
      await loggedInPage.click('#remove-sauce-labs-backpack');
      await expect(loggedInPage.locator('.shopping_cart_badge')).toBeHidden();
      
      const screenshot = await loggedInPage.screenshot();
      await allure.attachment('Cart after removing item', screenshot, 'image/png');
    });
  });
});