# Phase 3 Framework7 Application Shell

Status: **In progress**

Last updated: 2026-07-26

## Outcome

Phase 3 introduces the Framework7 React adaptive application shell behind a
feature flag, without rewriting existing content surfaces. The shell provides
phone, tablet, and desktop layouts with proper safe-area handling, page
transitions, and deep-link preservation while maintaining rollback capability
to the current React Router + Tailwind shell.

It is split into independently reviewable slices:

| Slice | Scope | Status |
|---|---|---|
| 3A | Install Framework7 React, feature flag, adaptive app root with phone/tablet/desktop layout detection | Complete — [PR 52](https://github.com/outlaw-dame/Mangane/pull/52) |
| 3B | Route mapping — bridge existing React Router routes to F7 views, deep-link preservation, back/forward | Complete — [PR 53](https://github.com/outlaw-dame/Mangane/pull/53) |
| 3C | Page transitions, safe-area insets, viewport/keyboard/orientation, reduced-motion variants | In progress |
| 3D | Account-switch, session restoration, route-level error and offline states, rollback evidence | Planned |

Phase 3 is not complete until every roadmap deliverable and exit criterion is
merged, verified in CI, and free of unresolved review findings.

## Slice 3A contract

### Current behavior

The application shell uses React Router 5 with a custom `<Layout>` component
and Tailwind responsive utilities (`hidden lg:block`, `lg:hidden`) to show/hide
desktop sidebar and mobile bottom navigation. Adaptation is CSS-only; no
runtime breakpoint detection exists. Framework7 is not installed.

### Target behavior

- `framework7` and `framework7-react` are exact, lockfile-governed runtime
  dependencies.
- A client-side feature flag (`framework7Shell`) controls which shell renders.
  Default: off (legacy shell). Enabled via user settings or developer tools.
- When enabled, a Framework7 `<App>` root renders with:
  - Phone layout: bottom `<Toolbar>` with tab navigation
  - Tablet layout: split view with sidebar + main panel
  - Desktop layout: multi-column with fixed sidebar, main content, and aside
- Layout selection uses Framework7's built-in responsive breakpoints, backed
  by the design-token breakpoint source.
- The F7 shell wraps existing content components via a compatibility `<View>`
  that renders current page components without requiring their migration.
- The legacy shell remains available and renders when the flag is off.
- No content component is modified in this slice.

### Security and privacy

Framework7 is a presentation framework. It does not access network, storage,
authentication, telemetry, or user data beyond what the wrapped components
already use. The feature flag is stored in the same user-settings mechanism
as existing preferences (localStorage via Redux).

### Migration and rollback

Rollback is toggling the feature flag off, which renders the legacy shell.
Removing the slice entirely is a revert of the additive F7 module, flag,
styles, and tests. No stored data migration is involved.

### Risks and controls

- F7 bundle size is mitigated by importing only used modules.
- F7 CSS variables are aliased to Mangane semantic tokens (existing contract).
- The architecture boundary gate is updated to allow controlled F7 imports
  only in the new shell module (`app/soapbox/features/f7-shell/`).
- No existing component may import Framework7 outside the shell boundary.
- Content rendering through the compatibility bridge must not change
  accessible names, roles, focus order, or keyboard behavior.

## Slice 3B contract

### Target behavior

- All existing routes from `SwitchingColumnsArea` are mapped to Framework7
  `<Route>` definitions with path parity.
- Browser back/forward, deep links, page refresh, and PWA relaunch resolve
  to the correct F7 view and page.
- Route parameters, query strings, and hash fragments are preserved.
- Auth gating (publicRoute, staffOnly, adminOnly) is maintained through
  the F7 route's `beforeEnter` guard or equivalent.
- History API integration ensures the URL bar always reflects the current
  F7 page.

### Migration and rollback

Same as 3A — flag off restores legacy routing entirely.

## Slice 3C contract

### Target behavior

- Page transitions use F7's built-in iOS/Material page animations.
- `prefers-reduced-motion: reduce` disables travel animations and uses
  opacity-only crossfade with near-instant duration (matching the
  `--ds-motion-duration-fast` token).
- Safe-area insets (`env(safe-area-inset-*)`) are respected in toolbar,
  navbar, and page content padding.
- The keyboard virtual viewport is handled: page content scrolls above
  the keyboard, toolbars optionally hide.
- Orientation changes preserve scroll position and focused element.
- Standalone PWA display is detected and adjusts top safe area.

### Risks and controls

- Transition animations are GPU-composited (transform + opacity only).
- Forced-colors mode disables F7 backdrop effects that rely on color.
- Touch gestures for swipe-back have a keyboard/button alternative.

## Slice 3D contract

### Target behavior

- Account switch clears F7 router history and reinitializes from home.
- Session restoration on page refresh/PWA relaunch navigates to the
  last known route (stored in sessionStorage, scoped to account).
- Route-level error boundaries display an F7 page with retry/home actions.
- Offline detection shows a banner and prevents navigation to routes
  that require network data, with clear messaging.
- The legacy shell's equivalent behaviors (currently minimal) are not
  regressed.

### Exit criteria evidence

- All existing major routes render through the F7 shell or compatibility
  bridge (verified by enumeration test).
- Browser back/forward, deep links, refresh, PWA relaunch, and focus
  restoration work (verified by Playwright interaction tests).
- Old shell remains rollback-capable (verified by flag-off rendering test).
- Phone, tablet, and desktop layouts activate at correct breakpoints.
- Reduced-motion page transitions are near-instant.
- Account switch purges F7 navigation state.

## Phase 3 completion checklist

- [ ] Framework7 React app root behind a feature flag.
- [ ] Phone bottom navigation.
- [ ] Tablet split/sidebar layout.
- [ ] Desktop multi-column layout.
- [ ] Route mapping and deep-link preservation.
- [ ] Safe-area, standalone PWA, viewport, keyboard, and orientation.
- [ ] Page transition policy with reduced-motion variants.
- [ ] Account-switch and session restoration behavior.
- [ ] Route-level error and offline states.
