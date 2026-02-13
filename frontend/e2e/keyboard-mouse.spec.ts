import { test, expect } from '@playwright/test';

function dataCells(page: import('@playwright/test').Page) {
  return page.locator('.dsg-cell').filter({ hasNot: page.locator('.dsg-cell-header') }).filter({ hasNot: page.locator('.dsg-cell-gutter') });
}

test.describe('Keyboard + mouse simulation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.dsg-container')).toBeVisible({ timeout: 15000 });
  });

  test('kbd: click A1 then Tab focuses next cell', async ({ page }) => {
    await dataCells(page).first().click();
    await page.keyboard.type('a');
    await page.keyboard.press('Tab');
    await page.keyboard.type('b');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: 'b' }).first()).toBeVisible({ timeout: 2000 });
  });
  test('kbd: click then Enter commits and moves down', async ({ page }) => {
    await dataCells(page).first().click();
    await page.keyboard.type('x');
    await page.keyboard.press('Enter');
    await page.keyboard.type('y');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: 'y' }).first()).toBeVisible({ timeout: 2000 });
  });
  test('kbd: type then Escape leaves cell', async ({ page }) => {
    await dataCells(page).first().click();
    await page.keyboard.type('esc');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(100);
    await expect(page.locator('.dsg-container')).toBeVisible();
  });
  test('kbd: click cell type digits 0-9', async ({ page }) => {
    await dataCells(page).first().click();
    await page.keyboard.type('0123456789');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: /0123456789/ }).first()).toBeVisible({ timeout: 2000 });
  });
  test('kbd: formula =1+2+3+4', async ({ page }) => {
    await dataCells(page).first().click();
    await page.keyboard.type('=1+2+3+4');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: '10' }).first()).toBeVisible({ timeout: 2000 });
  });
  test('kbd: formula =10-3', async ({ page }) => {
    await dataCells(page).first().click();
    await page.keyboard.type('=10-3');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: '7' }).first()).toBeVisible({ timeout: 2000 });
  });
  test('kbd: formula =3*4', async ({ page }) => {
    await dataCells(page).first().click();
    await page.keyboard.type('=3*4');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: '12' }).first()).toBeVisible({ timeout: 2000 });
  });
  test('kbd: formula =20/4', async ({ page }) => {
    await dataCells(page).first().click();
    await page.keyboard.type('=20/4');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: '5' }).first()).toBeVisible({ timeout: 2000 });
  });
  test('kbd: formula =2^10', async ({ page }) => {
    await dataCells(page).first().click();
    await page.keyboard.type('=2^10');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: '1024' }).first()).toBeVisible({ timeout: 2000 });
  });
  test('kbd: formula =SUM(1,2,3)', async ({ page }) => {
    await dataCells(page).first().click();
    await page.keyboard.type('=SUM(1,2,3)');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: '6' }).first()).toBeVisible({ timeout: 2000 });
  });
  test('kbd: formula =AVERAGE(2,4,6)', async ({ page }) => {
    await dataCells(page).first().click();
    await page.keyboard.type('=AVERAGE(2,4,6)');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: '4' }).first()).toBeVisible({ timeout: 2000 });
  });
  test('kbd: formula =MIN(5,1,9)', async ({ page }) => {
    await dataCells(page).first().click();
    await page.keyboard.type('=MIN(5,1,9)');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: '1' }).first()).toBeVisible({ timeout: 2000 });
  });
  test('kbd: formula =MAX(5,1,9)', async ({ page }) => {
    await dataCells(page).first().click();
    await page.keyboard.type('=MAX(5,1,9)');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: '9' }).first()).toBeVisible({ timeout: 2000 });
  });
  test('kbd: formula =LEN("abc")', async ({ page }) => {
    await dataCells(page).first().click();
    await page.keyboard.type('=LEN("abc")');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: '3' }).first()).toBeVisible({ timeout: 2000 });
  });
  test('kbd: formula =UPPER("hi")', async ({ page }) => {
    await dataCells(page).first().click();
    await page.keyboard.type('=UPPER("hi")');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: 'HI' }).first()).toBeVisible({ timeout: 2000 });
  });
  test('kbd: formula =LOWER("HI")', async ({ page }) => {
    await dataCells(page).first().click();
    await page.keyboard.type('=LOWER("HI")');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: 'hi' }).first()).toBeVisible({ timeout: 2000 });
  });
  test('kbd: formula =ROUND(2.7)', async ({ page }) => {
    await dataCells(page).first().click();
    await page.keyboard.type('=ROUND(2.7)');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: '3' }).first()).toBeVisible({ timeout: 2000 });
  });
  test('kbd: formula =ABS(-42)', async ({ page }) => {
    await dataCells(page).first().click();
    await page.keyboard.type('=ABS(-42)');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: '42' }).first()).toBeVisible({ timeout: 2000 });
  });
  test('kbd: formula =SQRT(16)', async ({ page }) => {
    await dataCells(page).first().click();
    await page.keyboard.type('=SQRT(16)');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: '4' }).first()).toBeVisible({ timeout: 2000 });
  });
  test('kbd: formula =MOD(7,3)', async ({ page }) => {
    await dataCells(page).first().click();
    await page.keyboard.type('=MOD(7,3)');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: '1' }).first()).toBeVisible({ timeout: 2000 });
  });
  test('kbd: formula =AND(1,1)', async ({ page }) => {
    await dataCells(page).first().click();
    await page.keyboard.type('=AND(1,1)');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: '1' }).first()).toBeVisible({ timeout: 2000 });
  });
  test('kbd: formula =OR(0,0)', async ({ page }) => {
    await dataCells(page).first().click();
    await page.keyboard.type('=OR(0,0)');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: '0' }).first()).toBeVisible({ timeout: 2000 });
  });
  test('kbd: formula =NOT(1)', async ({ page }) => {
    await dataCells(page).first().click();
    await page.keyboard.type('=NOT(1)');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: '0' }).first()).toBeVisible({ timeout: 2000 });
  });
  test('kbd: formula =TRUE()', async ({ page }) => {
    await dataCells(page).first().click();
    await page.keyboard.type('=TRUE()');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: '1' }).first()).toBeVisible({ timeout: 2000 });
  });
  test('kbd: formula =FALSE()', async ({ page }) => {
    await dataCells(page).first().click();
    await page.keyboard.type('=FALSE()');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: '0' }).first()).toBeVisible({ timeout: 2000 });
  });
  test('kbd: formula =COUNT(1,2,3)', async ({ page }) => {
    await dataCells(page).first().click();
    await page.keyboard.type('=COUNT(1,2,3)');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: '3' }).first()).toBeVisible({ timeout: 2000 });
  });
  test('kbd: formula =PRODUCT(2,3,4)', async ({ page }) => {
    await dataCells(page).first().click();
    await page.keyboard.type('=PRODUCT(2,3,4)');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: '24' }).first()).toBeVisible({ timeout: 2000 });
  });
  test('kbd: formula =LEFT("ABC",2)', async ({ page }) => {
    await dataCells(page).first().click();
    await page.keyboard.type('=LEFT("ABC",2)');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: 'AB' }).first()).toBeVisible({ timeout: 2000 });
  });
  test('kbd: formula =RIGHT("ABC",2)', async ({ page }) => {
    await dataCells(page).first().click();
    await page.keyboard.type('=RIGHT("ABC",2)');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: 'BC' }).first()).toBeVisible({ timeout: 2000 });
  });
  test('kbd: formula =CHAR(65)', async ({ page }) => {
    await dataCells(page).first().click();
    await page.keyboard.type('=CHAR(65)');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: 'A' }).first()).toBeVisible({ timeout: 2000 });
  });
  test('kbd: formula =VALUE("123")', async ({ page }) => {
    await dataCells(page).first().click();
    await page.keyboard.type('=VALUE("123")');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: '123' }).first()).toBeVisible({ timeout: 2000 });
  });
  test('kbd: formula =IF(1,"ok","no")', async ({ page }) => {
    await dataCells(page).first().click();
    await page.keyboard.type('=IF(1,"ok","no")');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: 'ok' }).first()).toBeVisible({ timeout: 2000 });
  });
  test('kbd: formula =IF(0,"ok","no")', async ({ page }) => {
    await dataCells(page).first().click();
    await page.keyboard.type('=IF(0,"ok","no")');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: 'no' }).first()).toBeVisible({ timeout: 2000 });
  });
  test('kbd: formula =TRIM("  x  ")', async ({ page }) => {
    await dataCells(page).first().click();
    await page.keyboard.type('=TRIM("  x  ")');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: 'x' }).first()).toBeVisible({ timeout: 2000 });
  });
  test('kbd: formula =REPT("a",4)', async ({ page }) => {
    await dataCells(page).first().click();
    await page.keyboard.type('=REPT("a",4)');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: 'aaaa' }).first()).toBeVisible({ timeout: 2000 });
  });
  test('kbd: formula =(2+3)*4', async ({ page }) => {
    await dataCells(page).first().click();
    await page.keyboard.type('=(2+3)*4');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: '20' }).first()).toBeVisible({ timeout: 2000 });
  });
  test('kbd: formula ="x"&"y"', async ({ page }) => {
    await dataCells(page).first().click();
    await page.keyboard.type('="x"&"y"');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: 'xy' }).first()).toBeVisible({ timeout: 2000 });
  });
  test('kbd: formula =INT(9.9)', async ({ page }) => {
    await dataCells(page).first().click();
    await page.keyboard.type('=INT(9.9)');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: '9' }).first()).toBeVisible({ timeout: 2000 });
  });
  test('kbd: formula =SIGN(-10)', async ({ page }) => {
    await dataCells(page).first().click();
    await page.keyboard.type('=SIGN(-10)');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: '-1' }).first()).toBeVisible({ timeout: 2000 });
  });
  test('kbd: formula =FACT(5)', async ({ page }) => {
    await dataCells(page).first().click();
    await page.keyboard.type('=FACT(5)');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: '120' }).first()).toBeVisible({ timeout: 2000 });
  });
  test('kbd: formula =MEDIAN(1,2,3)', async ({ page }) => {
    await dataCells(page).first().click();
    await page.keyboard.type('=MEDIAN(1,2,3)');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: '2' }).first()).toBeVisible({ timeout: 2000 });
  });
  test('kbd: formula =ISNUMBER(5)', async ({ page }) => {
    await dataCells(page).first().click();
    await page.keyboard.type('=ISNUMBER(5)');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: '1' }).first()).toBeVisible({ timeout: 2000 });
  });
  test('kbd: formula =ISTEXT("x")', async ({ page }) => {
    await dataCells(page).first().click();
    await page.keyboard.type('=ISTEXT("x")');
    await page.keyboard.press('Enter');
    await expect(dataCells(page).filter({ hasText: '1' }).first()).toBeVisible({ timeout: 2000 });
  });
});
