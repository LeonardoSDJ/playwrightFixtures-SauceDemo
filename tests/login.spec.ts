import { test, expect } from '../fixtures/sauceFixtures';
import * as allure from "allure-js-commons";

test.describe('Login functionality', () => {
  test.beforeEach(async () => {
    allure.epic('Authentication');
    allure.feature('User Login');
  });

  test('should login with standard user', async ({ loggedInPage, allureStep }) => {
    await allureStep('Verify successful login', async () => {
      await expect(loggedInPage.locator('.title')).toHaveText('Products');
      await expect(loggedInPage.locator('.inventory_item')).toHaveCount(6);
      
      const screenshot = await loggedInPage.screenshot();
      await allure.attachment('Products page', screenshot, {
        contentType: 'image/png'
      });
    });
  });

  test('should fail to login with locked user', async ({ page, userCredentials, allureStep }) => {
    await allureStep('Attempt login with locked user', async () => {
      // Using locked user credentials
      await page.goto('/');
      await page.fill('#user-name', userCredentials.locked.username);
      await page.fill('#password', userCredentials.locked.password);
      await page.click('#login-button');
      
      // Verify error message
      await expect(page.locator('[data-test="error"]')).toContainText('Epic sadface: Sorry, this user has been locked out');
      
      const screenshot = await page.screenshot();
      await allure.attachment('Login error', screenshot, {
        contentType: 'image/png'
      });
    });
  });

  test('should allow login with different user types', async ({ loginAs, allureStep }) => {
    // Using the login function fixture for problem user
    const page = await loginAs('problem');
    
    await allureStep('Verify problem user interface issues', async () => {
      await expect(page).toHaveURL(/inventory.html/);
      
      // Note that this user has broken images
      const brokenImages = await page.$$eval('img.inventory_item_img', 
        (imgs: HTMLImageElement[]) => imgs.filter(img => !img.complete || img.naturalWidth === 0).length);
      
      expect(brokenImages).toBe(0);
      
      const screenshot = await page.screenshot();
      await allure.attachment('Problem user page', screenshot, {
        contentType: 'image/png'
      });
    });
  });
});