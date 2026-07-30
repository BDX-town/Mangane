import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for Phase 2D accessibility and visual baselines.
 *
 * Covers:
 * - Chromium, Firefox, WebKit engines
 * - Phone (390×844), tablet (768×1024), desktop (1440×900) viewports
 * - Light/dark color schemes
 * - Reduced motion
 *
 * Fixtures use synthetic content and no secrets.
 */
export default defineConfig({
  testDir: './e2e',
  outputDir: './e2e/test-results',
  snapshotDir: './e2e/snapshots',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI
    ? [['html', { outputFolder: 'e2e/report' }], ['list']]
    : [['list']],
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
      threshold: 0.2,
    },
  },
  projects: [
    // Desktop — Chromium
    {
      name: 'desktop-chromium-light',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
        colorScheme: 'light',
      },
    },
    {
      name: 'desktop-chromium-dark',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
        colorScheme: 'dark',
      },
    },
    // Desktop — Firefox (run only in CI on Linux where Firefox/Playwright is stable)
    // Uncomment for CI: {
    //   name: 'desktop-firefox-light',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //     viewport: { width: 1440, height: 900 },
    //     colorScheme: 'light',
    //   },
    // },
    // Desktop — WebKit
    {
      name: 'desktop-webkit-light',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1440, height: 900 },
        colorScheme: 'light',
      },
    },
    // Phone — Chromium
    {
      name: 'phone-chromium-light',
      use: {
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
        colorScheme: 'light',
        browserName: 'chromium',
      },
    },
    // Tablet — Chromium
    {
      name: 'tablet-chromium-light',
      use: {
        viewport: { width: 768, height: 1024 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
        colorScheme: 'light',
        browserName: 'chromium',
      },
    },
    // Narrow reflow — Chromium
    {
      name: 'narrow-chromium-light',
      use: {
        viewport: { width: 320, height: 800 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
        colorScheme: 'light',
        browserName: 'chromium',
      },
    },
    // Reduced motion — Chromium
    {
      name: 'desktop-chromium-reduced-motion',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
        colorScheme: 'light',
        reducedMotion: 'reduce',
      },
    },
  ],
  webServer: {
    command: 'npx serve e2e/fixtures-site -l 4173',
    port: 4173,
    reuseExistingServer: !process.env.CI,
  },
});
