import { test, expect } from '@playwright/test';

test.describe('Donation Page Translations', () => {
    test('should display correctly in English', async ({ page }) => {
        await page.goto('/en/donate');

        // Hero Section
        await expect(page.locator('h1')).toContainText('Make a Difference Today');
        await expect(page.locator('p').nth(0)).toContainText('Your donation helps provide nutrition');

        // Choose Your Impact Section
        await expect(page.locator('h2').filter({ hasText: 'Choose Your Impact' })).toBeVisible();

        // Payment Method Selector
        await expect(page.locator('h3').filter({ hasText: 'Choose Payment Method' })).toBeVisible();
        await expect(page.locator('button').filter({ hasText: 'Card / DPO' })).toBeVisible();
        await expect(page.locator('button').filter({ hasText: 'Bank Transfer' })).toBeVisible();
    });

    test('should display correctly in Swahili', async ({ page }) => {
        await page.goto('/sw/donate');

        // Hero Section
        await expect(page.locator('h1')).toContainText('Fanya Mabadiliko Leo');

        // Choose Your Impact Section
        await expect(page.locator('h2').filter({ hasText: 'Chagua Athari Yako' })).toBeVisible();

        // Payment Method Selector
        await expect(page.locator('button').filter({ hasText: 'Kadi / DPO' })).toBeVisible();
        await expect(page.locator('button').filter({ hasText: 'Hamisho la Benki' })).toBeVisible();
    });

    test('should display correctly in French', async ({ page }) => {
        await page.goto('/fr/donate');

        // Hero Section
        await expect(page.locator('h1')).toContainText("Faites une différence aujourd'hui");

        // Choose Your Impact Section
        await expect(page.locator('h2').filter({ hasText: 'Choisissez Votre Impact' })).toBeVisible();

        // Payment Method Selector
        await expect(page.locator('button').filter({ hasText: 'Carte / DPO' })).toBeVisible();
        await expect(page.locator('button').filter({ hasText: 'Virement Bancaire' })).toBeVisible();
    });

    test('should display correctly in Spanish', async ({ page }) => {
        await page.goto('/es/donate');

        // Hero Section
        await expect(page.locator('h1')).toContainText('Marque la Diferencia Hoy');

        // Choose Your Impact Section
        await expect(page.locator('h2').filter({ hasText: 'Elija Su Impacto' })).toBeVisible();

        // Payment Method Selector
        await expect(page.locator('button').filter({ hasText: 'Tarjeta / DPO' })).toBeVisible();
        await expect(page.locator('button').filter({ hasText: 'Transferencia Bancaria' })).toBeVisible();
    });
});
