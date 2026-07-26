# Accessibility Test Baseline

Status: **Phase 2D complete**

The required PR baseline verifies:

- login headings and explicit field labels;
- required username and password semantics;
- a named, keyboard-reachable password visibility control whose state label changes;
- protected and public deep-link behavior;
- keyboard-operable compose navigation;
- global `prefers-reduced-motion: reduce` behavior;
- inventoried focus, keyboard, labels, live regions, gestures, motion, RTL, and localization callsites.

Phase 2D adds cross-engine Playwright-based harness:

- axe-core WCAG 2.2 AA audit across Chromium and WebKit;
- keyboard tab order, roving tabindex, and live-region assertions;
- 44px minimum touch-target verification;
- focus-visible ring presence on keyboard navigation;
- reduced-motion transition clamping;
- no horizontal overflow at 320px reflow width;
- visual regression baselines at phone, narrow, tablet, and desktop viewports.

The canonical commands are:
- `yarn test:browser-accessibility` (Jest JSDOM baseline)
- `yarn test:e2e` (Playwright cross-engine harness)
- `yarn test:accessibility` (Playwright axe-core only)
- `yarn test:visual-baselines` (Playwright screenshot diffs only)

Automated checks do not prove conformance. Manual screen-reader, zoom/reflow, contrast, forced-colors, switch-control, touch-target, cognitive-load, and cross-engine keyboard review remain required for migrated surfaces. New overlays must test initial focus, containment, Escape, return focus, background inertness, labels, and reduced-motion behavior.
