import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load with correct title and branding', async ({ page }) => {
    await page.goto('/');
    
    // Check Title
    await expect(page).toHaveTitle(/DevX/);
    
    // Check Branding in Navbar
    const brand = page.locator('nav').getByText('DevX');
    await expect(brand).toBeVisible();
    
    // Check Hero Tagline
    const heroTitle = page.locator('h1');
    await expect(heroTitle).toContainText('Compare smarter.');
    await expect(heroTitle).toContainText('Choose faster.');
  });

  test('should navigate to Devices page via Explore button', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Explore Devices' }).click();
    await expect(page).toHaveURL(/.*devices/);
    await expect(page.locator('h1')).toBeVisible();
  });
});
