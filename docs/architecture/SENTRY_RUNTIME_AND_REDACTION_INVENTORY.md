# Sentry Runtime and Redaction Inventory

Status: **Phase 0E complete — Sentry removed**

Last verified: 2026-07-25

Repository-wide source, package, and lockfile discovery proves:

- no `@sentry/*` dependency remains;
- no Sentry initialization, capture, breadcrumb, scope, tracing, replay, profiling, attachment, or transport callsite exists;
- `SENTRY_DSN` is not accepted or embedded by build configuration;
- no production telemetry provider is configured.

Sentry was a dormant dependency/build-input surface rather than active observability. Phase 0E removes it instead of treating absence of initialization as a sufficient privacy control. The generated authority manifest records zero telemetry-capture callsites and CI rejects reintroduction without explicit reconciliation.

## Runtime diagnostics

`app/soapbox/utils/diagnostics.ts` installs before polyfills or application startup. In production, dynamic console diagnostics are disabled. The only console output is a fixed, content-free self-XSS warning. In development, console arguments are redacted before browser serialization and remain local.

The redactor removes sensitive fields and URL parameters; avoids getters, `toJSON`, functions, and attacker-controlled serialization hooks; detects cycles; bounds depth, width, strings, and total output; and replaces unsafe values instead of falling back to raw output.

No offline queue, retry, remote retention, remote deletion, sampling, user identity, device identity, or network transport exists because telemetry is disabled.

## Future enablement gate

Adding any telemetry provider requires a separate reviewed change with explicit opt-in consent, immediate opt-out, sampling, retention, deletion, processor disclosure, a strict event allowlist, fail-closed redaction, and adversarial tests before initialization or capture code lands.
