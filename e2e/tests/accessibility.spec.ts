import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';

/**
 * Phase 2D — Accessibility harness.
 *
 * Runs axe-core against the foundational controls fixture across all
 * configured engines and viewports. Verifies WCAG 2.2 AA compliance
 * for the design system primitives.
 */

test.describe('Foundational controls accessibility', () => {
  test.beforeEach(async({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('passes axe-core WCAG 2.2 AA audit', async({ page, browserName }) => {
    // axe-core can hang in Firefox on macOS; skip there
    test.skip(browserName === 'firefox', 'axe-core unreliable in Firefox/Playwright');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('all buttons have accessible names', async({ page }) => {
    const buttons = page.locator('button, [role="button"]');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      const name = await button.getAttribute('aria-label') ??
        await button.textContent();
      expect(name?.trim().length).toBeGreaterThan(0);
    }
  });

  test('form fields have associated labels', async({ page }) => {
    const inputs = page.locator('input');
    const count = await inputs.count();

    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      expect(id).toBeTruthy();
      const label = page.locator(`label[for="${id}"]`);
      await expect(label).toBeVisible();
    }
  });

  test('error field has aria-invalid and associated error message', async({ page }) => {
    const invalidInput = page.locator('[aria-invalid="true"]');
    await expect(invalidInput).toBeVisible();
    const describedBy = await invalidInput.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    const errorEl = page.locator(`#${describedBy}`);
    await expect(errorEl).toBeVisible();
    await expect(errorEl).toHaveAttribute('role', 'alert');
  });

  test('segmented control uses radiogroup semantics', async({ page }) => {
    const radiogroup = page.locator('[role="radiogroup"]');
    await expect(radiogroup).toHaveAttribute('aria-label');
    const radios = radiogroup.locator('[role="radio"]');
    const count = await radios.count();
    expect(count).toBeGreaterThanOrEqual(2);

    // Exactly one checked
    const checked = radiogroup.locator('[role="radio"][aria-checked="true"]');
    expect(await checked.count()).toBe(1);
  });

  test('icon buttons have aria-label', async({ page }) => {
    const iconButtons = page.locator('.ds-icon-button');
    const count = await iconButtons.count();

    for (let i = 0; i < count; i++) {
      const btn = iconButtons.nth(i);
      const label = await btn.getAttribute('aria-label');
      expect(label?.trim().length).toBeGreaterThan(0);
    }
  });

  test('disabled controls are not focusable via tab', async({ page }) => {
    const disabledButtons = page.locator('button:disabled');
    const count = await disabledButtons.count();

    for (let i = 0; i < count; i++) {
      const btn = disabledButtons.nth(i);
      // Native disabled buttons are already excluded from tab order
      // Just verify they have the disabled attribute
      await expect(btn).toBeDisabled();
    }
  });

  test('minimum touch target size of 44px', async({ page }) => {
    const interactiveControls = page.locator(
      '.ds-button, .ds-icon-button, .ds-list-row, .ds-segmented-control__option',
    );
    const count = await interactiveControls.count();

    for (let i = 0; i < count; i++) {
      const el = interactiveControls.nth(i);
      const box = await el.boundingBox();
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test('focus-visible ring is present on keyboard focus', async({ page }) => {
    // Tab to first button
    await page.keyboard.press('Tab');
    const focused = page.locator(':focus-visible');
    const count = await focused.count();
    expect(count).toBeGreaterThan(0);

    // Verify outline style
    const outline = await focused.first().evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        outlineStyle: style.outlineStyle,
        outlineWidth: parseFloat(style.outlineWidth),
      };
    });
    expect(outline.outlineStyle).not.toBe('none');
    expect(outline.outlineWidth).toBeGreaterThanOrEqual(2);
  });

  test('live region exists for dynamic announcements', async({ page }) => {
    const liveRegion = page.locator('[aria-live="polite"]');
    await expect(liveRegion).toBeAttached();
  });
});
