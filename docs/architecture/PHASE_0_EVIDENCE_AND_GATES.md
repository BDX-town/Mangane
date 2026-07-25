# Phase 0 Evidence Ledger and Completion Gates

Status: **Current / Phase 0 in progress**

Last updated: 2026-07-25

This document is the operational control plane for Phase 0. It prevents partial inspection from being mistaken for completion and makes every finding traceable to evidence, risk, a required output, and a later implementation phase.

It complements:

- [`CURRENT_STATE.md`](./CURRENT_STATE.md), which summarizes verified current behavior;
- [`SOURCE_INVENTORY.md`](./SOURCE_INVENTORY.md), which records verified source architecture;
- [`SECURITY_RUNTIME_INVENTORY.md`](./SECURITY_RUNTIME_INVENTORY.md), which records HTTP, URL, push and share-target security boundaries;
- [`AUTH_PERSISTENCE_INVENTORY.md`](./AUTH_PERSISTENCE_INVENTORY.md), which records verified credential and browser-persistence behavior;
- [`CONTENT_SAFETY_AND_TEST_INVENTORY.md`](./CONTENT_SAFETY_AND_TEST_INVENTORY.md), which records verified HTML transformation and test-harness boundaries;
- [`IMPLEMENTATION_ROADMAP_V2.md`](./IMPLEMENTATION_ROADMAP_V2.md), which defines the canonical sequence.

## 1. Evidence standard

A Phase 0 claim must be classified as one of:

| Class | Meaning | Permitted use |
|---|---|---|
| Verified-current | Directly supported by repository source, configuration, tests, workflow, or reproducible runtime inspection | May drive Phase 1 design |
| Verified-absent | A complete scoped inventory demonstrates the behavior or subsystem is not present | May justify adding target capability |
| Accepted-target | Approved architecture, not current behavior | May guide future work but cannot be described as implemented |
| Historical | Earlier behavior or plan retained for context | Must not control implementation when it conflicts with canonical docs |
| Inferred | Strongly suggested but not directly proven | Must be labeled and verified before implementation depends on it |
| Unknown | Evidence is unavailable, incomplete, contradictory, or not yet inspected | Blocks dependent implementation |

Repository age, dependency presence, filenames, comments, and README claims are signals, not sufficient proof of runtime behavior by themselves.

## 2. Required evidence record

Every inventory entry must record:

1. subsystem and concern;
2. source path or reproducible command;
3. verified behavior;
4. account and instance scope;
5. persisted data or side effects;
6. failure and retry behavior;
7. security and privacy impact;
8. accessibility or interaction impact where applicable;
9. current owner;
10. target phase;
11. migration and rollback consequence;
12. confidence and remaining unknowns.

## 3. Phase 0 completion dashboard

