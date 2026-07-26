# Route and Compatibility Manifest

Status: **Current supporting evidence / Phase 0 closed**

Last updated: 2026-07-23

## Purpose

This document records the verified top-level and primary application routing surface that must be preserved while Mangane introduces a Framework7 application shell. It distinguishes canonical frontend routes, public and authentication layouts, capability-gated routes, compatibility redirects, backend-owned basename conflicts and unresolved route ownership.

This is a bounded source-backed manifest. It covers the root router in `app/soapbox/containers/soapbox.tsx`, the primary application switch in `app/soapbox/features/ui/index.tsx`, and the shared wrapper in `app/soapbox/features/ui/util/react_router_helpers.tsx`. It does not claim that every nested feature router, imperative navigation call, link generator, server rewrite, deployment proxy or historical route has been enumerated.

## Router ownership and bootstrap

| Concern | Verified current behavior | Risk or migration consequence |
|---|---|---|
| Root router | `BrowserRouter` is mounted with `basename={BuildConfig.FE_SUBDIRECTORY}` | Framework7 routing must preserve subdirectory deployments and cannot assume root hosting |
| Root route ordering | Root redirects and public/auth layouts run before the catch-all UI route | Route order is behavior; moving catch-all routes earlier can shadow authentication and public pages |
| Main application switch | `SwitchingColumnsArea` owns the primary authenticated/public application route matrix through `WrappedRoute`, `Redirect` and a final not-found route | Shell migration must preserve first-match semantics and wrapper authorization behavior |
| Shared route wrapper | `WrappedRoute` performs account/role authorization, login redirection, lazy loading and standard loading/error/forbidden projections | Framework7 routes need one equivalent policy boundary rather than duplicated guards |
| Scroll restoration | `react-router-scroll-4` owns scroll decisions and suppresses restoration changes for modal-key transitions | Framework7 navigation must reproduce or deliberately migrate scroll and modal continuity |
| Startup gate | Initial account, instance and configuration loading completes or fails before the route body is shown | Route-level degraded behavior depends on startup state and must not be mistaken for route absence |
| Onboarding and waitlist | Onboarding can replace the normal router body; a waitlisted account can replace all ordinary routes | These are application state gates, not ordinary pages, and require explicit migration tests |

## Root route manifest

| Path or rule | Owner/layout | Access or condition | Verified behavior | Status |
|---|---|---|---|---|
| `/v1/verify_email/:token` | root redirect | all | redirects to `/verify/email/:token` | Compatibility redirect |
| `/signup` ↔ `/verify` | root redirect | depends on Pepe extension | canonical signup entry changes with instance configuration | Capability/configuration-dependent |
| `/` | `PublicLayout` | unauthenticated | renders public landing/home behavior; single-user mode may redirect to configured profile | Public current |
| `/about/:slug?` | `PublicLayout` | all | public informational route | Public current |
| `/mobile/:slug?` | `PublicLayout` | all | public mobile/custom informational route | Public current |
| `/login` | `AuthLayout` | all | authentication route family | Public authentication |
| `/signup` | `AuthLayout` | account creation and registrations enabled | registration route | Capability-gated |
| `/verify` | `AuthLayout` | Pepe extension enabled | verification route family | Configuration-gated |
| `/reset-password` | `AuthLayout` | all | password reset route | Public authentication |
| `/edit-password` | `AuthLayout` | all | password-edit route | Public authentication |
| `/invite/:token` | `AuthLayout` | all | invitation route | Public authentication |
| `/` catch-all | `UI` | after root gates | enters primary application switch | Current catch-all |

## Primary canonical application routes

### Session, home and timelines

| Path | Component/surface | Access or capability | Notes |
|---|---|---|---|
| `/authorize_interaction` | authorize interaction | wrapper default | exact |
| `/email-confirmation` | email confirmation | public | exact |
| `/logout` | logout page | public | exact |
| `/` | home timeline | wrapper default | exact; primary application home |
| `/timeline/local` | community timeline | public; federating | exact |
| `/timeline/fediverse` | public/federated timeline | public; federating | exact |
| `/timeline/bubble` | bubble timeline | public; federating and bubble capability | exact |
| `/timeline/:instance` | remote timeline | federating | exact; instance parameter requires trust and capability review |
| `/conversations` | conversations | conversations capability | authenticated by wrapper default |

### Discovery and personal collections

| Path | Component/surface | Access or capability |
|---|---|---|
| `/tag/:id` | hashtag timeline | public |
| `/lists` | lists | lists capability |
| `/list/:id` | list timeline | lists capability |
| `/bookmarks` | bookmarks | bookmarks capability |
| `/notifications` | notifications | wrapper default |
| `/search` | search | wrapper default |
| `/suggestions` | follow recommendations | public; suggestions capability |
| `/directory` | profile directory | public; directory capability |
| `/follow_requests` | follow requests | wrapper default |
| `/followed_hashtags` | followed hashtags | wrapper default |
| `/blocks` | blocks | wrapper default |
| `/domain_blocks` | domain blocks | federating capability |
| `/mutes` | mutes | wrapper default |
| `/filters` | filters | filters capability |

