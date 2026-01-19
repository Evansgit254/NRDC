import { test, expect } from '@playwright/test';

test.describe('Admin Programs Management', () => {
    test.beforeEach(async ({ page }) => {
        // Login before each test
        await page.goto('/admin/login');
        await page.fill('input[type="email"]', process.env.ADMIN_EMAIL || 'admin@nrdc.org');
        await page.fill('input[type="password"]', process.env.ADMIN_PASSWORD || 'admin123');
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL('/admin/dashboard');
        await page.goto('/admin/programs');
    });

    test('should display programs list', async ({ page }) => {
        await expect(page.locator('h1')).toContainText('Programs');
        // Check if table exists
        await expect(page.locator('table')).toBeVisible();
    });

    test('should allow editing a program and reflect changes', async ({ page }) => {
        // Find Edit button for the first program
        const firstProgramEditBtn = page.locator('table tbody tr').first().locator('button').first();
        await firstProgramEditBtn.click();

        // Check if form is visible
        await expect(page.getByRole('heading', { name: 'Edit Program' })).toBeVisible();

        // Append a timestamp to description to ensure change
        const timestamp = Date.now().toString();
        const descriptionField = page.locator('textarea').first();
        await descriptionField.fill(`Updated description test ${timestamp}`);

        // Click Update
        await page.click('button:has-text("Update Program")');

        // Check for success toast
        await expect(page.locator('text=Program updated successfully!')).toBeVisible();
    });

    test('should handle objectives list parsing correctly', async ({ page }) => {
        const firstProgramEditBtn = page.locator('table tbody tr').first().locator('button').first();
        await firstProgramEditBtn.click();

        const objectivesField = page.locator('textarea').nth(1);
        const objectives = await objectivesField.inputValue();

        // It should NOT contain JSON brackets if our fix worked
        expect(objectives).not.toContain('[');
        expect(objectives).not.toContain(']');
        expect(objectives).not.toContain('"');
    });
});
