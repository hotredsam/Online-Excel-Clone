import { test, expect } from '@playwright/test';
import path from 'node:path';
import fs from 'node:fs';

const screenshotsDir = path.join(process.cwd(), 'e2e-screenshots');
if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });

test.describe('Everyday usage flow (screenshot capture)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.app')).toBeVisible({ timeout: 30000 });
    await expect(page.locator('.tab-bar')).toBeVisible({ timeout: 10000 });
  });

  test('full flow: load, tabs, grid, formula, upload, save, export, projects', async ({ page }) => {
    test.setTimeout(90000);
    await page.screenshot({ path: path.join(screenshotsDir, '01-initial-load.png'), fullPage: true });

    const sheetsTab = page.getByRole('tab', { name: /Sheets/i });
    await expect(sheetsTab).toBeVisible({ timeout: 15000 });
    await expect(sheetsTab).toHaveClass(/active/);
    await page.screenshot({ path: path.join(screenshotsDir, '02-sheets-tab-active.png'), fullPage: true });

    await page.getByRole('tab', { name: /Projects/i }).click();
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
    await page.screenshot({ path: path.join(screenshotsDir, '03-projects-tab.png'), fullPage: true });

    await page.getByRole('tab', { name: /Settings/i }).click();
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
    await page.screenshot({ path: path.join(screenshotsDir, '04-settings-tab.png'), fullPage: true });

    await page.getByRole('tab', { name: /Sheets/i }).click();
    const dataCell = page.locator('.dsg-cell').filter({ hasNot: page.locator('.dsg-cell-header') }).filter({ hasNot: page.locator('.dsg-cell-gutter') }).first();
    await dataCell.click();
    await page.keyboard.type('=1+2');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(screenshotsDir, '05-formula-1plus2.png'), fullPage: false });

    const cell2 = page.locator('.dsg-cell').filter({ hasNot: page.locator('.dsg-cell-gutter') }).nth(1);
    await cell2.click();
    await page.keyboard.type('Hello');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(screenshotsDir, '06-plain-text-cell.png'), fullPage: false });

    await page.getByRole('button', { name: /Open/i }).first().click();
    const sampleCsv = path.resolve(process.cwd(), '..', 'test-data', 'sample.csv');
    await page.locator('.ribbon input[type="file"]').setInputFiles(sampleCsv);
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(screenshotsDir, '07-after-upload-csv.png'), fullPage: true });

    await page.getByRole('button', { name: /Save/i }).first().click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(screenshotsDir, '08-after-save.png'), fullPage: false });

    await page.getByRole('tab', { name: /Projects/i }).click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotsDir, '09-projects-list.png'), fullPage: true });

    await page.getByRole('tab', { name: /Sheets/i }).click();
    await page.getByRole('button', { name: /XLSX/i }).first().click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(screenshotsDir, '10-after-export-xlsx.png'), fullPage: false });

    await page.getByRole('button', { name: /CSV/i }).first().click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotsDir, '11-after-export-csv.png'), fullPage: false });
  });
});
