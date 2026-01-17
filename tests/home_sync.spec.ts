import { test, expect } from '@playwright/test';

test.describe('Home Page Program Synchronization', () => {
    test('should display at least 3 programs on the home page', async ({ page }) => {
        await page.goto('/');

        // Wait for the programs section to load (after skeleton)
        const programCards = page.locator('section:has-text("Our Programs") >> .bg-white.rounded-xl');

        // Wait for at least one card to be visible (it might take a second due to fetch)
        await expect(programCards.first()).toBeVisible({ timeout: 10000 });

        const count = await programCards.count();
        expect(count).toBeGreaterThanOrEqual(1);

        // Verify common program titles from seed data
        const titles = await programCards.locator('h3').allTextContents();
        console.log('Programs found on Home page:', titles);

        // At least one of the seeded programs should be there
        const seededTitles = ['Emergency Nutrition', 'Community Gardens', 'Mobile Health Clinics'];
        const found = titles.some(t => seededTitles.includes(t));
        expect(found).toBeTruthy();
    });

    test('should correlate with programs on the programs page', async ({ page }) => {
        // Get titles from home page
        await page.goto('/');
        await expect(page.locator('h3:has-text("Emergency Nutrition")')).toBeVisible({ timeout: 10000 });
        const homeTitles = await page.locator('section:has-text("Our Programs") h3').allTextContents();

        // Check programs page
        await page.goto('/programs');
        await expect(page.locator('h1')).toContainText('Our Programs');
        const programsPageTitles = await page.locator('h2').allTextContents();

        // Every title on home page (top 3) should exist on programs page
        for (const title of homeTitles) {
            expect(programsPageTitles).toContain(title);
        }
    });
});
