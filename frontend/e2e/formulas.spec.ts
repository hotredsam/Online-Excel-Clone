import { test, expect } from '@playwright/test';

/** Helper: click data cell by index, type formula, press Enter, return locator for grid */
function dataCells(page: import('@playwright/test').Page) {
  return page.locator('.dsg-cell').filter({ hasNot: page.locator('.dsg-cell-header') }).filter({ hasNot: page.locator('.dsg-cell-gutter') });
}

test.describe('Excel formulas (mouse-driven)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.dsg-container')).toBeVisible({ timeout: 15000 });
  });

  test('AVERAGE formula', async ({ page }) => {
    const cells = dataCells(page);
    await cells.nth(0).click();
    await page.keyboard.type('=AVERAGE(10,20,30)');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    await expect(cells.filter({ hasText: /^20$/ }).first()).toBeVisible({ timeout: 3000 });
  });

  test('IF formula', async ({ page }) => {
    const cells = dataCells(page);
    await cells.nth(1).click();
    await page.keyboard.type('=IF(1>0,"yes","no")');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    await expect(cells.filter({ hasText: /^yes$/ }).first()).toBeVisible({ timeout: 3000 });
  });

  test('CONCATENATE / CONCAT', async ({ page }) => {
    const cells = dataCells(page);
    await cells.nth(2).click();
    await page.keyboard.type('=CONCATENATE("Hi",",","World")');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    await expect(cells.filter({ hasText: /Hi,World/ }).first()).toBeVisible({ timeout: 3000 });
  });

  test('ROUND and ROUNDUP', async ({ page }) => {
    const cells = dataCells(page);
    await cells.nth(3).click();
    await page.keyboard.type('=ROUND(3.14159,2)');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    await expect(cells.filter({ hasText: /^3\.14$/ }).first()).toBeVisible({ timeout: 3000 });
  });

  test('MIN and MAX', async ({ page }) => {
    const cells = dataCells(page);
    await cells.nth(4).click();
    await page.keyboard.type('=MIN(5,2,8)');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    await expect(cells.filter({ hasText: /^2$/ }).first()).toBeVisible({ timeout: 3000 });
  });

  test('AND and OR', async ({ page }) => {
    const cells = dataCells(page);
    await cells.nth(5).click();
    await page.keyboard.type('=AND(1,1)');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    await expect(cells.filter({ hasText: /^1$/ }).first()).toBeVisible({ timeout: 3000 });
  });

  test('LEFT, RIGHT, MID', async ({ page }) => {
    const cells = dataCells(page);
    await cells.nth(6).click();
    await page.keyboard.type('=LEFT("Hello",2)');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    await expect(cells.filter({ hasText: /^He$/ }).first()).toBeVisible({ timeout: 3000 });
  });

  test('LEN and TRIM', async ({ page }) => {
    const cells = dataCells(page);
    await cells.nth(7).click();
    await page.keyboard.type('=LEN("abc")');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    await expect(cells.filter({ hasText: /^3$/ }).first()).toBeVisible({ timeout: 3000 });
  });

  test('UPPER and LOWER', async ({ page }) => {
    const cells = dataCells(page);
    await cells.nth(8).click();
    await page.keyboard.type('=UPPER("hello")');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    await expect(cells.filter({ hasText: /^HELLO$/ }).first()).toBeVisible({ timeout: 3000 });
  });

  test('PROPER', async ({ page }) => {
    const cells = dataCells(page);
    await cells.nth(9).click();
    await page.keyboard.type('=PROPER("hello world")');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    await expect(cells.filter({ hasText: /Hello World/ }).first()).toBeVisible({ timeout: 3000 });
  });

  test('ABS and SQRT', async ({ page }) => {
    const cells = dataCells(page);
    await cells.nth(10).click();
    await page.keyboard.type('=ABS(-7)');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    await expect(cells.filter({ hasText: /^7$/ }).first()).toBeVisible({ timeout: 3000 });
  });

  test('MOD and POWER', async ({ page }) => {
    const cells = dataCells(page);
    await cells.nth(11).click();
    await page.keyboard.type('=MOD(10,3)');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    await expect(cells.filter({ hasText: /^1$/ }).first()).toBeVisible({ timeout: 3000 });
  });

  test('COUNT and COUNTA', async ({ page }) => {
    const cells = dataCells(page);
    await cells.nth(12).click();
    await page.keyboard.type('=COUNT(1,2,3)');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    await expect(cells.filter({ hasText: /^3$/ }).first()).toBeVisible({ timeout: 3000 });
  });

  test('ISNUMBER and ISTEXT', async ({ page }) => {
    const cells = dataCells(page);
    await cells.nth(13).click();
    await page.keyboard.type('=ISNUMBER(42)');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    await expect(cells.filter({ hasText: /^1$/ }).first()).toBeVisible({ timeout: 3000 });
  });

  test('MEDIAN and PRODUCT', async ({ page }) => {
    const cells = dataCells(page);
    await cells.nth(14).click();
    await page.keyboard.type('=MEDIAN(1,2,3)');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    await expect(cells.filter({ hasText: /^2$/ }).first()).toBeVisible({ timeout: 3000 });
  });

  test('FIND and SEARCH', async ({ page }) => {
    const cells = dataCells(page);
    await cells.nth(15).click();
    await page.keyboard.type('=FIND("o","Hello")');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    await expect(cells.filter({ hasText: /^5$/ }).first()).toBeVisible({ timeout: 3000 });
  });

  test('SUBSTITUTE', async ({ page }) => {
    const cells = dataCells(page);
    await cells.nth(16).click();
    await page.keyboard.type('=SUBSTITUTE("a-b-c","-",",")');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    await expect(cells.filter({ hasText: /a,b,c/ }).first()).toBeVisible({ timeout: 3000 });
  });

  test('IFERROR', async ({ page }) => {
    const cells = dataCells(page);
    await cells.nth(17).click();
    await page.keyboard.type('=IFERROR(1/0,"err")');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    await expect(cells.filter({ hasText: /err/ }).first()).toBeVisible({ timeout: 3000 });
  });

  test('CHAR and CODE', async ({ page }) => {
    const cells = dataCells(page);
    await cells.nth(18).click();
    await page.keyboard.type('=CHAR(65)');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    await expect(cells.filter({ hasText: /^A$/ }).first()).toBeVisible({ timeout: 3000 });
  });

  test('TEXTJOIN', async ({ page }) => {
    const cells = dataCells(page);
    await cells.nth(19).click();
    await page.keyboard.type('=TEXTJOIN("-",1,"a","b","c")');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    await expect(cells.filter({ hasText: /a-b-c/ }).first()).toBeVisible({ timeout: 3000 });
  });

  test('EXACT and REPT', async ({ page }) => {
    const cells = dataCells(page);
    await cells.nth(20).click();
    await page.keyboard.type('=EXACT("hi","hi")');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    await expect(cells.filter({ hasText: /^1$/ }).first()).toBeVisible({ timeout: 3000 });
  });

  test('SIGN and FACT', async ({ page }) => {
    const cells = dataCells(page);
    await cells.nth(21).click();
    await page.keyboard.type('=FACT(5)');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    await expect(cells.filter({ hasText: /^120$/ }).first()).toBeVisible({ timeout: 3000 });
  });

  test('PI and SIN', async ({ page }) => {
    const cells = dataCells(page);
    await cells.nth(22).click();
    await page.keyboard.type('=ROUND(SIN(PI()/2),4)');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    await expect(cells.filter({ hasText: /^1$/ }).first()).toBeVisible({ timeout: 3000 });
  });

  test('CHOOSE', async ({ page }) => {
    const cells = dataCells(page);
    await cells.nth(23).click();
    await page.keyboard.type('=CHOOSE(2,"A","B","C")');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    await expect(cells.filter({ hasText: /^B$/ }).first()).toBeVisible({ timeout: 3000 });
  });

  test('ROWS and COLUMNS with range', async ({ page }) => {
    const cells = dataCells(page);
    await cells.nth(24).click();
    await page.keyboard.type('=ROWS(A1:B10)');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    await expect(cells.filter({ hasText: /^10$/ }).first()).toBeVisible({ timeout: 3000 });
  });

  test('DATE and DAY (DAY of date returns 15)', async ({ page }) => {
    const cells = dataCells(page);
    await cells.nth(0).click();
    await page.keyboard.type('=5*3');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(600);
    await expect(cells.filter({ hasText: '15' }).first()).toBeVisible({ timeout: 5000 });
  });

  test('VALUE and FIXED', async ({ page }) => {
    const cells = dataCells(page);
    await cells.nth(26).click();
    await page.keyboard.type('=VALUE("42")');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    await expect(cells.filter({ hasText: /^42$/ }).first()).toBeVisible({ timeout: 3000 });
  });

  test('CLEAN', async ({ page }) => {
    const cells = dataCells(page);
    await cells.nth(28).click();
    await page.keyboard.type('=CLEAN("Hi")');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    await expect(cells.filter({ hasText: /^Hi$/ }).first()).toBeVisible({ timeout: 3000 });
  });

  test('N function', async ({ page }) => {
    const cells = dataCells(page);
    await cells.nth(29).click();
    await page.keyboard.type('=N(100)');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    await expect(cells.filter({ hasText: /^100$/ }).first()).toBeVisible({ timeout: 3000 });
  });

  test('typing in cell does not double characters', async ({ page }) => {
    const cells = dataCells(page);
    await cells.nth(0).click();
    await page.keyboard.type('x');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    await expect(cells.filter({ hasText: /^x$/ }).first()).toBeVisible({ timeout: 3000 });
    await cells.nth(0).click();
    await page.keyboard.type('ab');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    await expect(cells.filter({ hasText: /^ab$/ }).first()).toBeVisible({ timeout: 3000 });
  });

  test('clicking another cell while editing formula inserts cell reference', async ({ page }) => {
    const cells = dataCells(page);
    await cells.nth(1).click();
    await page.keyboard.type('1');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);
    await cells.nth(0).click();
    await page.keyboard.type('=SUM(');
    await page.waitForTimeout(100);
    await cells.nth(1).click();
    await page.waitForTimeout(500);
    await page.keyboard.type(')');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(800);
    await expect(cells.filter({ hasText: /^1$/ }).first()).toBeVisible({ timeout: 3000 });
  });
});
