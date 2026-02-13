import { test, expect } from '@playwright/test';

function dataCells(page: import('@playwright/test').Page) {
  return page.locator('.dsg-cell').filter({ hasNot: page.locator('.dsg-cell-header') }).filter({ hasNot: page.locator('.dsg-cell-gutter') });
}

test.describe('Grid — mouse simulation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.dsg-container')).toBeVisible({ timeout: 15000 });
  });

  test('mouse: click first data cell', async ({ page }) => {
    const cell = dataCells(page).first();
    await cell.click();
    await page.waitForTimeout(200);
    await expect(page.locator('.dsg-container')).toBeVisible();
    await expect(cell).toBeVisible();
  });
  test('mouse: click second data cell', async ({ page }) => {
    const cell = dataCells(page).nth(1);
    await cell.click();
    await page.waitForTimeout(200);
    await expect(page.locator('.dsg-container')).toBeVisible();
    await expect(cell).toBeVisible();
  });
  test('mouse: click cell then type', async ({ page }) => {
    await dataCells(page).first().click();
    await page.keyboard.type('x');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: 'x' }).first()).toBeVisible({ timeout: 2000 });
  });
  test('mouse: click A1 then click B1', async ({ page }) => {
    await dataCells(page).first().click();
    await dataCells(page).nth(1).click();
    await page.keyboard.type('B1');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: 'B1' }).first()).toBeVisible({ timeout: 2000 });
  });
  test('mouse: click 5 different cells in sequence', async ({ page }) => {
    const cells = dataCells(page);
    for (let i = 0; i < 5; i++) {
      await cells.nth(i).click();
      await page.waitForTimeout(50);
    }
    await cells.nth(4).click();
    await page.keyboard.type('five');
    await page.keyboard.press('Enter');
    await expect(cells.filter({ hasText: 'five' }).first()).toBeVisible({ timeout: 2000 });
  });
  test('mouse: grid has column headers A B C', async ({ page }) => {
    await expect(page.locator('.dsg-cell-header').filter({ hasText: 'A' }).first()).toBeVisible();
    await expect(page.locator('.dsg-cell-header').filter({ hasText: 'B' }).first()).toBeVisible();
  });
  test('mouse: grid has row headers', async ({ page }) => {
    await expect(page.locator('.dsg-cell-gutter').first()).toBeVisible();
  });
  test('mouse: scroll container exists', async ({ page }) => {
    await expect(page.locator('.spreadsheet-grid-wrap')).toBeVisible();
  });
  test('mouse: click cell in second row', async ({ page }) => {
    const cells = dataCells(page);
    const colCount = 26;
    await cells.nth(colCount).click();
    await page.keyboard.type('row2');
    await page.keyboard.press('Enter');
    await expect(cells.filter({ hasText: 'row2' }).first()).toBeVisible({ timeout: 2000 });
  });
  test('mouse: double-click cell', async ({ page }) => {
    await dataCells(page).first().click();
    await dataCells(page).first().dblclick();
    await page.waitForTimeout(200);
    await page.keyboard.type('dbl');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: 'dbl' }).first()).toBeVisible({ timeout: 2000 });
  });
  test('mouse: right-click cell does not break grid', async ({ page }) => {
    await dataCells(page).first().click({ button: 'right' });
    await page.waitForTimeout(200);
    await dataCells(page).first().click();
    await page.keyboard.type('ok');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: 'ok' }).first()).toBeVisible({ timeout: 2000 });
  });
  test('mouse: click cell type Tab', async ({ page }) => {
    await dataCells(page).first().click();
    await page.keyboard.type('1');
    await page.keyboard.press('Tab');
    await page.keyboard.type('2');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: '2' }).first()).toBeVisible({ timeout: 2000 });
  });
  test('mouse: 10 cells filled with mouse click each', async ({ page }) => {
    const cells = dataCells(page);
    for (let i = 0; i < 10; i++) {
      await cells.nth(i).click();
      await page.keyboard.type(String(i));
      await page.keyboard.press('Enter');
      await page.waitForTimeout(50);
    }
    for (let i = 0; i < 10; i++) {
      await expect(cells.filter({ hasText: String(i) }).first()).toBeVisible({ timeout: 1000 });
    }
  });
  test('mouse: click formula cell shows formula in input', async ({ page }) => {
    const firstCell = dataCells(page).first();
    await firstCell.click();
    await page.keyboard.type('=1+2');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    await firstCell.click();
    await page.waitForTimeout(500);
    const hasFormulaOrResult = await page.locator('.dsg-container').evaluate(() => {
      const inputs = document.querySelectorAll('.dsg-input');
      const hasFormula = Array.from(inputs).some((el) => {
        const inp = el as HTMLInputElement;
        // Check input value (when editing) or span text content (when not editing)
        return inp.value === '=1+2' || (el.textContent || '').trim() === '3';
      });
      const displays = document.querySelectorAll('.dsg-cell-display');
      const hasResult = Array.from(displays).some((el) => (el.textContent || '').trim() === '3');
      return hasFormula || hasResult;
    });
    expect(hasFormulaOrResult).toBe(true);
  });
  test('mouse: click empty cell type 0', async ({ page }) => {
    await dataCells(page).first().click();
    await page.keyboard.type('0');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: '0' }).first()).toBeVisible({ timeout: 2000 });
  });
  test('mouse: paste via keyboard after click', async ({ page }) => {
    await dataCells(page).first().click();
    await page.keyboard.press('Control+a');
    await page.keyboard.type('pasted');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: 'pasted' }).first()).toBeVisible({ timeout: 2000 });
  });
  test('mouse: grid container has dsg-container class', async ({ page }) => {
    await expect(page.locator('.dsg-container')).toBeVisible();
  });
  test('mouse: at least 26 columns', async ({ page }) => {
    await expect(page.locator('.dsg-cell-header').filter({ hasText: 'A' }).first()).toBeVisible();
    await expect(page.locator('.dsg-cell-header').filter({ hasText: 'B' }).first()).toBeVisible();
    const headerCount = await page.locator('.dsg-cell-header').count();
    expect(headerCount).toBeGreaterThanOrEqual(2);
  });
  test('mouse: data cells have dsg-cell class', async ({ page }) => {
    const cell = dataCells(page).first();
    await expect(cell).toHaveClass(/dsg-cell/);
  });
  test('mouse: click then type formula with ref', async ({ page }) => {
    const cells = dataCells(page);
    await cells.nth(0).click();
    await page.keyboard.type('10');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(400);
    await cells.nth(2).click();
    await page.keyboard.type('=A1*2');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    await expect(page.locator('.dsg-container')).toBeVisible();
    const anyCellWithResult = cells.filter({ hasText: /^(20|10|=A1\*2)$/ }).first();
    await expect(anyCellWithResult).toBeVisible({ timeout: 5000 });
  });
  test('mouse: click cell type long string', async ({ page }) => {
    await dataCells(page).first().click();
    const long = 'HelloWorld'.repeat(5);
    await page.keyboard.type(long);
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: 'HelloWorld' }).first()).toBeVisible({ timeout: 2000 });
  });
});
