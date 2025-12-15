import { test, expect } from '@playwright/test';

test.describe('Admin Authentication', () => {
    test('should allow admin to login with correct credentials', async ({ page }) => {
        await page.goto('/admin/login');

        await page.fill('input[type="email"]', 'admin@nrdc.org');
        await page.fill('input[type="password"]', 'admin123');
        await page.click('button[type="submit"]');

        // Should redirect to dashboard
        await expect(page).toHaveURL('/admin/dashboard');
        await expect(page.locator('h1')).toContainText('Dashboard');
    });

    test('should show error with incorrect credentials', async ({ page }) => {
        await page.goto('/admin/login');

        await page.fill('input[type="email"]', 'admin@nrdc.org');
        await page.fill('input[type="password"]', 'wrongpassword');
        await page.click('button[type="submit"]');

        // Should show error message (toast or alert)
        // Since we implemented toasts, we check for that
        await expect(page.locator('.text-red-700')).toBeVisible();
        // Or check if URL is still login
        await expect(page).toHaveURL('/admin/login');
    });

    test('should redirect to login when accessing protected route', async ({ page }) => {
        await page.goto('/admin/dashboard');
        // Should be redirected to login
        await expect(page).toHaveURL('/admin/login');
    });
});
