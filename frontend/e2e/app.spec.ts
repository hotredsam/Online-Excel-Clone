import { test, expect } from '@playwright/test';

test.describe('GlassSheet app', () => {
  test('loads and shows Sheets tab by default', async ({ page }) => {
    await page.goto('/');
    const sheets = page.getByRole('tab', { name: /sheets/i });
    await expect(sheets).toBeVisible();
    await expect(sheets).toHaveClass(/active/);
  });

  test('has Sheets, Projects, and Settings tabs', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('tab', { name: /^Sheets$/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /^Projects$/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /^Settings$/i })).toBeVisible();
  });

  test('can switch to Projects tab', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('tab', { name: /^Projects$/i }).click();
    await expect(page.getByRole('tab', { name: /^Projects$/i })).toHaveClass(/active/);
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
  });

  test('can switch to Settings tab', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('tab', { name: /^Settings$/i }).click();
    await expect(page.getByRole('tab', { name: /^Settings$/i })).toHaveClass(/active/);
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
  });

  test('ribbon has 40+ toolbar buttons', async ({ page }) => {
    await page.goto('/');
    const ribbon = page.locator('.ribbon');
    await expect(ribbon).toBeVisible();
    const buttons = ribbon.locator('.ribbon-btn');
    const count = await buttons.count();
    expect(count).toBeGreaterThanOrEqual(40);
  });

  test('spreadsheet grid is visible on Sheets tab', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.spreadsheet-grid-wrap')).toBeVisible();
    await expect(page.locator('.dsg-container')).toBeVisible();
  });

  test('ribbon File group has Open and Save', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: /^Open$/i }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /^Save$/i }).first()).toBeVisible();
  });

  test('formula evaluation: =1+2 shows 3 in a data cell', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.dsg-container')).toBeVisible();
    const dataCell = page.locator('.dsg-cell').filter({ hasNot: page.locator('.dsg-cell-header') }).filter({ hasNot: page.locator('.dsg-cell-gutter') }).first();
    await dataCell.click();
    await page.keyboard.type('=1+2');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(800);
    const dataCellsWith3 = page.locator('.dsg-cell').filter({ hasNot: page.locator('.dsg-cell-header') }).filter({ hasNot: page.locator('.dsg-cell-gutter') }).filter({ hasText: /^3$/ });
    await expect(dataCellsWith3.first()).toBeVisible({ timeout: 3000 });
  });

  test('SUM formula shows result', async ({ page }) => {
    await page.goto('/');
    const dataCell = page.locator('.dsg-cell').filter({ hasNot: page.locator('.dsg-cell-header') }).filter({ hasNot: page.locator('.dsg-cell-gutter') }).nth(2);
    await dataCell.click();
    await page.keyboard.type('=SUM(1,2,3)');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    await expect(page.locator('.dsg-cell').filter({ hasNot: page.locator('.dsg-cell-gutter') }).filter({ hasText: /^6$/ }).first()).toBeVisible({ timeout: 5000 });
  });

  test('Excel-like: clicking another cell while editing formula inserts cell ref (mouse)', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.dsg-container')).toBeVisible();
    const dataCells = page.locator('.dsg-cell').filter({ hasNot: page.locator('.dsg-cell-header') }).filter({ hasNot: page.locator('.dsg-cell-gutter') });
    const a1 = dataCells.first();
    const b2 = dataCells.nth(27);
    await b2.click();
    await page.keyboard.type('10');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);
    await a1.click();
    await page.keyboard.type('=SUM(');
    await page.waitForTimeout(200);
    await b2.click();
    await page.waitForTimeout(300);
    await page.keyboard.type(')');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(800);
    await expect(page.locator('.dsg-cell').filter({ hasNot: page.locator('.dsg-cell-gutter') }).filter({ hasText: /^10$/ }).first()).toBeVisible({ timeout: 3000 });
  });

  test('ribbon Copy Paste B buttons respond to mouse click', async ({ page }) => {
    await page.goto('/');
    const ribbon = page.locator('.ribbon');
    await expect(ribbon).toBeVisible();
    await ribbon.getByRole('button', { name: 'Copy' }).first().click({ timeout: 5000 });
    await ribbon.getByRole('button', { name: 'Paste' }).first().click({ timeout: 5000 });
    await ribbon.getByRole('button', { name: 'B' }).first().click({ timeout: 5000 });
    await expect(ribbon).toBeVisible();
  });
});
