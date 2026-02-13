import { test, expect } from '@playwright/test';

test.describe('Ribbon — mouse simulation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.ribbon')).toBeVisible({ timeout: 15000 });
  });

  // Mouse-click ribbon buttons by aria-label (title); skip Save (can be disabled when no project)
  const buttonsToClick = [
    'Open', 'Paste', 'Cut', 'Copy', 'Bold', 'Italic', 'Underline', 'Strikethrough',
    'Font size', 'Font color', 'General', 'Date', 'Insert row', 'Insert column',
    'Clear', 'Filter', 'Sort', 'Validation',
  ];
  for (let i = 0; i < buttonsToClick.length; i++) {
    const name = buttonsToClick[i];
    test(`mouse: click ribbon button ${name}`, async ({ page }) => {
      const ribbon = page.locator('.ribbon');
      const btn = ribbon.getByRole('button', { name: new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') }).first();
      await btn.click({ timeout: 8000 });
      await expect(ribbon).toBeVisible();
    });
  }

  test('mouse: ribbon has Home tab', async ({ page }) => {
    await expect(page.locator('.ribbon-tab').filter({ hasText: /Home/i })).toBeVisible();
  });
  test('mouse: ribbon has File group label', async ({ page }) => {
    await expect(page.locator('.ribbon-group-label').filter({ hasText: /File/i })).toBeVisible();
  });
  test('mouse: ribbon has Clipboard group', async ({ page }) => {
    await expect(page.locator('.ribbon-group-label').filter({ hasText: /Clipboard/i })).toBeVisible();
  });
  test('mouse: ribbon has Font group', async ({ page }) => {
    await expect(page.locator('.ribbon-group-label').filter({ hasText: /Font/i })).toBeVisible();
  });
  test('mouse: ribbon has Alignment group', async ({ page }) => {
    await expect(page.locator('.ribbon-group-label').filter({ hasText: /Alignment/i })).toBeVisible();
  });
  test('mouse: ribbon has Number group', async ({ page }) => {
    await expect(page.locator('.ribbon-group-label').filter({ hasText: /Number/i })).toBeVisible();
  });
  test('mouse: ribbon has Cells group', async ({ page }) => {
    await expect(page.locator('.ribbon-group-label').filter({ hasText: /Cells/i })).toBeVisible();
  });
  test('mouse: ribbon has Editing group', async ({ page }) => {
    await expect(page.locator('.ribbon-group-label').filter({ hasText: /Editing/i })).toBeVisible();
  });
  test('mouse: ribbon has Data group', async ({ page }) => {
    await expect(page.locator('.ribbon-group-label').filter({ hasText: /Data/i })).toBeVisible();
  });
  test('mouse: ribbon has View group', async ({ page }) => {
    await expect(page.locator('.ribbon-group-label').filter({ hasText: /View/i })).toBeVisible();
  });
  test('mouse: Open button is in ribbon', async ({ page }) => {
    const ribbon = page.locator('.ribbon');
    await expect(ribbon.getByRole('button', { name: /Open/i }).first()).toBeVisible();
  });
  test('mouse: Save button is in ribbon', async ({ page }) => {
    await expect(page.locator('.ribbon').getByRole('button', { name: /Save/i }).first()).toBeVisible();
  });
  test('mouse: click Open then cancel file picker', async ({ page }) => {
    await page.locator('.ribbon').getByRole('button', { name: /Open/i }).first().click({ timeout: 5000 });
    await page.waitForTimeout(300);
    await expect(page.locator('.ribbon')).toBeVisible();
  });
  test('mouse: ribbon buttons count >= 40', async ({ page }) => {
    const count = await page.locator('.ribbon-btn').count();
    expect(count).toBeGreaterThanOrEqual(40);
  });
  test('mouse: ribbon content area visible', async ({ page }) => {
    await expect(page.locator('.ribbon-content')).toBeVisible();
  });
  test('mouse: ribbon groups visible', async ({ page }) => {
    const groups = page.locator('.ribbon-group');
    await expect(groups.first()).toBeVisible();
    const count = await groups.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });
  test('mouse: click Copy then Paste', async ({ page }) => {
    const ribbon = page.locator('.ribbon');
    await ribbon.getByRole('button', { name: /Copy/i }).first().click({ timeout: 5000 });
    await ribbon.getByRole('button', { name: /Paste/i }).first().click({ timeout: 5000 });
    await expect(ribbon).toBeVisible();
  });
  test('mouse: click B I U S in sequence', async ({ page }) => {
    const ribbon = page.locator('.ribbon');
    await ribbon.getByRole('button', { name: /Bold/i }).first().click({ timeout: 5000 });
    await ribbon.getByRole('button', { name: /Italic/i }).first().click({ timeout: 5000 });
    await ribbon.getByRole('button', { name: /Underline/i }).first().click({ timeout: 5000 });
    await ribbon.getByRole('button', { name: /Strikethrough/i }).first().click({ timeout: 5000 });
    await expect(ribbon).toBeVisible();
  });
  test('mouse: click Insert row button', async ({ page }) => {
    await page.locator('.ribbon').getByRole('button', { name: /Insert row|\+Row/i }).first().click({ timeout: 5000 });
    await expect(page.locator('.ribbon')).toBeVisible();
  });
  test('mouse: click Zoom in', async ({ page }) => {
    await page.locator('.ribbon').getByRole('button', { name: /Zoom in|\+/ }).first().click({ timeout: 5000 });
    await expect(page.locator('.ribbon')).toBeVisible();
  });
});
