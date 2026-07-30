import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const shellUrl = '/f7-shell/';

test.describe('Framework7 shell parity fixture', () => {
  test.beforeEach(async({ page }) => {
    await page.goto(shellUrl);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByTestId('f7-shell')).toBeVisible();
  });

  test('uses the correct responsive shell structure without horizontal overflow', async({ page }) => {
    const viewport = page.viewportSize();
    expect(viewport).not.toBeNull();

    const sidebar = page.locator('.sidebar');
    const tabs = page.locator('.tabs');
    const aside = page.locator('.aside');

    if ((viewport?.width ?? 0) < 768) {
      await expect(sidebar).toBeHidden();
      await expect(tabs).toBeVisible();
      await expect(aside).toBeHidden();
    } else if ((viewport?.width ?? 0) <= 1024) {
      await expect(sidebar).toBeVisible();
      await expect(tabs).toBeHidden();
      await expect(aside).toBeHidden();
    } else {
      await expect(sidebar).toBeVisible();
      await expect(tabs).toBeHidden();
      await expect(aside).toBeVisible();
    }

    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
  });

  test('exposes one visible named navigation with one current destination', async({ page }) => {
    const visibleNavigationCount = await page.getByRole('navigation', { name: 'Primary navigation' }).evaluateAll((items) => (
      items.filter((item) => item.getClientRects().length > 0).length
    ));
    expect(visibleNavigationCount).toBe(1);

    const currentVisibleCount = await page.locator('[aria-current="page"]').evaluateAll((items) => (
      items.filter((item) => item.getClientRects().length > 0).length
    ));
    expect(currentVisibleCount).toBe(1);
  });

  test('navigation preserves one selected destination and moves focus to content', async({ page }) => {
    await page.getByRole('button', { name: 'Search' }).first().click();

    await expect(page.locator('#route-title')).toHaveText('Search');
    await expect(page.locator('[data-route="search"][aria-current="page"]')).toHaveCount(2);
    await expect(page.locator('[data-route="home"][aria-current="page"]')).toHaveCount(0);
    await expect(page.locator('#main')).toBeFocused();
    await expect(page).toHaveURL(/#search$/);
  });

  test('account switch resets route state without leaking the prior account', async({ page }) => {
    await page.getByRole('button', { name: 'Settings' }).first().click();
    await page.getByRole('button', { name: 'Switch account' }).click();

    await expect(page.locator('#account')).toHaveText('Account Beta');
    await expect(page.locator('#route-title')).toHaveText('Home');
    await expect(page.locator('[data-route="home"][aria-current="page"]')).toHaveCount(2);
  });

  test('offline state is announced without removing cached content', async({ page }) => {
    const status = page.getByRole('status');
    await expect(status).toBeHidden();
    await page.getByRole('button', { name: 'Toggle offline' }).click();
    await expect(status).toBeVisible();
    await expect(status).toContainText('Cached content remains available');
    await expect(page.locator('.card')).toBeVisible();
  });

  test('hides phone tabs while the virtual keyboard is visible', async({ page }) => {
    await page.goto(`${shellUrl}?keyboard=true`);
    await expect(page.getByTestId('f7-shell')).toHaveAttribute('data-keyboard', 'true');
    await expect(page.locator('.tabs')).toBeHidden();
  });

  test('provides named route recovery controls', async({ page }) => {
    await page.goto(`${shellUrl}?error=true`);
    const alert = page.getByRole('alert');
    await expect(alert).toBeVisible();
    await expect(alert.getByRole('heading', { name: 'This page could not be displayed' })).toBeVisible();
    await expect(alert.getByRole('button', { name: 'Retry' })).toBeVisible();
    await expect(alert.getByRole('button', { name: 'Go home' })).toBeVisible();
  });

  test('legacy rollback control remains keyboard reachable and independently addressable', async({ page }) => {
    const rollback = page.getByRole('button', { name: 'Use legacy shell' });
    await rollback.focus();
    await expect(rollback).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('body')).toHaveAttribute('data-shell', 'legacy');
    await expect(page.getByTestId('legacy-shell')).toBeVisible();
    await expect(page.getByTestId('f7-shell')).toBeHidden();
  });

  test('has no detectable WCAG 2.2 AA violations', async({ page, browserName }) => {
    test.skip(browserName === 'firefox', 'axe-core is not stable in the current Firefox harness');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('interactive controls meet the 44px target contract', async({ page }) => {
    const controls = page.locator('button');
    for (let index = 0; index < await controls.count(); index += 1) {
      const box = await controls.nth(index).boundingBox();
      if (box) expect(box.height).toBeGreaterThanOrEqual(44);
    }
  });

  test('reduced-motion project produces near-instant motion values', async({ page }) => {
    const reduced = await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
    test.skip(!reduced, 'Only applicable to the reduced-motion project');
    const duration = await page.getByTestId('f7-shell').evaluate((element) => getComputedStyle(element).transitionDuration);
    expect(['0s', '0.00001s']).toContain(duration);
  });
});