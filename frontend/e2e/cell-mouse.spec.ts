import { test, expect } from '@playwright/test';

/** Data cells only (no header, no gutter) */
function dataCells(page: import('@playwright/test').Page) {
  return page.locator('.dsg-cell').filter({ hasNot: page.locator('.dsg-cell-header') }).filter({ hasNot: page.locator('.dsg-cell-gutter') });
}

test.describe('Cell — mouse click then type (bulk)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.dsg-container')).toBeVisible({ timeout: 15000 });
  });

  // 50 tests: same flow as grid-mouse "click cell then type" — click first cell, type, Enter, assert visible
  for (let i = 0; i < 50; i++) {
    const label = `cell_${i}`;
    test(`mouse: click first cell type ${label}`, async ({ page }) => {
      const cells = dataCells(page);
      await cells.first().click();
      await page.keyboard.type(label);
      await page.keyboard.press('Enter');
      await expect(cells.filter({ hasText: label }).first()).toBeVisible({ timeout: 5000 });
    });
  }
});
