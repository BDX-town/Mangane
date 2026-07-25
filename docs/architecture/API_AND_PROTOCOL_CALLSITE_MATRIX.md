# API and Protocol Callsite Matrix

Status: **generated inventory enforced; policy hardening remains queued**

The authoritative callsite list is [`config/network-callsite-manifest.json`](../../config/network-callsite-manifest.json). It scans production JavaScript and TypeScript under `app/`, excluding tests, fixtures, locale data, and Jest support. Each entry records source location, transport, method, literal or dynamic route, owner, authentication and scope assumptions, body/response expectations, pagination, timeout, cancellation, retry safety, rate-limit behavior, content type, payload bound, error class, capability, fallback, and degraded behavior.

## Authority rules

- Axios traffic inherits the destination and bearer-token behavior in `app/soapbox/api.ts` unless a callsite creates an explicit client.
- A mutation is classified `unsafe-unless-idempotency-proven`; it must not receive automatic retries merely because a transport retry facility is introduced.
- Dynamic routes are retained as `<dynamic>` and require runtime-selected capability handling; they are not discarded by discovery.
- The shared client currently has no common timeout, response-size bound, typed error taxonomy, redirect policy, or rate-limit policy. The manifest records those gaps instead of implying safety.
- Credential-bearing requests must remain bound to the selected account and destination origin. Phase 1 transport work must enforce that invariant centrally.

Run `yarn generate:network-callsites` after an intentional network-boundary change, review the diff, then run `yarn check:network-callsites` and `yarn test:network-callsites`. CI rejects unreconciled additions, removals, or classification changes.

## Failure semantics

Capability checks must produce one of four distinct states: `supported`, `unsupported`, `unknown`, or `failed`. HTTP 401/403 is an authorization failure, 429 is rate limiting, malformed success data is a protocol failure, and network/5xx failures are transient or offline failures. None of those may be silently rewritten as “unsupported.”