| Workstream | Current evidence | Status | Completion gate | Blocks |
|---|---|---|---|---|
| Repository/build baseline | README, package manifest, webpack/bootstrap inspection | Partial | full tree, build variants, generated assets, environment behavior, reproducible command results | Phases 1, 3, 4 |
| Application bootstrap/providers | source-level entry and root-provider inspection | Substantial | error boundaries, initialization side effects, teardown, account switch, test coverage | Phases 1, 3 |
| Routing | root and main UI routing inspected | Partial | machine-readable route manifest, reserved path list, redirects, capability gates, auth/public ownership | Phase 3 |
| Redux | store, root reducer, logout whitelist, broad domain registry inspected | Partial | reducer/action/selector/persistence ownership matrix and duplication map | Phases 1, 7 |
| React Query | global client defaults, three direct query callsites and logout cancellation/clear statically enforced | Partial | aliases/wrappers, mutations, invalidations, account/instance scope, switching and late-response behavior | Phases 1, 5, 7 |
| Authentication | token creation, verification, persistence, logout and account switching substantially inspected; Phase 0C logout/account-removal purge and stale-actor isolation tests complete | Partial outside Phase 0C | remaining OAuth paths, refresh mismatch and callbacks | Phases 1, 4, 5, 6 |
| API/protocol clients | central Axios client inspected | Partial | all call sites, streaming, uploads, retries, cancellation, typed errors and capability matrix | Phases 1, 6 |
| Persistence | Complete generated callsite manifest plus 12-surface behavioral authority; ordered/resumable logout purge covers HTTP/stream generation fences, cross-tab propagation, query cache, Redux, serialized credentials, snapshots, owned caches, restart-durable worker revocation, push, notifications and tracked object URLs; bounded origin reset covers all browser stores and workers | Phase 0C complete | preserve drift gates and conformance tests during later migrations | Phases 4, 5, 6 |
| Service worker/PWA | production plugin, push and share-target handlers inspected | Partial | cache runtime, authenticated responses, push lifecycle, update rollback and scope-conflict tests | Phase 4 |
| Sanitization/content safety | 157 generated production callsites; DOMPurify 3.4.12 policy; 44 HTML sinks; central destination policy; raw card HTML blocked; sandboxed sanitized oEmbed; adversarial XSS/protocol corpus and CI drift gate | Phase 0D complete | preserve exact sanitizer, destination and sink-discovery gates during later rendering work | Phases 1, 8, 9, 29 |
| Telemetry/logging/redaction | 133 generated callsites; remote telemetry and Sentry removed; production diagnostics, source maps and Redux DevTools disabled; development redaction is bounded and hostile-object safe | Phase 0E complete | future telemetry remains blocked on explicit consent, opt-out, sampling, retention and deletion | Phases 1, 29, 31 |
| Design/icons/styles | 468 production component/supporting UI modules owned/classified; every style entry and icon callsite generated; keyboard/focus/gesture/motion/a11y callsites inventoried; duplicate authorities explicit; global reduced-motion and labeled live-region baselines executable | Phase 0F complete | preserve drift gates; execute privacy-safe browser screenshot, contrast, target-size and interaction baselines in Phase 0G/2 | Phase 2 |
| Tests/CI | package scripts and Jest configuration inspected | Partial | workflows, jobs, setup files, browser/worker coverage, flake behavior and baseline outcomes | Every phase |
| Dependencies/licenses | complete lockfile and direct-root inventory, licenses, install/native/network behavior, action uses, live advisory snapshot, high/critical reachability dispositions and replacement queue | Substantial; remediation open | resolve runtime/trusted-install P0 items, TaffyDB license conflict, unverified direct declarations and non-SHA action refs | Phases 0, 29, 31 |
| Documentation/history | canonical target docs identified | Partial | old roadmaps and architecture docs classified and requirement-mapped | Every phase |
| Backend capability matrix | feature-gating behavior verified conceptually | Blocked | endpoint and capability matrix for Akkoma, Pleroma and Mastodon-compatible servers | Phases 1, 8–11 |

No row marked **Blocked** may be silently treated as complete.

## 4. Security-critical inventories

### 4.1 Account and instance isolation

The inventory must follow one identity through login, token creation and persistence, account loading, Redux, React Query, browser storage, service-worker caches, media URLs, notifications, push, streams, drafts, logout, account switching, instance switching, reload and worker upgrade.

Required proof:

- an account A to account B transition cannot expose A data;
- an instance A to instance B transition cannot reuse incompatible capabilities or records;
- logout revokes or removes all locally controlled sensitive state;
- shared public data is explicitly classified;
- stale responses cannot repopulate a cleared scope;
- persistent caches have versioned keys and purge rules;
- bearer tokens do not remain in notification data, URLs, query keys, logs or telemetry.

### 4.2 Authentication material

Inventory token types, scopes, storage, redirect validation, expiry, refresh, revocation, multi-account records, error/log exposure, URL exposure, worker visibility, notification persistence and test fixtures.

Any raw token in logs, telemetry, URLs, analytics, crash reports, Redux DevTools, query keys, notifications or unencrypted export is a release blocker.

### 4.3 Remote content and URL safety

The Phase 0D generated manifest inventories remote HTML, profile fields, status content, custom pages, previews, embeds, SVG/MathML policy, redirect targets and external destinations. Attachment metadata, object URLs and clipboard/share-target data remain governed by their Phase 0B/0C inventories.

Each HTML sink records its sanitizer/wrapper classification and source position. DOMPurify owns the explicit tag, attribute and scheme policy; links receive opener/referrer hardening; oEmbed uses an empty sandbox; CSP is deployment defense in depth. Shared parsing and transformation helpers remain explicitly classified as non-sanitizers.

## 5. State-authority matrix template

| Domain | Canonical current owner | Secondary copies | Persistence | Account scope | Instance scope | Invalidation | Logout behavior | Target owner | Removal phase |
|---|---|---|---|---|---|---|---|---|---|

Duplicated ownership must document source of truth, synchronization, conflict behavior, cutover, rollback and deletion phase.

## 6. React Query inventory template

