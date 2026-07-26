# Mangane Verified Current State

Status: **Canonical verified current state / Phase 0 closed**

Last updated: 2026-07-23

This document records verified repository behavior and known unknowns before modernization begins. It is intentionally distinct from accepted-target architecture. A claim belongs here only when supported by the current repository or a reproducible inspection.

Operational completion tracking, evidence standards, inventory templates, and exit gates live in [`PHASE_0_EVIDENCE_AND_GATES.md`](./PHASE_0_EVIDENCE_AND_GATES.md). That ledger is authoritative for whether Phase 0 is complete.

## 1. Repository baseline

Verified current baseline:

- React 17 mounted with `ReactDOM.render`;
- webpack 5 build;
- React Router 5 with extensive compatibility-sensitive routes;
- Redux Toolkit plus `redux-immutable` with more than fifty mixed domains;
- one global React Query client with one-minute stale time and infinite cache lifetime;
- Axios API clients with bearer authentication and broad base-URL selection;
- `@lcdp/offline-plugin` service worker;
- OAuth application, password-grant, MFA, verification, multi-account and logout flows;
- authentication state persisted in JavaScript-readable `localStorage`;
- selected-account identity persisted in `sessionStorage`;
- account snapshots persisted through localForage/IndexedDB;
- existing accessibility preferences, generated themes, keyboard shortcuts and legacy deep links.

## 2. Verified security-sensitive behavior

### Browser credentials

The authentication reducer serializes application registration data, client secrets, application tokens, user tokens and token/account indexes into browser storage. Legacy credential keys may remain after migration.

### Push notifications

The push worker receives bearer tokens in push payloads, stores tokens in native-notification data and reuses them for notification actions. This is a critical credential-lifetime and account-scope boundary.

### Share target

The share-target worker accepts POST requests whose URL contains `/share`, reads form fields and redirects the composed text through a URL query parameter. Exact route ownership, field limits, origin and content-type validation remain unverified.

### HTML transformation

Shared HTML helpers assign supplied strings through detached-element `innerHTML`. They transform content but do not establish a complete sanitizer. One helper explicitly warns that unsafe HTML can remain.

### Test boundary

The current Jest harness runs in jsdom and excludes the service-worker entry from coverage. Package scripts do not themselves establish browser, accessibility, worker-security, dependency-audit or migration coverage.

## 3. Current high-priority risks

1. Plaintext browser persistence of application secrets and bearer tokens.
2. Bearer tokens retained inside native-notification data.
3. No verified purge boundary spanning Redux, React Query, browser storage, notifications, service-worker caches, streams and media.
4. Token selection and request destination are not represented by one explicit account-and-origin scope.
5. Infinite React Query cache lifetime without a complete account/instance key inventory.
6. Broad URL constructibility checks where strict protocol and origin policy is required.
7. HTML transformation helpers that may be mistaken for sanitization.
8. Worker input validation and lifecycle gaps.
9. Unverified Sentry consent, breadcrumb and redaction behavior.
10. Incomplete CI, browser, accessibility and security-test evidence.

## 4. Current versus target

The current inherited application is the compatibility base. Framework7, Phosphor, local-first canonical storage, hybrid search, local intelligence, composer context and interpolation are accepted targets and must not be described as current implementation.

Existing functionality must not be removed merely because it is absent from target documents. Removal requires inventory, compatibility analysis, migration, rollback and an architectural decision.

## 5. Phase 0 status

Phase 0 is closed. Bootstrap, routing, Redux, React Query, API/protocol, authentication, persistence, workers, HTML safety, telemetry, design, accessibility, tests, builds, dependencies, licensing, and documentation authority now have source-backed inventories and executable drift gates.

The closure does not claim that inherited implementation debt is resolved. The exact Phase 1 and later constraints—including TypeScript diagnostics, transport scope, React Query scope, dependency remediation, cross-engine visual coverage, and external branch protection—are recorded in [`PHASE_0_CLOSURE_REPORT.md`](./PHASE_0_CLOSURE_REPORT.md).
