import { test, expect } from '@playwright/test';

test('should display partner section', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for section title
    await expect(page.getByRole('heading', { name: 'Our PartnersAnd Collaborators' })).toBeVisible({ timeout: 10000 }).catch(async () => {
        console.log('Heading not found. Constructing page dump...');
        const content = await page.content();
        console.log(content.substring(0, 2000)); // Log first 2000 chars
        throw new Error('Heading not found');
    });

    // Check for loading or empty state
    if (await page.getByTestId('partner-loading').isVisible()) {
        console.log('Partner section is loading...');
        await page.waitForSelector('[data-testid="partner-loading"]', { state: 'hidden', timeout: 10000 });
    }

    if (await page.getByTestId('partner-empty').isVisible()) {
        throw new Error('Partner API returned empty or failed.');
    }

    // Check for specific partner names (as alt text on images)
    await expect(page.getByRole('img', { name: 'Nutrition Association Of Kenya' })).toBeVisible();
    await expect(page.getByRole('img', { name: 'DPO Group' })).toBeVisible();
    await expect(page.getByRole('img', { name: 'UNHCR' })).toBeVisible();
});
