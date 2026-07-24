# Sentry Authority Drift Gate

Status: **Current / bounded Phase 0 evidence**

This gate protects the directly verified Sentry dependency and build-configuration boundary from silent drift.

## Verified current boundary

- `package.json` declares `@sentry/browser`, `@sentry/react`, and `@sentry/tracing` at `^7.2.0`.
- `app/soapbox/build_config.js` reads and exports `SENTRY_DSN` through build-time configuration.

These facts do not establish that Sentry initializes at runtime, that telemetry is enabled, or that any event is safe to send.

## Fail-closed behavior

The checker fails when:

- a pinned Sentry dependency changes or disappears;
- the build-time `SENTRY_DSN` surface changes;
- a required privacy or runtime invariant is removed;
- an explicit Phase 0 unknown silently disappears;
- a configuration path escapes the repository root.

## Security boundary

Production telemetry remains blocked until runtime initialization, capture call sites, consent, opt-out, sampling, retention, redaction, breadcrumbs, request metadata, account identifiers, credentials, source maps, and build artifacts are directly verified and adversarially tested.

Dependency presence and DSN configuration are evidence of a possible telemetry surface, not proof of active or safe telemetry.
