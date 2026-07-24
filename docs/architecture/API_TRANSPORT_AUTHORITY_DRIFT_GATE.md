# API Transport Authority Drift Gate

Status: **Current / Phase 0 bounded gate**

This gate protects the directly verified central credential-bearing HTTP client and authentication URL/token-selection boundary from silent architectural drift.

## Verified current boundary

The gate pins:

- `app/soapbox/api.ts` as the central Axios client factory;
- bearer-token attachment through the `Authorization` header;
- `BACKEND_URL` precedence under the current broad `isURL` check;
- account/authentication-user origin selection through `parseBaseURL`;
- permissive JSON response parsing;
- creation of the stateful API client from separately selected credentials and destination state;
- `app/soapbox/utils/auth.ts` as the current broad URL parser and account-URL-indexed token selector.

## Security meaning

A passing gate does **not** mean the transport is hardened. It proves only that the inspected boundary still matches the recorded inherited implementation.

The current shared boundary does not establish:

- immutable account-and-origin scope binding;
- HTTPS-only production destinations;
- credential-free URLs, safe ports, or public-network-only hosts;
- timeout and bounded-response defaults;
- cancellation and late-response fencing;
- typed errors, rate-limit metadata, redirect policy, or content-type enforcement;
- safe retry classification and idempotency handling;
- repository-wide API, upload, streaming, and pagination coverage.

The checker intentionally fails when these bounded behaviors or absences change without simultaneous inventory reconciliation. This prevents an apparently beneficial local change from being mistaken for a complete transport contract.

## Enforcement

The dependency-free checker runs in:

- the dedicated `API transport authority` workflow; and
- the broader `Architecture inventory` workflow.

Focused adversarial tests prove failure when:

- bearer attachment changes;
- a required authority surface disappears;
- the broad URL selector is mislabeled as validated;
- shared safety defaults change without documentation reconciliation;
- explicit blockers are silently removed;
- source paths escape the repository root.

## Migration consequence

Phase 1 must replace this inherited coupling behind explicit account scope, credential-provider, destination-policy, typed-error, retry, cancellation, and capability contracts. Until then, new code must not bypass the central inventory or describe the current client as account-safe or hardened.
