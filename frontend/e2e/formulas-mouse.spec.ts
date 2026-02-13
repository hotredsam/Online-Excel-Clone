import { test, expect } from '@playwright/test';

function dataCells(page: import('@playwright/test').Page) {
  return page.locator('.dsg-cell').filter({ hasNot: page.locator('.dsg-cell-header') }).filter({ hasNot: page.locator('.dsg-cell-gutter') });
}

async function typeFormulaAndExpect(
  page: import('@playwright/test').Page,
  cellIndex: number,
  formula: string,
  expected: string | number
) {
  await dataCells(page).nth(cellIndex).click();
  await page.keyboard.type(formula);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(500);
  const re = new RegExp(`^${String(expected).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`);
  await expect(dataCells(page).filter({ hasText: re }).first()).toBeVisible({ timeout: 3000 });
}

test.describe('Formulas — mouse click then type', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.dsg-container')).toBeVisible({ timeout: 15000 });
  });

  test('mouse: cell click then =2+3', async ({ page }) => { await typeFormulaAndExpect(page, 0, '=2+3', '5'); });
  test('mouse: cell click then =10/2', async ({ page }) => { await typeFormulaAndExpect(page, 1, '=10/2', '5'); });
  test('mouse: cell click then =2*5', async ({ page }) => { await typeFormulaAndExpect(page, 2, '=2*5', '10'); });
  test('mouse: cell click then =2^4', async ({ page }) => { await typeFormulaAndExpect(page, 3, '=2^4', '16'); });
  test('mouse: cell click then =SUM(1,2,3,4)', async ({ page }) => { await typeFormulaAndExpect(page, 4, '=SUM(1,2,3,4)', '10'); });
  test('mouse: cell click then =AVERAGE(10,20,30)', async ({ page }) => { await typeFormulaAndExpect(page, 5, '=AVERAGE(10,20,30)', '20'); });
  test('mouse: cell click then =MIN(5,2,9)', async ({ page }) => { await typeFormulaAndExpect(page, 6, '=MIN(5,2,9)', '2'); });
  test('mouse: cell click then =MAX(5,2,9)', async ({ page }) => { await typeFormulaAndExpect(page, 7, '=MAX(5,2,9)', '9'); });
  test('mouse: cell click then =IF(1,"a","b")', async ({ page }) => { await typeFormulaAndExpect(page, 8, '=IF(1,"a","b")', 'a'); });
  test('mouse: cell click then =IF(0,"a","b")', async ({ page }) => { await typeFormulaAndExpect(page, 9, '=IF(0,"a","b")', 'b'); });
  test('mouse: cell click then =AND(1,1)', async ({ page }) => { await typeFormulaAndExpect(page, 10, '=AND(1,1)', '1'); });
  test('mouse: cell click then =OR(0,1)', async ({ page }) => { await typeFormulaAndExpect(page, 11, '=OR(0,1)', '1'); });
  test('mouse: cell click then =NOT(0)', async ({ page }) => { await typeFormulaAndExpect(page, 12, '=NOT(0)', '1'); });
  test('mouse: cell click then =LEN("hello")', async ({ page }) => { await typeFormulaAndExpect(page, 13, '=LEN("hello")', '5'); });
  test('mouse: cell click then =LEFT("Hello",2)', async ({ page }) => { await typeFormulaAndExpect(page, 14, '=LEFT("Hello",2)', 'He'); });
  test('mouse: cell click then =RIGHT("Hello",2)', async ({ page }) => { await typeFormulaAndExpect(page, 15, '=RIGHT("Hello",2)', 'lo'); });
  test('mouse: cell click then =UPPER("hi")', async ({ page }) => { await typeFormulaAndExpect(page, 16, '=UPPER("hi")', 'HI'); });
  test('mouse: cell click then =LOWER("HI")', async ({ page }) => { await typeFormulaAndExpect(page, 17, '=LOWER("HI")', 'hi'); });
  test('mouse: cell click then =ROUND(2.5)', async ({ page }) => { await typeFormulaAndExpect(page, 18, '=ROUND(2.5)', '3'); });
  test('mouse: cell click then =ABS(-7)', async ({ page }) => { await typeFormulaAndExpect(page, 19, '=ABS(-7)', '7'); });
  test('mouse: cell click then =SQRT(9)', async ({ page }) => { await typeFormulaAndExpect(page, 20, '=SQRT(9)', '3'); });
  test('mouse: cell click then =MOD(10,3)', async ({ page }) => { await typeFormulaAndExpect(page, 21, '=MOD(10,3)', '1'); });
  test('mouse: cell click then =POWER(2,4)', async ({ page }) => { await typeFormulaAndExpect(page, 22, '=POWER(2,4)', '16'); });
  test('mouse: cell click then =INT(3.9)', async ({ page }) => { await typeFormulaAndExpect(page, 23, '=INT(3.9)', '3'); });
  test('mouse: cell click then =CONCATENATE("a","b")', async ({ page }) => { await typeFormulaAndExpect(page, 24, '=CONCATENATE("a","b")', 'ab'); });
  test('mouse: cell click then =TRIM("  x  ")', async ({ page }) => { await typeFormulaAndExpect(page, 25, '=TRIM("  x  ")', 'x'); });
  test('mouse: cell click then =TRUE()', async ({ page }) => { await typeFormulaAndExpect(page, 26, '=TRUE()', '1'); });
  test('mouse: cell click then =FALSE()', async ({ page }) => { await typeFormulaAndExpect(page, 27, '=FALSE()', '0'); });
  test('mouse: cell click then =COUNT(1,2,3)', async ({ page }) => { await typeFormulaAndExpect(page, 28, '=COUNT(1,2,3)', '3'); });
  test('mouse: cell click then =COUNTA(1,"x")', async ({ page }) => { await typeFormulaAndExpect(page, 29, '=COUNTA(1,"x")', '2'); });
  test('mouse: cell click then =PRODUCT(2,3,4)', async ({ page }) => { await typeFormulaAndExpect(page, 30, '=PRODUCT(2,3,4)', '24'); });
  test('mouse: cell click then =MEDIAN(1,2,3)', async ({ page }) => { await typeFormulaAndExpect(page, 31, '=MEDIAN(1,2,3)', '2'); });
  test('mouse: cell click then =FIND("o","Hello")', async ({ page }) => { await typeFormulaAndExpect(page, 32, '=FIND("o","Hello")', '5'); });
  test('mouse: cell click then =CHAR(65)', async ({ page }) => { await typeFormulaAndExpect(page, 33, '=CHAR(65)', 'A'); });
  test('mouse: cell click then =CODE("A")', async ({ page }) => { await typeFormulaAndExpect(page, 34, '=CODE("A")', '65'); });
  test('mouse: cell click then =VALUE("99")', async ({ page }) => { await typeFormulaAndExpect(page, 35, '=VALUE("99")', '99'); });
  test('mouse: cell click then =N(42)', async ({ page }) => { await typeFormulaAndExpect(page, 36, '=N(42)', '42'); });
  test('mouse: cell click then =SIGN(-5)', async ({ page }) => { await typeFormulaAndExpect(page, 37, '=SIGN(-5)', '-1'); });
  test('mouse: cell click then =FACT(4)', async ({ page }) => { await typeFormulaAndExpect(page, 38, '=FACT(4)', '24'); });
  test('mouse: cell click then =EXACT("a","a")', async ({ page }) => { await typeFormulaAndExpect(page, 39, '=EXACT("a","a")', '1'); });
  test('mouse: cell click then =REPT("x",3)', async ({ page }) => { await typeFormulaAndExpect(page, 40, '=REPT("x",3)', 'xxx'); });
  test('mouse: cell click then =(1+2)*3', async ({ page }) => { await typeFormulaAndExpect(page, 41, '=(1+2)*3', '9'); });
  test('mouse: cell click then =10/(2+3)', async ({ page }) => { await typeFormulaAndExpect(page, 42, '=10/(2+3)', '2'); });
  test('mouse: cell click then =-5', async ({ page }) => { await typeFormulaAndExpect(page, 43, '=-5', '-5'); });
  test('mouse: cell click then ="a"&"b"', async ({ page }) => { await typeFormulaAndExpect(page, 44, '="a"&"b"', 'ab'); });
  test('mouse: cell click then =CHOOSE(2,"X","Y","Z")', async ({ page }) => { await typeFormulaAndExpect(page, 45, '=CHOOSE(2,"X","Y","Z")', 'Y'); });
  test('mouse: cell click then =ISNUMBER(1)', async ({ page }) => { await typeFormulaAndExpect(page, 46, '=ISNUMBER(1)', '1'); });
  test('mouse: cell click then =ISTEXT("x")', async ({ page }) => { await typeFormulaAndExpect(page, 47, '=ISTEXT("x")', '1'); });
  test('mouse: cell click then =TEXTJOIN(",",0,"a","b")', async ({ page }) => { await typeFormulaAndExpect(page, 48, '=TEXTJOIN(",",0,"a","b")', 'a,b'); });
  test('mouse: cell click then =SUBSTITUTE("a-b","-",",")', async ({ page }) => { await typeFormulaAndExpect(page, 49, '=SUBSTITUTE("a-b","-",",")', 'a,b'); });
});
