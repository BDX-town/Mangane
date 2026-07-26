import { test, expect } from '@playwright/test';

/**
 * Phase 2D — Cross-engine visual regression baselines.
 *
 * Captures deterministic screenshots of each foundational control section.
 * Runs across Chromium, Firefox, WebKit at phone, tablet, narrow, and
 * desktop viewports in light, dark, and reduced-motion configurations.
 *
 * Baselines are stored in e2e/snapshots/ and compared on subsequent runs.
 */

test.describe('Visual baselines — full page', () => {
  test('foundational controls page', async({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    // Wait for any transitions to settle
    await page.waitForTimeout(200);
    await expect(page).toHaveScreenshot('foundational-controls-full.png', {
      fullPage: true,
    });
  });
});

test.describe('Visual baselines — individual sections', () => {
  test.beforeEach(async({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(150);
  });

  test('button section', async({ page }) => {
    const section = page.locator('section[aria-labelledby="section-button"]');
    await expect(section).toBeVisible();
    await expect(section).toHaveScreenshot('section-button.png');
  });

  test('icon button section', async({ page }) => {
    const section = page.locator('section[aria-labelledby="section-icon-button"]');
    await expect(section).toBeVisible();
    await expect(section).toHaveScreenshot('section-icon-button.png');
  });

  test('card section', async({ page }) => {
    const section = page.locator('section[aria-labelledby="section-card"]');
    await expect(section).toBeVisible();
    await expect(section).toHaveScreenshot('section-card.png');
  });

  test('avatar section', async({ page }) => {
    const section = page.locator('section[aria-labelledby="section-avatar"]');
    await expect(section).toBeVisible();
    await expect(section).toHaveScreenshot('section-avatar.png');
  });

  test('chip section', async({ page }) => {
    const section = page.locator('section[aria-labelledby="section-chip"]');
    await expect(section).toBeVisible();
    await expect(section).toHaveScreenshot('section-chip.png');
  });

  test('list row section', async({ page }) => {
    const section = page.locator('section[aria-labelledby="section-list-row"]');
    await expect(section).toBeVisible();
    await expect(section).toHaveScreenshot('section-list-row.png');
  });

  test('segmented control section', async({ page }) => {
    const section = page.locator('section[aria-labelledby="section-segmented"]');
    await expect(section).toBeVisible();
    await expect(section).toHaveScreenshot('section-segmented.png');
  });

  test('field section', async({ page }) => {
    const section = page.locator('section[aria-labelledby="section-field"]');
    await expect(section).toBeVisible();
    await expect(section).toHaveScreenshot('section-field.png');
  });

  test('menu trigger section', async({ page }) => {
    const section = page.locator('section[aria-labelledby="section-menu"]');
    await expect(section).toBeVisible();
    await expect(section).toHaveScreenshot('section-menu.png');
  });
});
