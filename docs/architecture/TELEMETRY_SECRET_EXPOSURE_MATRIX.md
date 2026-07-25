# Telemetry and Secret Exposure Matrix

Status: **Current / Phase 0 in progress**

Last updated: 2026-07-23

## Purpose

This document begins the required Phase 0 reconciliation of credentials, private account data, request metadata, logs, crash reporting, developer tooling, notifications, URLs, and browser persistence. It records verified exposure paths and explicit unknowns. It does not claim that secrets are currently redacted end to end.

## Exposure standard

A secret-handling path is acceptable only when sensitive values are minimized, explicitly classified, destination-bound, redacted before observability boundaries, excluded from URLs and public identifiers, and covered by tests that fail when leakage occurs.

The minimum sensitive set includes:

- access and refresh tokens;
- OAuth client secrets and authorization codes;
- passwords, MFA tokens, recovery data, and session identifiers;
- private account settings and drafts;
- notification action credentials;
- request and response bodies containing personal or moderation data;
- account and instance identifiers when their combination reveals private activity.

## Initial matrix

| Surface | Verified current behavior | Exposure risk or unknown | Required follow-up |
|---|---|---|---|
| Browser authentication storage | Complete authentication state is persisted in JavaScript-readable `localStorage`; selected identity is also persisted in `sessionStorage` | Origin script execution can read credentials; Phase 0C now removes account/token records, selection, snapshots and legacy keys with resumable fail-closed purge | A later secure-storage migration must preserve the completed purge and corruption contract |
| IndexedDB/localForage account snapshots | Verified account objects are stored under `authAccount:<account URL>` and may retain older private settings | Sensitive account extensions may survive logout or be restored as stale authority | Enumerate stored fields, retention, migration, purge, quota, backup, and stale-field rules |
| OAuth password and MFA requests | Login flows construct requests containing username, password, client ID, client secret, and in MFA flows an MFA token | Axios errors, action payloads, breadcrumbs, debugging tools, proxies, or logs may capture request data unless explicitly redacted | Trace request construction through logging and error boundaries; prove body and headers are redacted before capture |
| Authorization headers | Bearer injection is centralized in inspected client behavior | Headers may appear in network errors, debug output, crash reports, mocks, snapshots, or proxy logs | Inventory interceptors and error serializers; add header-redaction tests for success, retry, timeout, cancellation, and malformed responses |
| Raw token indexing | Auth state uses raw access-token values as object keys | Tokens can leak through object inspection, Redux tooling, serialization, error messages, or generic key logging | Replace public or observable token keys with opaque credential handles; test that tokens never appear in entity keys or diagnostics |
| Redux actions and state | Authentication and account data pass through Redux-managed state | Production Redux DevTools behavior and action/state sanitization remain unverified | Verify production configuration; enumerate sensitive actions and reducers; add state/action sanitizers or disable inspection for sensitive fields |
| React Query cache | A global QueryClient exists with long-lived cache behavior | Query keys, cached responses, mutation variables, and errors may contain account- or instance-bearing data; complete key inventory is absent | Build query-key and payload matrix; prohibit secrets in keys; define redaction, retention, cancellation, and purge behavior |
| Sentry or crash reporting | Repository inventory identified Sentry as present, but complete initialization, environment gating, breadcrumbs, request capture, and redaction remain to be reconciled | Errors may contain Axios config, headers, bodies, URLs, account identifiers, or Redux-derived context | Inventory initialization and all capture calls; document enabled environments and sampling; define `beforeSend`/breadcrumb redaction and secret-leak tests |
| Console and application logging | Complete logger call-site inventory is not yet established | Debug logging may expose tokens, credentials, request objects, push payloads, account data, or server responses | Enumerate console/logger calls and wrappers; classify production reachability; introduce centralized structured redaction and tests |
| URLs and redirects | OAuth and application flows use URLs; complete callback, query-string, fragment, and redirect handling remains unverified | Codes, tokens, usernames, instance identifiers, or private navigation state may enter browser history, referrers, analytics, screenshots, or logs | Inventory URL construction and parsing; prohibit bearer tokens and secrets in URLs; define one-time code handling, cleanup, referrer policy, and redirect allowlists |
| Push payloads and Notification data | Push and notification handling may carry a bearer token for later actions | Tokens can persist beyond logout in service-worker memory, browser notification storage, crash reports, or action payloads | Remove raw bearer tokens from push and notification data; use opaque, short-lived, account-bound action capabilities; close or invalidate old notifications |
| Service workers and Cache Storage | Worker and cache behavior is not completely classified | Authenticated responses, request metadata, push data, or old account state may survive normal logout and upgrades | Inventory cache names and strategies; prove authenticated content is excluded or partitioned; define purge, versioning, rollback, and update behavior |
| WebSocket and stream diagnostics | Streams are account/instance-bearing and may include authorization material or private events | Connection URLs, errors, reconnect state, payload logs, and duplicate-event diagnostics may reveal secrets or private activity | Trace construction and logging; bind credentials to destination; redact errors and payloads; test teardown and token rotation |
| Tests, fixtures, and snapshots | Complete test-data inventory is absent | Realistic-looking or copied production secrets may enter fixtures, snapshots, recorded responses, CI logs, or artifacts | Add secret scanners and deterministic fake credentials; prohibit production captures; sanitize fixtures and workflow artifacts |
| Build-time and runtime configuration | Complete environment-variable and injected-config inventory is absent | Secrets may be embedded in client bundles, source maps, HTML, manifests, or public runtime configuration | Enumerate variables and injection paths; classify public versus server-only values; inspect built artifacts and source maps for forbidden values |

