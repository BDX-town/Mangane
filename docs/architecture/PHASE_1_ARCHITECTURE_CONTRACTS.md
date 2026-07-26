# Phase 1 Architecture Seams and Compatibility Contracts

Status: **Implemented; merge and CI evidence required for closure**

Last updated: 2026-07-25

## Outcome

Phase 1 introduces a reversible boundary around account lookup, the first representative end-to-end feature. Presentation actions retain their existing Redux effects, while lookup strategy, protocol capability decisions, response validation, account authority, runtime configuration, and error normalization now have explicit contracts.

## Implemented contracts

- `domain/account-repository.ts`: domain-facing account repository and runtime response validation;
- `application/contracts.ts`: command/query execution contracts;
- `domain/protocol-capability.ts`: backend-neutral capability decisions;
- `domain/application-error.ts`: sanitized typed errors, cancellation preservation, retry classification, and bounded `Retry-After`;
- `domain/account-scope.ts`: account/instance authority and same-origin destination enforcement;
- `runtime/environment.ts`: browser/runtime access behind an injectable interface;
- `runtime/feature-flags.ts`: registered flags with owner, default, rollback value, and removal phase;
- `infrastructure/protocol/*`: legacy API and capability adapters.

The default `fetchAccountByUsername` path now executes through `FindAccountByUsername` and `LegacyAccountRepository`. The existing presentation effects—relationship fetch, account import where required, success/failure dispatch, and login redirect—remain compatible.

## Security and privacy properties

- Repository instances are bound to an exact account scope and fail closed on scope confusion.
- Instance origins accept only credential-free HTTP(S) URLs.
- Scoped destinations cannot cross origins.
- Account identifiers reject empty, oversized, and control-character input.
- Legacy placeholder/account IDs are never treated as URLs; a validated stored user URL or the current origin is used instead.
- Direct endpoint path segments are encoded.
- Account responses require stable string `id` and `acct` values before import.
- Transport payloads are not copied into application errors.
- Cancellation is never treated as retryable.
- Server-directed retry delays are bounded to fifteen minutes.
- Feature flag overrides accept only registered boolean keys.

No automatic retry was added to account lookup because this read is already user/navigation driven and implicit retries could amplify load or delay a deterministic not-found result. The typed error model records whether future orchestrators may retry safely.

## Compatibility and rollback

The flag `architecture.accountLookupAdapter` defaults to `true`. Setting the build-time `FEATURE_FLAGS` JSON value to:

```json
{
  "architecture.accountLookupAdapter": false
}
```

restores the prior account-lookup implementation without changing presentation code. The flag is owned by `protocol-maintainers` and scheduled for removal after Phase 7, when legacy state isolation can establish equivalent behavior across migrated modules.

## Protocol evidence

Adapter tests exercise representative normalized version metadata for:

- Mastodon 4.2-compatible account lookup;
- Pleroma 2.4-compatible direct and lookup behavior;
- Akkoma 3.13-compatible direct and lookup behavior;
- unknown server metadata, which fails closed to unsupported capabilities.

Repository tests cover direct, lookup, and bounded search selection; malformed server data; offline normalization; scope confusion; and invalid identifiers.

## Drift control

`config/architecture-boundary-inventory.json` records inherited presentation dependencies on direct API, backend feature, and endpoint details. `scripts/check-architecture-boundaries.js` rejects additions, removals that have not been reconciled, and symlinked presentation sources. This prevents new component-level backend coupling while making existing debt explicit and removable.

The TypeScript authority baseline is reduced from 101 inherited diagnostics to zero. CI must keep it at zero.

## Verification and closure

Required before closure:

- raw TypeScript check returns zero diagnostics;
- architecture boundary unit tests and checker pass;
- domain, runtime, application, and adapter tests pass;
- governance, inventories, lint, build baseline, and documentation authority checks pass;
- the phase pull request has no unresolved review comments and all required GitHub checks pass;
- the phase pull request is merged.
