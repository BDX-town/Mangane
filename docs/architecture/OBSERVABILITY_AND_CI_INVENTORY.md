# Mangane Observability and CI Inventory

Status: **Current / Phase 0 in progress**

Last updated: 2026-07-23

This document records observability, crash-handling, build-time configuration, and CI evidence verified from exact repository paths. It does not claim that all telemetry initialization or workflow files have been enumerated.

## 1. Sentry dependency and configuration signals

The package manifest declares:

- `@sentry/browser`;
- `@sentry/react`;
- `@sentry/tracing`.

`app/soapbox/build_config.js` reads `SENTRY_DSN` from the build process and exports it through a pre-evaluated build configuration object.

Verified limitations:

- the inspected application entry does not initialize Sentry;
- the inspected root container does not initialize Sentry;
- the inspected error boundary does not submit errors to Sentry;
- the inspected webpack environment plugin only exposes `NODE_ENV`, while `SENTRY_DSN` is consumed through the separate pre-evaluation path;
- no inspected source establishes consent, opt-out, sampling, `beforeSend` redaction, breadcrumb filtering, request-body filtering, authorization-header filtering, user-identity filtering, attachment filtering, or data-retention policy.

Therefore the current evidence classification is:

```text
Sentry packages: verified present
SENTRY_DSN build input: verified present
Runtime initialization: unverified
Production event emission: unverified
Consent and redaction: unverified
```

Dependency presence or a DSN configuration field must not be treated as proof that Sentry is active or safely configured.

## 2. Crash handling

`app/soapbox/components/error_boundary.tsx` is the verified root React error boundary.

Verified behavior:

- records the thrown error and React component stack in component state;
- dynamically loads Bowser to identify the current browser;
- displays detailed error and component-stack text only outside production;
- provides a manual browser-data reset action;
- does not visibly call Sentry or another remote crash reporter.

The manual reset action clears:

- the global React Query client after cancelling its queries;
- all origin `localStorage`;
- all origin `sessionStorage`;
- the shared localForage store with awaited bounded cleanup;
- every visible Cache Storage entry;
- visible native notifications and push subscriptions;
- all service-worker registrations visible to the origin.

It repeats the authoritative browser stores after asynchronous cleanup, then returns through the configured frontend basename.

### Important distinction

This emergency reset is broader than normal logout and demonstrates that the application already recognizes multiple browser-storage and worker boundaries. It is not a normal account-removal contract because it:

- clears all accounts and all application keys for the origin;
- cannot enumerate and revoke every object URL;
- does not provide durable pre-mount recovery after browser termination;
- can only bound, not forcibly cancel, browser operations that ignore cancellation;
- records a sanitized internal result but does not yet render per-step failures to the user;
- is only reachable after a rendering failure.

Phase 4 should preserve a reliable emergency reset while introducing deterministic account-scoped and application-wide purge contracts.

## 3. Error disclosure behavior

In non-production builds, the error boundary renders the raw error concatenated with the component stack into a copyable textarea.

This is useful for development but requires tests ensuring production-build detection cannot be bypassed by malformed build configuration. Error values may contain:

- endpoint URLs;
- account identifiers;
- server response content;
- request metadata;
- user-authored content;
- secret-bearing Axios configuration if propagated carelessly.

Any future remote reporting path must redact before serialization rather than relying only on production UI hiding.

## 4. Build-time configuration boundary

`app/soapbox/build_config.js` accepts these build inputs:

- `NODE_ENV`;
- `BACKEND_URL`;
- `FE_SUBDIRECTORY`;
- `FE_BUILD_DIR`;
- `FE_INSTANCE_SOURCE_DIR`;
- `SENTRY_DSN`.

URLs and paths receive limited normalization, while `SENTRY_DSN` is exported without an inspected validation or redaction step.

`webpack/shared.js` also reads instance-supplied `custom/snippets.html` and injects it into HTML template parameters. This is a separate high-risk content boundary requiring deployment and CSP review because build-time instance customization can add arbitrary markup outside React sanitization paths.

Required controls include:

- trusted-build-source documentation;
- explicit distinction between administrator-trusted markup and remote user content;
- CSP and integrity behavior;
- secret handling in build logs and generated assets;
- proof that private DSN credentials are not exposed beyond what browser Sentry clients necessarily require;
- reproducible-build and environment-variable documentation.

## 5. Verified package command baseline

The package manifest defines:

- webpack build;
- Jest tests;
- Jest coverage;
- combined coverage and lint;
- ESLint for JavaScript and TypeScript;
- Stylelint for Sass.

It does not define dedicated package scripts for:

- standalone TypeScript checking;
- browser end-to-end tests;
- accessibility tests;
- service-worker tests;
- security tests;
- dependency advisory checks;
- license checks;
- performance budgets;
- bundle-size checks;
- migration tests;
- rollback tests.

A workflow may still invoke tools directly, so absence from package scripts is not proof of absence from CI.

## 6. Current GitHub status evidence

The PR head has returned no combined status contexts through the GitHub status API during Phase 0 inspection.

This does not prove that CI is disabled. Possible explanations include:

- workflows are absent;
- workflows use check runs rather than legacy commit statuses;
- workflows did not trigger for the draft or documentation-only commits;
- GitHub Actions is disabled or restricted;
- checks are attached through another system;
- the connector cannot enumerate the relevant check suite.

Until workflows and check runs are directly enumerated, CI enforcement remains **unverified**.

## 7. Mandatory telemetry inventory

Before Phase 0 closes, enumerate every use of:

- Sentry initialization and integrations;
- `captureException`, `captureMessage`, scopes, tags and user identity;
- tracing and performance transactions;
- console capture and breadcrumbs;
- network instrumentation;
- release and environment identifiers;
- source-map upload;
- consent and opt-out settings;
- DSN overrides from instance customization;
- any other analytics or error-reporting provider.

For every outbound event, document:

- trigger;
- payload schema;
- user/account/instance identifiers;
- post, message, search, draft or media content exposure;
- URLs and query parameters;
- headers and request bodies;
- redaction rules;
- sampling;
- retention and processor location;
- user-visible consent and deletion controls.

## 8. Mandatory CI inventory

Phase 0 still requires direct enumeration of:

- all GitHub Actions or other CI workflow files;
- workflow triggers and permissions;
- action versions and SHA pinning;
- runtime and package-manager setup;
- dependency caching;
- lint, unit, coverage, build and type-check commands;
- browser, accessibility and service-worker coverage;
- secret availability and fork behavior;
- required checks and branch protection;
- artifact and report retention;
- baseline outcomes on current `main` and the Phase 0 branch.

No later phase may claim “CI clean” based only on a missing status response.

## 9. Target guarantees

The target architecture must provide:

- telemetry disabled by default unless the project explicitly approves another policy;
- no raw credentials, authorization headers, request bodies, private content, drafts or search terms in events;
- deterministic redaction tests;
- account and instance identifiers minimized or pseudonymized;
- user-visible consent, opt-out and deletion behavior where telemetry is enabled;
- a documented emergency reset that reliably clears application-controlled local state;
- CI that enforces lint, type safety, unit tests, build, security-sensitive worker tests and documentation consistency;
- required checks that cannot silently disappear without repository-owner review.