## Required redaction contract

The target architecture must define one central redaction policy that applies before data crosses any logging, telemetry, debugging, serialization, notification, URL, or error-reporting boundary.

At minimum it must:

1. remove authorization, cookie, password, MFA, client-secret, code, and token values;
2. recursively redact request and response bodies by field classification;
3. sanitize URLs and query strings before capture;
4. bound payload size and nesting to prevent observability abuse;
5. avoid invoking attacker-controlled getters or unsafe serializers;
6. preserve enough non-sensitive context for diagnosis;
7. mark redaction failures and drop the event rather than emitting raw data;
8. be tested against mixed case, aliases, nested objects, arrays, malformed objects, cycles, and custom error types.

## Mandatory tests

The completed matrix must drive tests proving that forbidden values do not appear in:

- console output and structured logs;
- Sentry events, breadcrumbs, tags, contexts, and attachments;
- Axios and WebSocket errors;
- Redux actions, state snapshots, and production developer tooling;
- React Query keys and serialized cache data;
- URLs, redirects, browser history, and referrer-bearing navigation;
- push payloads and `Notification.data`;
- service-worker messages and Cache Storage keys;
- CI logs, test snapshots, fixtures, coverage output, and build artifacts;
- account-switch, logout, retry, timeout, cancellation, and partial-failure paths.

## Next inspection queue

1. Inspect Sentry initialization, environment gating, integrations, breadcrumbs, and capture calls.
2. Enumerate console calls, logger wrappers, debug flags, and production reachability.
3. Trace Axios interceptors, error normalization, retries, and request/response serialization.
4. Inventory Redux DevTools configuration and sensitive action/state paths.
5. Inventory React Query keys, mutation variables, errors, hydration, and persistence.
6. Trace OAuth callbacks, redirects, URL parsing, and history cleanup.
7. Trace push payloads, service-worker messages, notifications, and action handling.
8. Enumerate environment variables, runtime config, generated HTML, manifests, source maps, CI logs, artifacts, fixtures, and snapshots.

## Completion gate

This workstream remains incomplete until every observability and serialization boundary has:

- a named owner;
- a sensitive-data classification;
- an explicit allowlist or redaction policy;
- environment and retention rules;
- account and instance scope;
- failure behavior that drops unsafe output;
- direct adversarial tests;
- evidence that production bundles, source maps, logs, notifications, URLs, caches, and telemetry contain no forbidden secret values.

Unknown logging, telemetry, developer-tooling, URL, notification, worker, build, test, or artifact behavior remains a blocker rather than evidence of safety.