### Profiles and statuses

| Path | Component/surface | Access or capability | Notes |
|---|---|---|---|
| `/@:username` | account timeline/profile | public only when authenticated-profile mode is not required | exact |
| `/@:username/with_replies` | account timeline with replies | same public rule | — |
| `/@:username/followers` | followers | same public rule | — |
| `/@:username/following` | following | same public rule | — |
| `/@:username/media` | account gallery | same public rule | — |
| `/@:username/tagged/:tag` | tagged account timeline | wrapper default | exact |
| `/@:username/favorites` | favourited statuses | wrapper default | spelling is compatibility-sensitive |
| `/@:username/about` | profile fields | wrapper default | — |
| `/@:username/pins` | pinned statuses | wrapper default | — |
| `/@:username/posts/:statusId` | status detail | public | exact; canonical profile-scoped post route |
| `/statuses/:statusId` | status detail | wrapper default | exact; alternate canonical application route |
| `/statuses/compose` | composer | wrapper default | exact; also used by the share-target redirect |
| `/scheduled_statuses` | scheduled posts | scheduled-status capability | — |

### Settings, administration and development

| Path family | Access or capability | Verified owner |
|---|---|---|
| `/settings/profile`, `/settings/email`, `/settings/account`, `/settings/media_display`, `/settings/mfa`, `/settings/tokens`, `/settings` | wrapper default | account settings surfaces |
| `/settings/password` | hidden when LDAP is enabled | password settings |
| `/settings/export` | export capability | export data |
| `/settings/import` | import capability | import data |
| `/settings/aliases` | aliases capability | account aliases |
| `/settings/migration` | account-moving capability | account migration |
| `/settings/backups` | backups capability | backups |
| `/soapbox/config` | administrator only | frontend configuration |
| `/soapbox/admin`, `/soapbox/admin/approval`, `/soapbox/admin/reports`, `/soapbox/admin/log`, `/soapbox/admin/users` | staff only | administrative surfaces |
| `/developers` | route itself is not marked developer-only | developer index |
| `/developers/apps/create`, `/developers/settings_store`, `/developers/timeline` | developer-only | developer tools |
| `/error`, `/error/network` | developer-only | intentional failure routes |
| `/info` | wrapper default | server information |
| `/donate/crypto` | public; configured crypto addresses required | crypto donation |
| `/federation_restrictions` | public; federating | federation restrictions |
| `/share` | wrapper default | exact; in-app share surface |

## Compatibility redirect manifest

These redirects are part of current external compatibility and deep-link behavior. They must not be removed merely because a new shell uses different internal route names.

### Mastodon-compatible routes

- `/web/:path1/:path2/:path3` → `/:path1/:path2/:path3`
- `/web/:path1/:path2` → `/:path1/:path2`
- `/web/:path` → `/:path`
- `/timelines/home` → `/`
- `/timelines/public/local` → `/timeline/local`
- `/timelines/public` → `/timeline/fediverse`
- `/timelines/direct` → `/conversations`
- `/admin` → `/soapbox/admin`
- `/terms` → `/about`
- `/settings/preferences` → `/settings`
- `/settings/two_factor_authentication_methods` → `/settings/mfa`
- `/settings/otp_authentication` → `/settings/mfa`
- `/settings/applications` → `/developers`
- `/auth/edit` → `/settings`
- `/auth/confirmation` → `/email-confirmation` while preserving the query string
- `/auth/reset_password` → `/reset-password`
- `/auth/edit_password` → `/edit-password`
- `/auth/sign_in` → `/login`
- `/auth/sign_out` → `/logout`

### Pleroma frontend routes

- `/main/all` → `/timeline/fediverse`
- `/main/public` → `/timeline/local`
- `/main/friends` → `/`
- `/tags/:id` → `/tag/:id`
- `/user-settings` → `/settings/profile`
- `/notice/:statusId` renders the status route directly
- `/users/:username/statuses/:statusId` → `/@:username/posts/:statusId`
- `/users/:username/chats` → `/chats`
- `/users/:username` → `/@:username`
- `/registration` → `/`
- `/registration/:token` → `/invite/:token`

### Gab and Soapbox legacy routes

- `/home` → `/`
- `/@:username/:statusId` → `/@:username/posts/:statusId`
- `/canary` and `/canary.txt` → `/about/canary`
- `/auth/external` → `/login/external`
- `/auth/mfa` → `/settings/mfa`
- `/auth/password/new` → `/reset-password`
- `/auth/password/edit` → `/edit-password` while preserving the query string

## Reserved basename and backend-conflict rule

The primary route source explicitly warns that Mastodon and Pleroma route some basenames to the backend. New frontend routes must therefore:

