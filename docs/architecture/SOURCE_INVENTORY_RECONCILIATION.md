# Source Inventory Reconciliation

Status: **Current / Phase 0 in progress**

Last updated: 2026-07-23

## Purpose

This document reconciles the first successful full-tree run of `scripts/architecture-inventory.js` into reviewable Phase 0 work queues. It is derived from the GitHub Actions artifact generated for commit `03b1b9235f9130d97f1b70669498a61d58d05d34` by workflow run `30054275765`.

The generated scanner output is a candidate inventory, not a safety verdict. Counts include production code, tests, mocks, and the scanner itself. Every production finding still requires source-level review and classification.

## Reproducible baseline

- Source roots: `app`, `webpack`, `scripts`
- Supported source extensions: JavaScript and TypeScript variants
- Source files scanned: **865**
- Output schema: **1**
- Determinism check: **passed in GitHub Actions**
- Schema/path validation: **passed in GitHub Actions**
- Artifact digest: `sha256:26be0638752012d1f73edfe4fc8a6f5d468d6dd9c6bbee32efea50304b664386`

## Category totals

| Category | Candidate matches | Immediate Phase 0 disposition |
|---|---:|---|
| `html.dangerouslySetInnerHTML` | 49 | Reconcile every production sink with content origin, sanitizer, URL policy, and adversarial tests |
| `html.innerHTML` | 10 | Separate parser/transformer use from rendering sinks; never infer sanitization from transformation |
| `network.axios` | 81 | Build client/call-site matrix with auth, backend family, cancellation, retry, errors, and sensitive output |
| `network.fetch` | 3 | Review audio, push-worker, and test usage separately |
| `reactQuery.useQuery` | 3 | Two production modules currently verified; one scanner test fixture |
| `reactQuery.useMutation` | 1 | Scanner test fixture; no production mutation was identified by the current narrow rule |
| `reactQuery.invalidateQueries` | 1 | Scanner test fixture; production invalidation remains unverified |
| `reactQuery.clear` | 2 | Production account purge and emergency reset are source-bound by the React Query and persistence authority gates |
| `storage.localStorage` | 53 | Reconcile auth, redirects, onboarding, verification, settings, language, GDPR, and error recovery |
| `storage.sessionStorage` | 7 | Reconcile auth, scroll restoration, and error recovery |
| `storage.localForage` | 10 | Nine matches in `storage/kv_store.ts`; document schema, account scope, migration, purge, and corruption handling |
| `storage.indexedDB` | 1 | Scanner rule self-match; direct production IndexedDB access was not proven by this rule |
| `stream.websocket` | 4 | All candidates are in `app/soapbox/stream.ts`; document lifecycle, auth, reconnection, cancellation, and account switching |
| `worker.notification` | 58 | Contains domain-type and test false positives; production worker/UI notification paths require manual classification |
| `worker.serviceWorker` | 12 | Reconcile registration, push registration, UI access, error recovery, scope, update, and teardown |

## Priority work queues

### 1. Remote content and HTML safety

The first run identified broad rendering exposure across account, profile, status, quote, poll, notification, onboarding, admin, conversation, and custom-page surfaces.

The highest-priority production files include:

- `app/soapbox/components/status_content.tsx`
- `app/soapbox/components/status.tsx`
- `app/soapbox/components/quoted-status.tsx`
- `app/soapbox/components/account.tsx`
- `app/soapbox/features/status/components/detailed-status.tsx`
- `app/soapbox/features/status/components/card.tsx`
- `app/soapbox/features/ui/components/profile_fields_panel.tsx`
- `app/soapbox/features/ui/components/profile_info_panel.tsx`
- `app/soapbox/features/admin/components/report.tsx`
- `app/soapbox/features/about/index.tsx`

Required reconciliation fields are content origin, trust boundary, transformer, sanitizer, allowed schemes, link/referrer policy, CSP/sandbox interaction, and adversarial coverage.

### 2. Authentication, persistence, and account isolation

