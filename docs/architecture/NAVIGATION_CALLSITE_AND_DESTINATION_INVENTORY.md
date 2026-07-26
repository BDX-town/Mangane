# Navigation Call-Site and Destination Inventory

Status: **Current / bounded Phase 0 artifact complete**

Last updated: 2026-07-24

## Purpose and evidence boundary

This document records the verified navigation producers, destination classes and trust boundaries that are already known to cross the inherited router, service-worker, notification and account-transition boundaries. It is the companion to `ROUTE_AND_COMPATIBILITY_MANIFEST.md` and is required before Mangane replaces inherited React Router behavior with a Framework7 shell.

The bounded artifact is complete for the source boundary listed below. Repository-wide navigation discovery and the deployment/backend rewrite inventory are now separately complete and executable; this document remains the human-reviewed trust-boundary companion rather than duplicating their generated rows.

### Directly inspected source boundary

| Source | Verified ownership | Confidence | Remaining unknowns |
|---|---|---|---|
| `app/soapbox/features/ui/index.tsx` | primary route switch, compatibility redirects, service-worker navigation listener, browser-back behavior, keyboard shortcuts and compose navigation | High | feature-local components may own additional navigation primitives |
| `app/soapbox/features/ui/util/react_router_helpers.tsx` | anonymous authorization failure writes `soapbox:redirect_uri` before redirecting to `/login` | High | the underscore-key write has no verified reader |
| `app/soapbox/utils/redirect.ts` | caches, consumes and removes `soapbox:redirect-uri`; defaults to `/`; clears the key on `beforeunload` | High | callers outside the verified login/verification paths may exist |
| `app/soapbox/containers/soapbox.tsx` | root `BrowserRouter`, `FE_SUBDIRECTORY`, public/auth layout interception and catch-all UI ownership | High | nested routers and deployment rewrites remain separately gated |
| previously verified service-worker share-target and notification paths | `/statuses/compose?text=...`, notification focus/open and navigation-message boundaries | High for documented paths | complete worker producer/consumer enumeration remains open |
| `ROUTE_AND_COMPATIBILITY_MANIFEST.md` | canonical and inherited redirect destinations | High | server-owned and reverse-proxy paths remain open |
| `ACCOUNT_TRANSITION_AND_PURGE_CONTRACT.md` | account/session continuation, switching, logout and purge consequences | High | generation fencing is accepted target behavior, not current implementation |

## Navigation authority model

A destination may originate from one of six classes:

1. **Static application navigation** — hard-coded internal routes from menus, tabs, keyboard shortcuts and settings surfaces.
2. **Entity-derived navigation** — destinations derived from account usernames, status identifiers, list identifiers, tags or instance names.
3. **Session continuation navigation** — login return destinations and account-transition redirects.
4. **Worker-originated navigation** — service-worker messages, share-target handling and notification clicks.
5. **Compatibility navigation** — legacy redirects and backend-compatible deep links.
6. **External navigation** — links intentionally leaving the application origin.

The replacement shell must not treat these classes as equivalent. Each requires explicit validation, encoding, scope and rollback behavior.

## Verified call-site matrix

