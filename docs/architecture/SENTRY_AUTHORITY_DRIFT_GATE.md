# Telemetry and Redaction Authority Drift Gate

Status: **Phase 0E verified**

The historical Sentry gate now protects the complete telemetry/logging boundary. `config/sentry-authority-inventory.json` is generated from application, worker, build, repository-tooling, test, fixture, and workflow sources.

CI fails when:

- a logging, telemetry, DevTools, source-map, notification, clipboard, environment, error-boundary, or artifact callsite drifts;
- a Sentry dependency, lockfile package, DSN, or capture call returns;
- diagnostic protection is not installed before asynchronous startup;
- development output bypasses bounded redaction;
- production dynamic console output, source maps, or Redux DevTools are enabled;
- the central redactor loses descriptor-only inspection, cycle protection, or fail-closed behavior.

The checker is `scripts/check-sentry-authority-inventory.js`; generator logic is in `scripts/telemetry-inventory-lib.js`; mutation tests are in `scripts/__tests__/check-sentry-authority-inventory.test.js`; browser adversarial tests are in `app/soapbox/utils/__tests__/diagnostics.test.ts`.
