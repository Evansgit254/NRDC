import { test, expect } from '@playwright/test';

test.describe('Public Pages', () => {
    test('homepage should load correctly', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/NRDC/);
        await expect(page.locator('h1')).toBeVisible();
    });

    test('about page should load', async ({ page }) => {
        await page.goto('/about');
        await expect(page.locator('h1')).toContainText('About NRDC');
    });

    test('programs page should load', async ({ page }) => {
        await page.goto('/programs');
        await expect(page.locator('h1')).toContainText('Our Programs');
        // Check if programs are listed
        await expect(page.locator('.grid > div')).not.toHaveCount(0);
    });

    test('contact page should load', async ({ page }) => {
        await page.goto('/contact');
        await expect(page.locator('h1')).toContainText('Contact Us');
        await expect(page.locator('form')).toBeVisible();
    });
});
