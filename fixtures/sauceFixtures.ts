import { test as base, expect, Page } from '@playwright/test';
import * as allure from "allure-js-commons";

// Interface for user structure
interface User {
  username: string;
  password: string;
}

// Interface for user credentials object
interface UserCredentials {
  standard: User;
  locked: User;
  problem: User;
  performance: User;
  [key: string]: User; 
}

// Type for login function with specific user
type LoginFunction = (userType: keyof UserCredentials) => Promise<Page>;

// Interface for unified fixtures
interface fixtures {
  userCredentials: UserCredentials;
  homePage: Page;
  loggedInPage: Page;
  cartWithItems: Page;
  loginAs: LoginFunction;
  allureStep: (name: string, callback: () => Promise<void>) => Promise<void>;
  
  checkoutPage: Page;
  productDetailsPage: (productIndex?: number) => Promise<Page>;
  orderCompletePage: Page;
  addMultipleItemsToCart: (itemCount: number) => Promise<Page>;
  performanceMetrics: {
    measureAction: (actionName: string, action: () => Promise<void>) => Promise<number>;
    captureNavigationTiming: (page: Page) => Promise<Record<string, number>>;
  };
}

// List of available users
const users: UserCredentials = {
  standard: {
    username: 'standard_user',
    password: 'secret_sauce'
  },
  locked: {
    username: 'locked_out_user',
    password: 'secret_sauce'
  },
  problem: {
    username: 'problem_user',
    password: 'secret_sauce'
  },
  performance: {
    username: 'performance_glitch_user',
    password: 'secret_sauce'
  }
};