| Module | Operation | Key factory | Account scope | Instance scope | Input normalization | Cache lifetime | Invalidation | Retry/cancel | Redux overlap | Sensitive data | Disposition |
|---|---|---|---|---|---|---|---|---|---|---|---|

Required conclusions include scoped keys, owned factories, mutation rollback, cancellation before purge, stale-response protection, explicit infinite-cache lifecycle and intentional Redux overlap.

## 7. API and capability inventory template

| Client/module | Backend family | Endpoint/transport | Auth | Pagination | Retry policy | Cancellation | Error mapping | Capability gate | Sensitive output | Consumers |
|---|---|---|---|---|---|---|---|---|---|---|

The final matrix must distinguish standard Mastodon-compatible, Akkoma-specific, Pleroma-specific, version-dependent, configuration-dependent and unverified behavior.

## 8. Persistence and worker inventory template

| Store/cache/worker | Technology | Key/schema | Data classes | Scope | Writer | Readers | Migration | Purge | Quota/corruption | Offline behavior |
|---|---|---|---|---|---|---|---|---|---|---|

Required stores include localForage, IndexedDB, localStorage, sessionStorage, Cache Storage, worker globals, notification data, singleton caches, object URLs, stream state, push subscriptions and share-target payloads.

## 9. Presentation and interaction inventory template

| Primitive/surface | Implementation | Styling owner | Icon source | Motion/gesture | Keyboard | Focus behavior | Reduced motion | Screen reader behavior | Target phase |
|---|---|---|---|---|---|---|---|---|---|

The final inventory must preserve reduced motion, underlined links, dyslexic font, demetrication, generated themes, dark mode, shortcuts, deep links, non-gesture alternatives and focus restoration.

Phase 0F provides this as generated `config/design-component-authority-inventory.json`, the component ownership projection, six presentation evidence documents, and the dedicated design-authority CI gate. Generated counts are reviewed from the manifest rather than copied as permanent assertions in this ledger.

## 10. Test and CI evidence

Phase 0 must record every workflow and trigger, runtime/package-manager versions, caches/artifacts, required jobs, lint/type/unit/integration/build/browser/accessibility/worker/security coverage, secrets and permissions, fork behavior, flaky tests, baseline outcomes and gaps between scripts and CI.

A package script existing does not prove CI runs it. Security-sensitive worker behavior must receive direct tests even where the current Jest coverage configuration excludes the worker entry.

## 11. Documentation reconciliation ledger

Every architecture, roadmap, history, contribution, deployment, customization and subsystem document must be classified before removal or supersession.

## 12. Previous-phase requirement mapping

| Prior requirement | Canonical destination | Roadmap phase | Status |
|---|---|---|---|
| Framework7 adaptive shell | Technical architecture/design system | Phase 3 | Preserved |
| Phosphor semantic icon registry | Design system | Phase 2 | Preserved |
| Hybrid lexical/semantic search lessons | Search architecture | Phases 12–17 | Preserved |
| Gist cards | Search/design architecture | Phase 21 | Preserved |
| Composer context | Search/intelligence architecture | Phase 24 | Preserved |
| AI interpolator | Search/intelligence architecture | Phase 25 | Preserved |

This map must be expanded from all discoverable historical material.

## 13. Exit checklist

- [ ] Complete repository tree inventory committed.
- [ ] Feature and route/capability manifests committed.
- [ ] Redux authority and duplication matrix committed.
- [ ] React Query key/mutation/invalidation matrix committed.
- [ ] Authentication and account-switch lifecycle committed.
- [x] API, retry, streaming, upload and feature-detection inventory committed; shared transport hardening remains queued for Phase 1.
- [x] Persistence, cache, object URL, migration, purge, worker and notification inventory plus conformance gates committed; share-target safety remains separately tracked.
- [x] Sanitization, URL, redirect, preview and embed safety inventory committed; upload transfer remains governed by Phase 0B.
- [x] Telemetry, logging, consent, opt-out, redaction, source-map and artifact inventory committed.
- [ ] Icon, component, style, motion, keyboard and accessibility inventory committed.
- [ ] Tests and CI workflow inventory with baseline outcomes committed.
- [x] Dependency health, advisory, reachability and license inventory committed; remediation blockers remain tracked in the replacement queue.
- [ ] Historical documents classified and prior requirements mapped.
- [ ] Every major subsystem has a current owner, target owner, status and target phase.
- [ ] Unknowns are resolved or explicitly accepted as blockers.
- [ ] PR description and canonical documents match the evidence.

Until every item is resolved, the Phase 0 pull request must remain a draft and must not claim completion.
