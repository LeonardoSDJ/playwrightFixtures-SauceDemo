import { test, expect } from '../fixtures/sauceFixtures';
import * as allure from "allure-js-commons";

test.describe('Performance Testing', () => {
  test.beforeAll(() => {
    allure.epic('Performance');
    allure.feature('Load Times');
  });

  test('should measure login performance with performance_glitch_user', async ({ page, userCredentials, allureStep, performanceMetrics }) => {
    await allureStep('Prepare for performance measurement', async () => {
      await page.goto('/');
    });
    
    await allureStep('Measure login time for performance user', async () => {
      // Use performanceMetrics fixture instead of manual timing
      const loginDuration = await performanceMetrics.measureAction('Performance User Login', async () => {
        // Login with performance glitch user
        await page.fill('#user-name', userCredentials.performance.username);
        await page.fill('#password', userCredentials.performance.password);
        await page.click('#login-button');
        
        // Wait for navigation to complete
        await page.waitForURL(/inventory.html/);
      });
      
      // Take screenshot after login completes
      const screenshot = await page.screenshot();
      await allure.attachment('After performance user login', screenshot, {
        contentType: 'image/png'
      });
      
      // Capture navigation timing metrics
      const navTiming = await performanceMetrics.captureNavigationTiming(page);
      
      // Optional: Set a threshold for performance
      expect(loginDuration).toBeLessThan(10000);
    });
  });

  test('should compare login times between standard and performance users', async ({ page, userCredentials, performanceMetrics, allureStep }) => {
    // Use performanceMetrics fixture instead of manual timing function
    await allureStep('Measure standard user login', async () => {
      await page.goto('/');
      
      const standardTime = await performanceMetrics.measureAction('Standard User Login', async () => {
        await page.fill('#user-name', userCredentials.standard.username);
        await page.fill('#password', userCredentials.standard.password);
        await page.click('#login-button');
        await page.waitForURL(/inventory.html/);
      });
    });
    
    // Log out to prepare for next login
    await page.click('#react-burger-menu-btn');
    await page.click('#logout_sidebar_link');
    
    await allureStep('Measure performance user login', async () => {
      await page.goto('/');
      
      const performanceTime = await performanceMetrics.measureAction('Performance User Login', async () => {
        await page.fill('#user-name', userCredentials.performance.username);
        await page.fill('#password', userCredentials.performance.password);
        await page.click('#login-button');
        await page.waitForURL(/inventory.html/);
      });
    });
  });
});