// Creating unified fixtures with typing
export const test = base.extend<fixtures>({
  userCredentials: [users, { option: true }],
  
  homePage: async ({ page }, use) => {
    await page.goto('/');
    await use(page);
  },

  allureStep: async ({}, use) => {
    const stepFunction = async (name: string, callback: () => Promise<void>) => {
      await allure.step(name, callback);
    };
    
    await use(stepFunction);
  },

  loggedInPage: async ({ page }, use) => {
    await allure.step('Login as standard user', async () => {
      await page.goto('/');
      await page.fill('#user-name', users.standard.username);
      await page.fill('#password', users.standard.password);
      await page.click('#login-button');
      
      await expect(page).toHaveURL(/inventory.html/);
    });
    
    // Adding an attachment to the report - screenshot after login
    const screenshot = await page.screenshot();
    await allure.attachment('Page after login', screenshot, {
      contentType: 'image/png'
    });
    
    await use(page);
    
    try {
      if (page.url().includes('inventory')) {
        await allure.step('Logout', async () => {
          await page.click('#react-burger-menu-btn');
          await page.click('#logout_sidebar_link');
          await expect(page).toHaveURL(/$/);
        });
      }
    } catch (e) {
      console.log('Could not logout:', e);
    }
  },

  cartWithItems: async ({ loggedInPage }, use) => {
    const page = loggedInPage;
    
    await allure.step('Add products to cart', async () => {
      // Add some products to the cart
      await page.click('#add-to-cart-sauce-labs-backpack');
      await page.click('#add-to-cart-sauce-labs-bike-light');
      
      // Go to the cart page
      await page.click('.shopping_cart_link');
      await expect(page).toHaveURL(/cart.html/);
    });
    
    // Make the page with the cart available for the test
    await use(page);
    
    // Teardown - clean the cart
    try {
      if (page.url().includes('cart')) {
        await allure.step('Clean up cart', async () => {
          await page.click('#remove-sauce-labs-backpack');
          await page.click('#remove-sauce-labs-bike-light');
        });
      }
    } catch (e) {
      console.log('Could not clean the cart:', e);
    }
  },

  loginAs: async ({ page }, use) => {
    // Create a login function that accepts the user type
    const loginFunction = async (userType: keyof UserCredentials): Promise<Page> => {
      if (!users[userType]) {
        throw new Error(`Unknown user type: ${userType}`);
      }
      
      await allure.step(`Login as ${userType} user`, async () => {
        await page.goto('/');
        await page.fill('#user-name', users[userType].username);
        await page.fill('#password', users[userType].password);
        await page.click('#login-button');
      });
      
      return page;
    };
    
    // Make the login function available for the test
    await use(loginFunction);
  },

  checkoutPage: async ({ loggedInPage }, use) => {
    await allure.step('Navigate to checkout page', async () => {
      // Add an item to cart
      await loggedInPage.click('#add-to-cart-sauce-labs-backpack');
      
      // Go to cart
      await loggedInPage.click('.shopping_cart_link');
      
      // Proceed to checkout
      await loggedInPage.click('#checkout');
      await expect(loggedInPage).toHaveURL(/checkout-step-one.html/);
      
      // Capture a screenshot for the report
      const screenshot = await loggedInPage.screenshot();
      await allure.attachment('Checkout page initial state', screenshot, {
        contentType: 'image/png'
      });
    });
    
    await use(loggedInPage);
    
    // Teardown - abandon checkout if we're still in the flow
    try {
      if (loggedInPage.url().includes('checkout')) {
        await loggedInPage.goto('/inventory.html');
      }
    } catch (e) {
      console.log('Could not reset checkout state:', e);
    }
  },
  
  productDetailsPage: async ({ loggedInPage }, use) => {
    const productDetailFn = async (productIndex = 0) => {
      await allure.step(`Navigate to product details (index: ${productIndex})`, async () => {
        // Make sure we're on the inventory page
        if (!loggedInPage.url().includes('inventory.html')) {
          await loggedInPage.goto('/inventory.html');
        }
        
        // Get all product links and click the one at specified index
        const productLinks = loggedInPage.locator('.inventory_item_name');
        const count = await productLinks.count();
        
        if (productIndex >= count) {
          throw new Error(`Product index ${productIndex} out of range (only ${count} products available)`);
        }
        
        await productLinks.nth(productIndex).click();
        await expect(loggedInPage).toHaveURL(/inventory-item.html/);
        
        // Capture screenshot for reporting
        const screenshot = await loggedInPage.screenshot();
        await allure.attachment(`Product details (index: ${productIndex})`, screenshot, {
          contentType: 'image/png'
        });
      });
      
      return loggedInPage;
    };
    
    await use(productDetailFn);
    
    // Teardown - return to product list
    try {
      if (loggedInPage.url().includes('inventory-item')) {
        await loggedInPage.click('#back-to-products');
      }
    } catch (e) {
      console.log('Could not return to product list:', e);
    }
  },
  
  orderCompletePage: async ({ loggedInPage }, use) => {
    await allure.step('Complete full order flow to reach confirmation page', async () => {
      // Add an item to cart
      await loggedInPage.click('#add-to-cart-sauce-labs-backpack');
      
      // Go to cart
      await loggedInPage.click('.shopping_cart_link');
      
      // Proceed to checkout
      await loggedInPage.click('#checkout');
      
      // Fill checkout info
      await loggedInPage.fill('#first-name', 'Test');
      await loggedInPage.fill('#last-name', 'User');
      await loggedInPage.fill('#postal-code', '12345');
      await loggedInPage.click('#continue');
      
      // Finalize order
      await loggedInPage.click('#finish');
      await expect(loggedInPage).toHaveURL(/checkout-complete.html/);
      
      // Capture screenshot for reporting
      const screenshot = await loggedInPage.screenshot();
      await allure.attachment('Order confirmation page', screenshot, {
        contentType: 'image/png'
      });
    });
    
    await use(loggedInPage);
    
    // Teardown - go back to home
    try {
      if (loggedInPage.url().includes('checkout-complete')) {
        await loggedInPage.click('#back-to-products');
      }
    } catch (e) {
      console.log('Could not return to products:', e);
    }
  },
  
  addMultipleItemsToCart: async ({ loggedInPage }, use) => {
    const addItemsFn = async (itemCount: number) => {
      await allure.step(`Add ${itemCount} items to cart`, async () => {
        // Get all add to cart buttons
        const addButtons = loggedInPage.locator('[data-test^="add-to-cart"]');
        const availableCount = await addButtons.count();
        
        // Determine how many to add
        const actualCount = Math.min(itemCount, availableCount);
        
        // Add the specified number of items
        for (let i = 0; i < actualCount; i++) {
          await addButtons.nth(i).click();
        }
        
        // Verify cart count
        await expect(loggedInPage.locator('.shopping_cart_badge')).toHaveText(String(actualCount));
        
        // Capture screenshot for reporting
        const screenshot = await loggedInPage.screenshot();
        await allure.attachment(`Cart with ${actualCount} items`, screenshot, {
          contentType: 'image/png'
        });
      });
      
      return loggedInPage;
    };
    
    await use(addItemsFn);
    
    // Teardown - reset cart
    try {
      // Go to cart page
      await loggedInPage.click('.shopping_cart_link');
      
      // Count items in cart
      const cartItems = loggedInPage.locator('.cart_item');
      const itemCount = await cartItems.count();
      
      // Remove all items
      for (let i = 0; i < itemCount; i++) {
        await loggedInPage.locator('[data-test^="remove"]').first().click();
      }
      
      // Return to inventory
      await loggedInPage.goto('/inventory.html');
    } catch (e) {
      console.log('Could not reset cart:', e);
    }
  },
  
  performanceMetrics: async ({}, use) => {
    const metrics = {
      // Measure the time an action takes to complete
      measureAction: async (actionName: string, action: () => Promise<void>): Promise<number> => {
        await allure.step(`Measuring performance of: ${actionName}`, async () => {
          const startTime = Date.now();
          await action();
          const endTime = Date.now();
          const duration = endTime - startTime;
          
          allure.parameter(`${actionName} duration (ms)`, duration.toString());
          return duration;
        });
        
        return 0; // This will be replaced by the actual measurement from inside the step
      },
      
      // Capture navigation timing metrics
      captureNavigationTiming: async (page: Page): Promise<Record<string, number>> => {
        const timingJson = await page.evaluate(() => {
          const timing = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          return JSON.stringify({
            dns: timing.domainLookupEnd - timing.domainLookupStart,
            connection: timing.connectEnd - timing.connectStart,
            ttfb: timing.responseStart - timing.requestStart,
            download: timing.responseEnd - timing.responseStart,
            domInteractive: timing.domInteractive - timing.startTime,
            domComplete: timing.domComplete - timing.startTime,
            load: timing.loadEventEnd - timing.startTime
          });
        });
        
        const timing = JSON.parse(timingJson);
        
        // Log all metrics to the report
        for (const [key, value] of Object.entries(timing)) {
          allure.parameter(`Navigation Timing - ${key} (ms)`, value!.toString());
        }
        
        return timing;
      }
    };
    
    await use(metrics);
  }
});

export { expect };