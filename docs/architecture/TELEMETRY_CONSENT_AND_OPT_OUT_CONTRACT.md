# Telemetry Consent and Opt-out Contract

Status: **Phase 0E complete**

Mangane currently has no production telemetry. There is no event sampling, processor, remote retention, remote deletion request, device identifier, account identity, or telemetry consent state.

Any future telemetry implementation is release-blocked until it provides:

1. telemetry off by default and informed, unbundled opt-in before initialization;
2. a visible control that stops capture immediately and clears any local queue;
3. documented event allowlists, destination/processors, sampling, purpose, retention, and deletion;
4. no consent inference from administrator configuration, DSN presence, terms acceptance, or continued use;
5. account- and device-independent consent revocation;
6. fail-closed redaction before serialization, persistence, retry, or transmission;
7. tests covering opt-out/deletion during offline, retry, crash, stale-tab, stale-worker, and account-switch conditions.

Administrator configuration cannot override user opt-out. A redaction or consent-state failure must drop the event.
