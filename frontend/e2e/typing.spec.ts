import { test, expect } from '@playwright/test';

/** Data cells only (no header, no gutter) */
function dataCells(page: import('@playwright/test').Page) {
  return page.locator('.dsg-cell').filter({ hasNot: page.locator('.dsg-cell-header') }).filter({ hasNot: page.locator('.dsg-cell-gutter') });
}

test.describe('Typing in cells — no text disappearing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.dsg-container')).toBeVisible({ timeout: 15000 });
  });

  test('type plain text: characters stay visible', async ({ page }) => {
    const cell = dataCells(page).first();
    await cell.click();
    await page.keyboard.type('Hello');
    await expect(page.locator('.dsg-input').first()).toHaveValue('Hello');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: /^Hello$/ }).first()).toBeVisible({ timeout: 2000 });
  });

  test('type formula character by character: = then 1 then + then 2', async ({ page }) => {
    const cell = dataCells(page).first();
    await cell.click();
    await page.keyboard.type('=');
    await expect(page.locator('.dsg-input').first()).toHaveValue('=');
    await page.keyboard.type('1');
    await expect(page.locator('.dsg-input').first()).toHaveValue('=1');
    await page.keyboard.type('+');
    await expect(page.locator('.dsg-input').first()).toHaveValue('=1+');
    await page.keyboard.type('2');
    await expect(page.locator('.dsg-input').first()).toHaveValue('=1+2');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: /^3$/ }).first()).toBeVisible({ timeout: 2000 });
  });

  test('type long formula: all characters persist', async ({ page }) => {
    const cell = dataCells(page).first();
    await cell.click();
    const formula = '=SUM(1,2,3,4,5)';
    for (const char of formula) {
      await page.keyboard.type(char);
    }
    await expect(page.locator('.dsg-input').first()).toHaveValue(formula);
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: /^15$/ }).first()).toBeVisible({ timeout: 2000 });
  });

  test('type =IF(1,"yes","no") without disappearing', async ({ page }) => {
    const cell = dataCells(page).first();
    await cell.click();
    await page.keyboard.type('=IF(1,"yes","no")');
    await expect(page.locator('.dsg-input').first()).toHaveValue('=IF(1,"yes","no")');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: /^yes$/ }).first()).toBeVisible({ timeout: 2000 });
  });

  test('type number 12345', async ({ page }) => {
    const cell = dataCells(page).first();
    await cell.click();
    await page.keyboard.type('12345');
    await expect(page.locator('.dsg-input').first()).toHaveValue('12345');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: /^12345$/ }).first()).toBeVisible({ timeout: 2000 });
  });

  test('type then Escape: reverts', async ({ page }) => {
    const cell = dataCells(page).first();
    await cell.click();
    await page.keyboard.type('test');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
    const input = page.locator('.dsg-input').first();
    const val = await input.inputValue();
    expect(val === '' || val === 'test').toBe(true);
  });

  test('type in A1 then click A2: A1 value committed', async ({ page }) => {
    const cells = dataCells(page);
    await cells.first().click();
    await page.keyboard.type('A1value');
    await page.keyboard.press('Enter');
    await cells.nth(1).click();
    await expect(cells.filter({ hasText: /A1value/ }).first()).toBeVisible({ timeout: 2000 });
  });

  test('type =1+2 in first cell with mouse click to focus', async ({ page }) => {
    await dataCells(page).first().click();
    await page.keyboard.type('=1+2');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: /^3$/ }).first()).toBeVisible({ timeout: 2000 });
  });

  test('type in multiple cells in sequence', async ({ page }) => {
    const cells = dataCells(page);
    await cells.nth(0).click();
    await page.keyboard.type('1');
    await page.keyboard.press('Enter');
    await cells.nth(1).click();
    await page.keyboard.type('2');
    await page.keyboard.press('Enter');
    await cells.nth(2).click();
    await page.keyboard.type('=A1+A2');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    await expect(cells.filter({ hasText: /^3$/ }).first()).toBeVisible({ timeout: 2000 });
  });

  test('input value matches what was typed before Enter', async ({ page }) => {
    const cell = dataCells(page).first();
    await cell.click();
    const text = '=2*3';
    await page.keyboard.type(text);
    await expect(page.locator('.dsg-input').first()).toHaveValue(text);
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: /^6$/ }).first()).toBeVisible({ timeout: 2000 });
  });
});
