# Phase 3 Framework7 Application Shell

Status: **Shell foundation complete / application-surface migration remains phased**

Last updated: 2026-07-30

## Outcome

Phase 3 introduces the Framework7 React adaptive application shell behind a
feature flag, without rewriting existing content surfaces. The shell provides
phone, tablet, and desktop layouts with proper safe-area handling, transition
policy, deep-link preservation through the existing React Router authority, and
rollback capability to the legacy shell.

Phase 3 completion means the **adaptive shell and compatibility bridge** are
complete. It does not mean Framework7 owns every route lifecycle or that every
content surface has been migrated. Feed, conversation, composer, article,
search, settings, media, and later feature-surface migrations remain owned by
their roadmap phases.

It is split into independently reviewable slices:

| Slice | Scope | Status |
|---|---|---|
| 3A | Install Framework7 React, feature flag, adaptive app root with phone/tablet/desktop layout detection | Complete — [PR 52](https://github.com/outlaw-dame/Mangane/pull/52) |
| 3B | Route manifest, React Router compatibility bridge, deep-link preservation, and session route state | Complete — [PR 53](https://github.com/outlaw-dame/Mangane/pull/53) |
| 3C | Transition policy, safe-area insets, viewport/keyboard/orientation, and reduced-motion variants | Complete — [PR 54](https://github.com/outlaw-dame/Mangane/pull/54) |
| 3D | Account-switch, session restoration, route-level error and offline states, rollback evidence | Complete — [PR 55](https://github.com/outlaw-dame/Mangane/pull/55) |
| 3E | Post-closure semantic-icon parity, boundary clarification, rollout gates, and generated inventory refresh | In progress |

## Delivered architecture

### Shell and routing authority

React Router remains the URL, route matching, authorization metadata, browser
history, and deep-link authority. Framework7 owns adaptive shell layout and
presentation around the rendered route content.

This avoids two simultaneous routers and preserves current route semantics.
A later router migration requires its own equivalence evidence, cancellation,
account-switch, back/forward, deep-link, and rollback plan; it is not implied by
Phase 3 completion.

### Framework7 import boundary

Direct `framework7` and `framework7-react` imports remain confined to
`app/soapbox/features/f7-shell/` until an owning feature phase proves that a
narrow additional boundary is required.

Later phases must choose one of these reviewed patterns:

1. reuse Framework7 through shared semantic design-system adapters without a
   direct feature import; or
2. add a narrowly named and inventory-governed feature boundary with explicit
   ownership, tests, rollback, and no direct network, storage, or protocol
   coupling.

A repository-wide Framework7 import exception is prohibited.

### Semantic icon authority

Framework7 shell navigation consumes Mangane's canonical `SemanticIcon`
registry. Raw Framework7 icon names, direct Phosphor imports, and legacy icon
provider imports are prohibited inside shell navigation.

Selected and active variants are expressed through semantic icon weight rather
than a second icon provider or provider-specific filename.

## Slice 3A contract

- `framework7` and `framework7-react` are exact, lockfile-governed runtime
  dependencies.
- A client-side feature flag (`framework7Shell`) controls which shell renders.
- The Framework7 `<App>` root provides phone, tablet, and desktop layouts.
- Existing content renders through a compatibility bridge.
- The legacy shell remains the rollback path.
- No content component migration is claimed by this slice.

## Slice 3B contract

- The canonical route manifest enumerates existing routes and authorization
  metadata.
- React Router remains authoritative for path matching, browser back/forward,
  parameters, query strings, hashes, and URL synchronization.
- Route state persistence supports validated refresh and PWA restoration.
- No duplicate Framework7 router state may become an independent route
  authority.

## Slice 3C contract

- Transition duration and easing use semantic variables.
- Reduced motion removes travel animation.
- Safe-area, keyboard, orientation, and standalone-PWA behavior are handled.
- Orientation and viewport changes must not leak account or route state.

## Slice 3D contract

- Account switch clears shell navigation state and returns to a safe route.
- Session restoration validates stored paths against the route manifest.
- Offline and error states remain accessible and recoverable.
- The legacy shell can be selected without persisted-data migration.

## Slice 3E gap resolution

### Required work

- reconcile documentation so shell completion is not confused with full
  application migration;
- keep React Router and Framework7 ownership explicit;
- migrate shell-owned icons through the semantic icon registry;
- regenerate icon, design, dependency, documentation, and architecture
  inventories after shell changes;
- add executable drift tests rejecting raw `iconF7`, direct Phosphor, and
  legacy icon-provider use in shell navigation;
- define default-on and legacy-retirement gates without enabling either early.

### Default-on gates

The Framework7 shell must remain opt-in until all of the following are proven:

- Home and one representative secondary content surface have migrated through
  stable Phase 7 application boundaries and the Phase 8 renderer;
- phone, tablet, and desktop shell tests pass in Chromium, Firefox, and WebKit;
- deep links, browser history, refresh, PWA relaunch, account switch, offline,
  error recovery, keyboard visibility, orientation, and focus restoration pass;
- light, dark, increased contrast, forced colors, reduced motion, RTL, browser
  zoom, and narrow reflow baselines pass;
- no major backend capability is available only through the legacy shell;
- rollback remains a tested configuration change rather than a code rewrite;
- release telemetry is not required to make the decision.

### Legacy-shell retirement gates

Default-on does not imply immediate retirement. The legacy shell may be removed
only after:

- at least one bounded release period with Framework7 default-on and no
  unresolved severity-one parity defect;
- every high-use route has a migrated or explicitly retained presentation
  owner;
- the rollback window and support policy have expired through a reviewed ADR;
- legacy-only styles, navigation, tests, settings, and dependencies have a
  generated zero-use or approved-retention disposition;
- account cleanup, caches, saved route state, and feature flags require no data
  migration or have a tested idempotent migration;
- accessibility and visual baselines remain green after removal.

## Security and privacy

Framework7 remains a presentation dependency. It must not become a network,
authentication, persistence, telemetry, authorization, or protocol authority.
UI disabled or hidden state is never an authorization boundary.

No navigation state may cross account scope. Stored route state must remain
bounded, path-only, validated, and purgeable. Diagnostics must not include
private route query data, status content, tokens, or account identifiers.

## Phase 3 completion checklist

- [x] Framework7 React app root behind a feature flag.
- [x] Phone bottom navigation.
- [x] Tablet split/sidebar layout.
- [x] Desktop multi-column layout.
- [x] Canonical route manifest and React Router compatibility bridge.
- [x] Safe-area, standalone PWA, viewport, keyboard, and orientation.
- [x] Transition policy with reduced-motion variants.
- [x] Account-switch and session restoration behavior.
- [x] Route-level error and offline states.
- [x] Completion wording distinguishes shell foundation from application migration.
- [x] Post-shell Framework7 import policy is explicit.
- [x] Default-on and legacy-retirement gates are explicit.
- [ ] Shell semantic-icon migration and generated inventory refresh are merged and green.
- [ ] Cross-engine full-shell interaction and visual matrices pass; these remain
  incremental acceptance evidence as owning presentation phases migrate.