Production localStorage candidates include OAuth/consumer auth, external auth, verification, onboarding, auth reducer state, redirects, settings, language preference, GDPR state, router helpers, and emergency reset behavior.

This queue must establish:

- whether each value is sensitive, account-scoped, instance-scoped, shared public state, or device preference;
- its exact key and schema;
- all writers and readers;
- logout and account-switch purge behavior;
- stale async response behavior after purge;
- migration, corruption, quota, and rollback handling.

No localStorage finding may be considered safe merely because it is longstanding or small.

### 3. API and protocol capability surface

Axios is referenced across a large inherited action surface, including accounts, authentication, administration, timelines, notifications, search, compose, reports, polls, interactions, moderation, groups, lists, aliases, verification, and onboarding.

The scanner records lexical references, not actual endpoints. The next API inventory must resolve each production module into:

- central client or direct transport use;
- endpoint and HTTP method;
- Akkoma, Pleroma, Mastodon-compatible, version-dependent, or configuration-dependent behavior;
- authentication and sensitive response fields;
- pagination, retries, cancellation, upload behavior, and error mapping;
- consumers and duplicate Redux/React Query ownership.

### 4. React Query authority

The full-tree executable scan verifies production query calls in:

- `app/soapbox/queries/carousels.ts`
- `app/soapbox/queries/trends.ts`
- `app/soapbox/queries/suggestions.ts`

It also verifies account-purge cancellation and clearing in `app/soapbox/persistence/purge.ts`. This materially narrows the current production surface but does **not** prove the absence of aliased imports, wrappers or dynamic access that the scanner does not recognize.

All three production queries still require account/instance scoping, key-factory ownership, cache lifetime, invalidation, stale-response, account-switch and Redux-overlap decisions. Logout cancellation/clear is implemented; generation fencing and scoped preservation are not.

### 5. Streaming, service worker, and notifications

`app/soapbox/stream.ts` contains all WebSocket candidates. Service-worker references span application bootstrap, push registration, notifications, UI access, and emergency reset behavior.

The Phase 0 matrix must document:

- token visibility and transport;
- connection/reconnection ownership;
- exponential backoff and upper bounds;
- cancellation and teardown;
- account and instance transition behavior;
- duplicate/out-of-order event handling;
- worker scope, update, rollback, and cache implications;
- notification payload sensitivity and persistence.

## Reviewed exclusions and scanner self-matches

The following classes must not be silently counted as production behavior:

- `scripts/architecture-inventory.js` contains rule literals that match its own scanner expressions;
- `scripts/__tests__/architecture-inventory.test.js` intentionally contains representative fixtures;
- `app/soapbox/__mocks__/api.ts` and `__tests__` files are test infrastructure;
- broad lexical terms such as `Notification` may match domain types, component names, selectors, and tests rather than browser Notification API calls.

These are reviewed exclusions only for the specific baseline. The scanner should eventually emit source-kind metadata or support deterministic include/exclude views without deleting raw evidence.

## Known limitations

This baseline does not yet inventory:

- files outside `app`, `webpack`, and `scripts`;
- CSS/Sass, templates, manifests, lockfiles, workflows, generated assets, and non-JS configuration;
- aliased or wrapped API usage that does not contain the current lexical patterns;
- route definitions, Redux reducers/actions/selectors, icon imports, accessibility primitives, or protocol endpoints as structured records;
- whether a matched call is reachable in a production build;
- whether remote HTML is sanitized before reaching a rendering sink.

Therefore this document advances Phase 0 from unknown to reproducible candidate evidence, but it does not satisfy the complete repository inventory exit criterion.

## Next required outputs

1. Sanitization and URL-safety sink matrix from the production HTML candidates.
2. Browser persistence and account-isolation matrix from production storage candidates.
3. API/capability matrix from production network candidates.
4. React Query key and authority matrix for the three verified production query modules and logout lifecycle operation.
5. Stream/service-worker/notification lifecycle matrix.
6. Scanner source-kind classification so raw evidence and production-focused views remain deterministic and auditable.