| File and symbol | Primitive and destination | Class and input | Current validation/encoding | Account or capability scope | Required replacement and tests |
|---|---|---|---|---|---|
| `features/ui/index.tsx` service-worker message effect | `history.push(data.path)` for `type === 'navigate'` | worker-originated; worker-provided path | message type is checked; destination validation is not visible at this call site | can execute while account/capability state changes | central worker destination policy; reject external, malformed, oversized, privileged and stale-generation paths |
| `features/ui/index.tsx::handleHotkeyBack` | `history.push('/')` when browser history length is one; otherwise `history.goBack()` | static fallback | static route; browser history shape decides branch | ordinary application route | preserve modal/nested-view semantics and deterministic root fallback |
| `handleHotkeyGoToHome` | `history.push('/')` | static | constant | authenticated shortcut registration | canonical static route builder test |
| `handleHotkeyGoToNotifications` | `history.push('/notifications')` | static | constant | authenticated route | capability/account transition test |
| `handleHotkeyGoToFavourites` | ``history.push(`/@${account.username}/favorites`)`` | entity-derived from active account | account presence checked; path-segment encoding is not visible | active account only | typed profile collection builder; usernames containing reserved or encoded characters |
| `handleHotkeyGoToPinned` | ``history.push(`/@${account.username}/pins`)`` | entity-derived from active account | account presence checked; path-segment encoding is not visible | active account only | same typed-builder and stale-account tests |
| `handleHotkeyGoToProfile` | ``history.push(`/@${account.username}`)`` | entity-derived from active account | account presence checked; path-segment encoding is not visible | active account only | typed profile builder; account-switch fencing |
| `handleHotkeyGoToBlocked` | `history.push('/blocks')` | static | constant | authenticated | canonical static route builder |
| `handleHotkeyGoToMuted` | `history.push('/mutes')` | static | constant | authenticated | canonical static route builder |
| `handleHotkeyGoToRequests` | `history.push('/follow_requests')` | static | constant | authenticated | canonical static route builder |
| `handleGoToCompose` | dispatches compose state then `history.push('/statuses/compose')` | static plus stateful transition | constant destination; compose state changes first | active account and composer state | atomic navigation/compose transition; cancellation and account-switch tests |
| compatibility `Redirect` entries in `SwitchingColumnsArea` | Mastodon, Pleroma, Gab and Soapbox paths map to canonical routes | compatibility; route params and selected query strings | React Router parameter substitution; two redirects preserve the current search string wholesale | target may be capability- or role-gated | generated conformance tests for ordering, exactness, parameters and allowed query preservation |
| `WrappedRoute` anonymous failure path | writes encoded pathname/query to `soapbox:redirect_uri`, then redirects to `/login` | session continuation from current location | URL encoding occurs; key spelling differs from the verified consumer key | intended to survive authentication but currently appears disconnected from the consumer | remove dead key or migrate atomically; regression test proving the same key is written and consumed |
| `utils/redirect.ts::cacheCurrentUrl` | writes encoded pathname/query to `soapbox:redirect-uri` | session continuation from current location | uses `encodeURIComponent`; no expiry, origin or account-generation metadata | consumed by login/verification flows | versioned continuation object with same-origin validation, expiry and generation binding |
| `utils/redirect.ts::getRedirectUrl` | reads/decodes/removes `soapbox:redirect-uri`, defaulting to `/` | session continuation from persisted storage | decode is attempted without a local malformed-value recovery boundary | consumed after authentication/verification | malformed encoding fallback, size bound, destination validation and one-time consumption tests |
| `utils/redirect.ts::useCachedLocationHandler` | removes `soapbox:redirect-uri` on `beforeunload` | lifecycle cleanup | only browser unload is covered | does not prove logout, switch or crash purge | deterministic transition purge independent of unload delivery |
| share-target worker | redirects to `/statuses/compose?text=...` | worker-originated; externally supplied shared text | query encoding is present in the verified path; bounded length is not established | destination should bind to the account selected at consumption time | typed share-intent payload, size limits and stale-account tests |
| notification click handling | focuses/opens a client or navigates a stored URL | worker/external-influenced notification payload | same-origin and route allowlisting are not established at the documented boundary | notification may be stale, deleted or belong to another account | same-origin allowlist, account binding, deleted-resource fallback and privileged-route rejection |
| root `BrowserRouter` | applies `basename={BuildConfig.FE_SUBDIRECTORY}` | router bootstrap | basename supplied by build configuration | all routes and workers | single normalizer that prevents double-prefixing and basename escape |

## Required destination policy

All programmatic navigation must converge on one policy boundary that:

