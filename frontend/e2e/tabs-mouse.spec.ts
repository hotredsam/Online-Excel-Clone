import { test, expect } from '@playwright/test';

test.describe('Tab bar — mouse simulation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.tab-bar')).toBeVisible({ timeout: 15000 });
  });

  const tabs = ['Sheets', 'Projects', 'Settings'] as const;
  for (const tab of tabs) {
    test(`mouse: click ${tab} tab`, async ({ page }) => {
      await page.getByRole('tab', { name: new RegExp(tab, 'i') }).click();
      await expect(page.getByRole('tab', { name: new RegExp(tab, 'i') })).toHaveClass(/active/);
    });
    test(`mouse: ${tab} tab is visible`, async ({ page }) => {
      await expect(page.getByRole('tab', { name: new RegExp(tab, 'i') })).toBeVisible();
    });
    test(`mouse: ${tab} tab has accessible name`, async ({ page }) => {
      const tabEl = page.getByRole('tab', { name: new RegExp(tab, 'i') });
      await expect(tabEl).toBeVisible();
      await expect(tabEl).toHaveText(new RegExp(tab, 'i'));
    });
  }

  test('mouse: Sheets then Projects', async ({ page }) => {
    await page.getByRole('tab', { name: /Sheets/i }).click();
    await page.getByRole('tab', { name: /Projects/i }).click();
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
  });
  test('mouse: Sheets then Settings', async ({ page }) => {
    await page.getByRole('tab', { name: /Sheets/i }).click();
    await page.getByRole('tab', { name: /Settings/i }).click();
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
  });
  test('mouse: Projects then Sheets', async ({ page }) => {
    await page.getByRole('tab', { name: /Projects/i }).click();
    await page.getByRole('tab', { name: /Sheets/i }).click();
    await expect(page.locator('.dsg-container')).toBeVisible();
  });
  test('mouse: Projects then Settings', async ({ page }) => {
    await page.getByRole('tab', { name: /Projects/i }).click();
    await page.getByRole('tab', { name: /Settings/i }).click();
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
  });
  test('mouse: Settings then Sheets', async ({ page }) => {
    await page.getByRole('tab', { name: /Settings/i }).click();
    await page.getByRole('tab', { name: /Sheets/i }).click();
    await expect(page.locator('.dsg-container')).toBeVisible();
  });
  test('mouse: Settings then Projects', async ({ page }) => {
    await page.getByRole('tab', { name: /Settings/i }).click();
    await page.getByRole('tab', { name: /Projects/i }).click();
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
  });

  test('mouse: triple-click Sheets', async ({ page }) => {
    const tab = page.getByRole('tab', { name: /Sheets/i });
    await tab.click();
    await tab.click();
    await tab.click();
    await expect(tab).toHaveClass(/active/);
  });
  test('mouse: rapid switch Sheets -> Projects -> Settings -> Sheets', async ({ page }) => {
    await page.getByRole('tab', { name: /Projects/i }).click();
    await page.getByRole('tab', { name: /Settings/i }).click();
    await page.getByRole('tab', { name: /Sheets/i }).click();
    await expect(page.locator('.dsg-container')).toBeVisible();
  });
  test('mouse: tab bar contains exactly 3 tabs', async ({ page }) => {
    const tabBar = page.locator('.tab-bar');
    await expect(tabBar).toBeVisible();
    const tabs = tabBar.getByRole('tab');
    await expect(tabs).toHaveCount(3);
  });
  test('mouse: tab order Sheets, Projects, Settings', async ({ page }) => {
    const t0 = page.getByRole('tab').nth(0);
    const t1 = page.getByRole('tab').nth(1);
    const t2 = page.getByRole('tab').nth(2);
    await expect(t0).toHaveText(/Sheets/i);
    await expect(t1).toHaveText(/Projects/i);
    await expect(t2).toHaveText(/Settings/i);
  });
  test('mouse: default active is Sheets', async ({ page }) => {
    await expect(page.getByRole('tab', { name: /Sheets/i })).toHaveClass(/active/);
  });
  test('mouse: only one tab active', async ({ page }) => {
    const active = page.locator('.tab-bar .active');
    await expect(active).toHaveCount(1);
  });
  test('mouse: click Projects shows list or empty state', async ({ page }) => {
    await page.getByRole('tab', { name: /Projects/i }).click();
    const heading = page.getByRole('heading', { name: 'Projects' });
    await expect(heading).toBeVisible();
  });
  test('mouse: click Settings shows Theme row', async ({ page }) => {
    await page.getByRole('tab', { name: /Settings/i }).click();
    await expect(page.getByText('Theme')).toBeVisible();
  });
  test('mouse: tab bar visible after each switch', async ({ page }) => {
    await page.getByRole('tab', { name: /Projects/i }).click();
    await expect(page.locator('.tab-bar')).toBeVisible();
    await page.getByRole('tab', { name: /Sheets/i }).click();
    await expect(page.locator('.tab-bar')).toBeVisible();
  });
});