1. avoid a basename already owned by a supported backend;
2. use a frontend-safe canonical basename;
3. preserve a redirect from the backend-compatible path where required;
4. be tested under direct hosting, reverse proxying and `FE_SUBDIRECTORY` deployment;
5. distinguish browser navigation routes from API or server-rendered routes.

The complete reserved-basename list is not yet source-backed. Its absence is a blocker for adding or renaming top-level routes during Phase 3.

## Verified `WrappedRoute` authorization contract

The shared wrapper accepts `publicRoute`, `staffOnly`, `adminOnly` and `developerOnly`, with all flags defaulting to false.

Authorization is the conjunction of:

- an authenticated account or `publicRoute`;
- developer mode in settings for `developerOnly`;
- `account.staff` for `staffOnly`;
- `account.admin` for `adminOnly`.

When authorization fails:

- an anonymous user has the current pathname and query string URL-encoded and persisted under `localStorage['soapbox:redirect_uri']`, then receives a redirect to `/login`;
- an authenticated user who fails a role or developer check receives the standard forbidden column instead of a redirect.

When authorization succeeds, `WrappedRoute` lazy-loads the route bundle. Page-backed routes render through the specified page component; routes without a page render through `ColumnsArea`. Loading, forbidden and bundle-error states use standard layout projections.

Security and migration consequences:

- the redirect key is another browser persistence and URL-bearing surface requiring validation, expiry and purge classification;
- authorization is presentation gating, not proof of backend authorization;
- the `/developers` index is not itself marked `developerOnly`, while its child tool routes are;
- the replacement shell must preserve anonymous return-to behavior without permitting open redirects or stale cross-account destinations;
- role failures must not leak private content while rendering loading or error states.

Capability conditions currently include federating, bubble timeline, conversations, lists, bookmarks, suggestions, profile directory, filters, scheduled statuses, export/import, account aliases, account moving and backups. Configuration conditions include registrations, Pepe verification, LDAP, single-user mode, authenticated profile mode and configured crypto addresses.

## Imperative navigation and worker boundary

The primary UI also performs navigation outside declarative routes:

- service-worker messages with `type === 'navigate'` call `history.push(data.path)` without a route policy visible at this call site;
- keyboard shortcuts push Home, Notifications and account-derived profile collection paths;
- browser-back handling falls back to `/` when history length is one;
- the share-target worker redirects to `/statuses/compose?text=...`;
- notification click handling may open or navigate a stored URL.

A later URL and navigation policy must validate worker-provided and notification-provided destinations before navigation and must preserve `FE_SUBDIRECTORY` behavior.

## Migration invariants for the Framework7 shell

1. Preserve every verified canonical path or provide an explicit tested redirect.
2. Preserve first-match ordering and exact/non-exact semantics.
3. Preserve public, authenticated, staff, administrator and developer access behavior.
4. Preserve capability-gated absence and degraded states; do not render unsupported routes as generic failures.
5. Preserve query strings for confirmation and password-edit redirects.
6. Preserve deep links, browser refresh, back/forward navigation and PWA relaunch.
7. Preserve single-user, waitlist and onboarding route interception.
8. Preserve subdirectory hosting and avoid backend-owned basenames.
9. Prevent worker or notification messages from navigating to unvalidated external or privileged destinations.
10. Preserve safe return-to-login behavior while expiring or rejecting stale, external and cross-account redirect destinations.
11. Keep the legacy router available behind a rollback seam until route-conformance tests pass.

## Required tests

The Phase 3 gate requires at minimum:

- route conformance tests generated from a canonical manifest;
- anonymous, authenticated, waitlisted, onboarding, staff, administrator and developer fixtures;
- every capability condition on and off;
- exact-route and route-order collision tests;
- all compatibility redirects, including parameter and query-string preservation;
- `FE_SUBDIRECTORY` deployments;
- direct navigation, browser refresh, back/forward and PWA relaunch;
- anonymous return-to-login behavior, malformed persisted destinations and cross-account stale redirects;
- worker and notification navigation with malformed, external, privileged and oversized destinations;
- backend basename conflicts and reverse-proxy behavior;
- not-found behavior without leaking protected route existence;
- focus and scroll restoration across route, modal and shell transitions.

## Remaining inventory

This bounded manifest remains incomplete until Phase 0 additionally enumerates:

- all nested or feature-local routers;
- all `history.push`, `history.replace`, `Redirect`, `Link`, `NavLink` and route-generation helpers;
- complete reserved backend paths and deployment rewrite rules;
- server-rendered, API, OAuth callback, share-target and notification destination ownership;
- lifecycle, validation and deletion of `soapbox:redirect_uri`;
- route analytics, telemetry and referrer behavior;
- accessibility focus ownership for every route transition;
- test coverage and actual baseline outcomes.

## Phase status

This document establishes the initial canonical route and compatibility manifest required before Framework7 shell implementation. It completes a bounded Phase 0 routing artifact, not the broader routing gate or Phase 0.
