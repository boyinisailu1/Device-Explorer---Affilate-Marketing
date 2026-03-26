import { test, expect } from '@playwright/test';

test.describe('Compare Page', () => {
  test('should load comparison slots and toggle 3rd device', async ({ page }) => {
    await page.goto('/compare');
    
    // Check if 2 slots are initially visible (labels for Device 1 and Device 2)
    await expect(page.getByText('Device 1')).toBeVisible();
    await expect(page.getByText('Device 2')).toBeVisible();
    
    // Check if Device 3 slot is HIDDEN initially (label shouldn't be visible)
    await expect(page.getByText('Device 3')).not.toBeVisible();
    
    // Click the "+" button to add 3rd device
    const addButton = page.locator('button').filter({ hasText: '+' });
    await addButton.click();
    
    // Check if Device 3 slot is now visible
    await expect(page.getByText('Device 3')).toBeVisible();
    
    // Click the "-" button to remove it
    const removeButton = page.locator('button').filter({ hasText: '-' });
    await removeButton.click();
    
    // Check if it's hidden again
    await expect(page.getByText('Device 3')).not.toBeVisible();
  });
});
