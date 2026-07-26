import { test, expect } from '@playwright/test';

/**
 * Phase 2D — Keyboard and interaction baselines.
 *
 * Verifies tab order, focus destination, Escape behavior,
 * roving tabindex in segmented control, and reduced-motion
 * behavior across engines.
 */

test.describe('Keyboard navigation', () => {
  test.beforeEach(async({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('tab order visits all interactive controls in document order', async({ page, browserName }) => {
    // WebKit on macOS does not tab to buttons by default (system preference)
    // so this strict ordering test only applies to Chromium
    test.skip(browserName === 'webkit', 'WebKit macOS requires system tab preference for buttons');

    const expectedOrder: string[] = [];
    const interactive = page.locator(
      'button:not(:disabled):not([tabindex="-1"]), a[href], input:not(:disabled)',
    );
    const count = await interactive.count();

    // Collect expected accessible names
    for (let i = 0; i < count; i++) {
      const el = interactive.nth(i);
      const name = await el.getAttribute('aria-label') ??
        await el.textContent() ?? '';
      expectedOrder.push(name.trim());
    }

    // Tab through and collect focused element names
    const actualOrder: string[] = [];
    for (let i = 0; i < count; i++) {
      await page.keyboard.press('Tab');
      const focused = page.locator(':focus');
      const focusedCount = await focused.count();
      if (focusedCount === 0) break;
      const name = await focused.first().getAttribute('aria-label') ??
        await focused.first().textContent() ?? '';
      actualOrder.push(name.trim());
    }

    // Tab order should match document order (skipping disabled)
    expect(actualOrder.length).toBeGreaterThan(0);
    expect(actualOrder).toEqual(expectedOrder);
  });

  test('segmented control arrow key navigation', async({ page }) => {
    // Focus the first radio (Posts)
    const postsOption = page.locator('[role="radio"]').filter({ hasText: 'Posts' });
    await postsOption.focus();
    await expect(postsOption).toBeFocused();
    await expect(postsOption).toHaveAttribute('aria-checked', 'true');

    // Arrow right moves to next option (Replies)
    await page.keyboard.press('ArrowRight');
    const repliesOption = page.locator('[role="radio"]').filter({ hasText: 'Replies' });
    await expect(repliesOption).toBeFocused();
    await expect(repliesOption).toHaveAttribute('aria-checked', 'true');

    // Previous option (Posts) is now unchecked
    await expect(postsOption).toHaveAttribute('aria-checked', 'false');
  });

  test('segmented control skips disabled options on wrap', async({ page }) => {
    // Focus Replies, then arrow right should wrap past disabled Media to Posts
    const replies = page.locator('[role="radio"]:not(:disabled)').nth(1);
    await replies.focus();
    await page.keyboard.press('ArrowRight');

    const focused = page.locator(':focus');
    // Should wrap to Posts (first enabled), skipping disabled Media
    expect(await focused.textContent()).toBe('Posts');
  });

  test('live region announces segmented control selection', async({ page }) => {
    const selected = page.locator('[role="radio"][aria-checked="true"]');
    await selected.focus();
    await page.keyboard.press('ArrowRight');

    const liveRegion = page.locator('#live-region');
    const text = await liveRegion.textContent();
    expect(text).toContain('Replies');
    expect(text).toContain('selected');
  });

  test('no horizontal scrollbar at narrow viewport', async({ page, browserName }) => {
    // This test is most relevant at narrow viewport (320px)
    const body = page.locator('body');
    // At narrow viewports, content should reflow without horizontal scroll
    // Allow at most 1px rounding difference
    const scrollInfo = await body.evaluate((el) => ({
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
    }));
    expect(scrollInfo.scrollWidth).toBeLessThanOrEqual(scrollInfo.clientWidth + 1);
  });
});

test.describe('Reduced motion behavior', () => {
  test('transitions are near-instant under reduced motion', async({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Check computed transition-duration on a button
    const button = page.locator('.ds-button').first();
    const duration = await button.evaluate((el) => {
      return window.getComputedStyle(el).transitionDuration;
    });

    // Under reduced-motion project config, duration should be 0.01ms or 0s
    // Playwright's reducedMotion emulation triggers the media query
    const ms = parseFloat(duration);
    // Either very small or 0
    expect(ms).toBeLessThanOrEqual(0.15);
  });
});