- accepts only explicit internal destinations unless an external-navigation API is intentionally invoked;
- normalizes against `FE_SUBDIRECTORY` without double-prefixing or escaping the configured basename;
- rejects protocol-relative, absolute external, backslash-confused, control-character and encoded-traversal inputs;
- preserves only destination-specific allowlisted query parameters and fragments;
- bounds destination and query-string length;
- constructs entity-derived routes using encoded typed parameters rather than string concatenation;
- associates continuation and worker destinations with account and session generation;
- permits worker destinations only through an allowlisted message contract;
- distinguishes privileged administrator/developer surfaces from ordinary routes;
- emits safe rejection reason codes without logging credentials, private content or full sensitive URLs;
- falls back deterministically to a safe route when a requested destination is invalid.

## Canonical replacement ownership

| Concern | Accepted owner |
|---|---|
| Internal destination validation | `NavigationPolicy` or equivalent application-layer service, independent of Framework7 components |
| Typed destination construction | canonical route builders generated or tested against the route manifest |
| Account/session fencing | account-transition coordinator and immutable session generation |
| Worker navigation | versioned worker message schema consumed only through the navigation policy |
| External links | explicit external-navigation API with safe opener/referrer behavior |
| Compatibility redirects | declarative manifest with generated conformance tests |
| Basename handling | one bootstrap normalizer shared by browser, worker and test paths |

## Known hazards confirmed by the inspected boundary

- entity-derived profile routes are assembled with raw template interpolation;
- the primary worker message listener accepts a path without visible destination validation;
- login continuation has a verified key mismatch: `WrappedRoute` writes `soapbox:redirect_uri`, while the actual cache/consume helper uses `soapbox:redirect-uri`;
- the consumed continuation key has no established expiry or account-generation binding and relies partly on `beforeunload` cleanup;
- compatibility redirects can preserve a complete query string;
- notification destinations are remotely influenced and cross a worker/client boundary;
- modal and back behavior depend on inherited browser/React Router history shape;
- route constants and redirect declarations are embedded in the primary UI switch rather than generated from one manifest.

## Required tests

Phase 3 must execute, at minimum:

- canonical builder tests for every typed destination in this matrix;
- same-origin and basename normalization tests;
- encoded traversal, protocol-relative, control-character and backslash-confusion cases;
- malformed and oversized worker-message destinations;
- notification click cases for external, privileged, stale-account and deleted-resource destinations;
- continuation-key spelling consistency, malformed percent encoding, one-time consumption, expiry, purge and cross-account rejection;
- capability-off and insufficient-role destinations;
- direct navigation, browser refresh, back/forward, modal continuity and PWA relaunch;
- every compatibility redirect, including parameter and query-string preservation;
- rollback to the inherited router with equivalent destination behavior.

## Executable repository-wide inventory gate

The broader routing gate requires a checked-in, reproducible inventory command rather than a prose claim. It must scan application and worker source for at least:

- React Router imports and `useHistory`/history methods;
- `Redirect`, `Link`, `NavLink`, route definitions and route-builder helpers;
- `window.location`, `location.assign`, `location.replace` and `window.open`;
- service-worker `clients.openWindow`, client focus and navigation messages;
- notification destination creation, persistence and consumption;
- OAuth callback and authentication continuation paths;
- all browser persistence keys used to write, read or remove navigation continuation state.

The command must produce stable file/symbol output, exclude generated/vendor files explicitly, fail when unclassified call sites are introduced, and be exercised in CI. Until that executable report exists, this document must not be represented as a repository-wide exhaustive list.

## Phase 1 and Phase 3 routing handoff

- correction/migration of the continuation-key mismatch and deterministic transition purge;
- accessibility focus ownership for route transitions.

## Phase status

The source-backed classification, repository-wide discovery, deployment rewrite inventory, and route tests close the Phase 0 routing gate. Framework7 implementation must preserve those authorities and explicitly resolve the remaining continuation-key and transition-focus design debt.
