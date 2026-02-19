import { test, expect } from '@playwright/test';

test.describe('Careers Page & Admin Management', () => {
    test('should display the Careers page and at least one vacancy', async ({ page }) => {
        // Go to Careers page
        await page.goto('/careers');

        // Wait for loading to finish
        await expect(page.locator('h1')).toContainText('Careers at NRDC');

        // Check if the seeded vacancy (BDM) is present
        // Since it might take a moment to fetch from API
        await expect(page.locator('text=Volunteer Business Development Manager')).toBeVisible({ timeout: 10000 });

        // Check if details can be toggled
        await page.click('text=Volunteer Business Development Manager');
        await expect(page.locator('text=Key Responsibilities')).toBeVisible();
    });

    test('should link to Careers from Get Involved page', async ({ page }) => {
        await page.goto('/get-involved');
        await expect(page.locator('text=View Vacancies')).toBeVisible();
        await page.click('text=View Vacancies');
        await expect(page).toHaveURL(/\/careers/);
    });

    test.describe('Admin Careers Management', () => {
        test.beforeEach(async ({ page }) => {
            // Login
            await page.goto('/admin/login');
            await page.fill('input[type="email"]', process.env.ADMIN_EMAIL || 'admin@nrdc.org');
            await page.fill('input[type="password"]', process.env.ADMIN_PASSWORD || 'admin123');
            await page.click('button[type="submit"]');
            await expect(page).toHaveURL('/admin/dashboard');
            await page.goto('/admin/careers');
        });

        test('should list vacancies in admin dashboard', async ({ page }) => {
            await expect(page.locator('h1')).toContainText('Careers Management');
            await expect(page.locator('text=Volunteer Business Development Manager')).toBeVisible();
        });

        test('should allow opening the add position form', async ({ page }) => {
            await page.click('text=Add New Position');
            await expect(page.locator('text=New Position')).toBeVisible();
            await expect(page.locator('input[placeholder="e.g. Business Development Manager"]')).toBeVisible();
        });
    });
});
