/Users/damonoutlaw/.zshenv:.:1: no such file or directory: /Users/damonoutlaw/.cargo/env
# Backend Capability Matrix

Status: **Current / Phase 0B callsite discovery complete; compatibility validation in progress**

Last updated: 2026-07-25

## Purpose

This document records the source-backed Phase 0 baseline for inherited Akkoma, Pleroma, Mastodon-compatible, and Mangane-specific backend behavior. It prevents presentation code and later architecture work from assuming that every server exposes the same endpoints, fields, limits, moderation behavior, streaming semantics, or authentication requirements.

It is a capability inventory, not a claim that all backend families are equivalent.

Repository-wide static callsite enumeration is now authoritative in [`config/network-callsite-manifest.json`](../../config/network-callsite-manifest.json): 222 production boundaries across Axios, native fetch, and the WebSocket client. The executable gate prevents unreviewed drift. Dynamic routes remain explicitly classified, and compatibility evidence must still distinguish supported, unsupported, unknown, authorization failure, rate limiting, malformed responses, transient failure, and offline state.

## Evidence model

Every backend-dependent feature must be classified using direct source evidence:

| Capability | Client owner | Endpoint or transport | Backend-family evidence | Auth scope | Pagination or stream semantics | Failure and degraded behavior | Tests | Status |
|---|---|---|---|---|---|---|---|---|

Allowed status values are:

- **Verified-current** — directly supported by inspected source; this does not imply cross-backend parity unless compatibility evidence also exists;
- **Partial** — some paths are verified but important variants remain unresolved;
- **Unknown** — no complete source-backed conclusion is available;
- **Unsupported** — explicitly absent and handled through a documented fallback;
- **Blocked** — unsafe to rely on until security, privacy, migration, or compatibility evidence exists.

## Verified current rows

| Capability | Client owner | Endpoint or transport | Backend-family evidence | Auth scope | Pagination or stream semantics | Failure and degraded behavior | Tests | Status |
|---|---|---|---|---|---|---|---|---|
| Instance metadata | `app/soapbox/actions/instance.ts` | `GET /api/v1/instance` | Mastodon-compatible endpoint shape is assumed by the call site; Akkoma/Pleroma response compatibility and field normalization are not proven here | shared authenticated API client; token attachment depends on current state | none at this call site | thunk rejects with the caught error; startup may continue with partial state elsewhere | no direct compatibility test verified | Partial |
| NodeInfo metadata | `app/soapbox/actions/instance.ts` | `GET /nodeinfo/2.1.json` | generic NodeInfo path is hard-coded; discovery-link negotiation and backend/version variants are not established | shared API client | none | raw request rejection; no alternate NodeInfo version or discovery fallback verified | none verified | Partial |
| OAuth application registration | `app/soapbox/actions/apps.ts` | `POST /api/v1/apps` | documented in source as Mastodon apps API; actual Akkoma/Pleroma compatibility matrix remains unverified | unauthenticated client; request carries client metadata and requested scopes | none | dispatches request/success/fail and rethrows | none verified | Partial |
| OAuth application verification | `app/soapbox/actions/apps.ts` | `GET /api/v1/apps/verify_credentials` | endpoint is assumed available; backend-family support is not proven | bearer app token supplied explicitly | none | dispatches failure and rethrows | none verified | Partial |
| OAuth token exchange | `app/soapbox/actions/oauth.ts`, `auth.ts` | `POST /oauth/token` | client credentials, password grant, and refresh-token grant are constructed; support and policy vary by server | sends client ID, client secret, grant material, redirect URI, and scopes without bearer auth | none | action records failure and rethrows; no typed error or retry contract | none verified | Partial |
| OAuth token revocation | `app/soapbox/actions/oauth.ts` | `POST /oauth/revoke` | endpoint is assumed available across configured servers; fallback behavior is not established | client ID, client secret, and token in request body | none | failure is rethrown, but logout uses `finally` and proceeds with local logout | none verified | Partial |
| MFA challenge | `app/soapbox/actions/auth.ts` | `POST /oauth/mfa/challenge` | Pleroma/Akkoma-style extension is implied by endpoint; Mastodon-compatible support is not established | app bearer client plus client secret, MFA token, TOTP code, scopes | none | rejection is surfaced to caller; schema and challenge variants are unverified | none verified | Partial |
| Account credential verification | `app/soapbox/actions/auth.ts` | `GET /api/v1/accounts/verify_credentials` | Mastodon-compatible endpoint; server-specific account fields are imported directly | explicit bearer user token bound to a parsed account origin | none | a `403` response containing an account ID is treated as a waitlisted account; other failures dispatch failure and rethrow | none verified | Partial |
| Server-side session deletion | `app/soapbox/actions/auth.ts` | `DELETE /api/sign_out` | nonstandard Mangane/Soapbox deployment endpoint; cross-backend availability is unknown | current user bearer client | none | no fallback or error normalization at this call site | none verified | Unknown |
| Registration captcha | `app/soapbox/actions/auth.ts` | `GET /api/v1/pleroma/captcha` | explicitly Pleroma-namespaced; Akkoma compatibility may exist but is not proven; Mastodon support should not be assumed | shared current API client | none | raw rejection; no documented unsupported-capability fallback | none verified | Partial |
| Push notification detail lookup | `app/soapbox/service_worker/web_push_notifications.ts` | `GET /api/v1/notifications/{id}` via service-worker `fetch` | Mastodon-compatible endpoint is assumed; response is represented by local loose/HACK interfaces | bearer token is supplied by the push payload and cookies are also included | none | on any failure, native notification falls back to push-supplied title/body/icon | worker excluded from Jest coverage; no direct test verified | Blocked |
| Push notification repost action | `app/soapbox/service_worker/web_push_notifications.ts` | `POST /api/v1/statuses/{id}/reblog` | Mastodon-compatible mutation name is assumed | bearer token persisted in notification data; cookies also included | none | failed action leaves notification unchanged; no idempotency or retry contract | worker excluded from Jest coverage | Blocked |
| Push notification favourite action | `app/soapbox/service_worker/web_push_notifications.ts` | `POST /api/v1/statuses/{id}/favourite` | Mastodon-compatible mutation name is assumed | bearer token persisted in notification data; cookies also included | none | failed action leaves notification unchanged; no idempotency or retry contract | worker excluded from Jest coverage | Blocked |

## Findings from the verified rows

1. The inherited client does not yet expose a single protocol adapter boundary. Backend-specific and nominally Mastodon-compatible endpoints are invoked directly from actions and the service worker.
2. Endpoint presence is frequently treated as capability evidence. The inspected paths do not consistently distinguish an unsupported endpoint from authentication failure, malformed response, transient network failure, or server incompatibility.
3. Server response objects are imported into shared entities without a verified runtime schema at these boundaries.
4. OAuth support is broader than a simple authorization-code flow: the inherited implementation constructs client-credentials, password, refresh-token, MFA, revocation, and app-verification operations. Later migration must preserve or intentionally deprecate each path with compatibility guidance.
5. The push worker is both a backend capability surface and a critical credential boundary. Its rows remain blocked regardless of nominal endpoint compatibility because the token originates in the push payload and is persisted in notification data.
6. No inspected row establishes a safe probe, cached capability version, negative-capability TTL, or account/instance-scoped capability invalidation policy.

## Capability groups still requiring enumeration

The complete matrix must additionally cover:

1. registrations, configuration, feature flags, limits, and custom emojis;
2. authorization-code callbacks and any external-browser OAuth path;
3. accounts, relationships, follow requests, lists, filters, blocks, mutes, endorsements, and account notes;
4. home, local, federated, list, hashtag, bookmarks, favourites, and conversation timelines;
5. statuses, replies, quotes, edits, history, polls, reactions, bookmarks, favourites, pins, and deletion;
6. media upload, processing, limits, descriptions, thumbnails, and failure recovery;
7. push subscription creation/removal, streaming, reconnect, resume, and deduplication;
8. search, trends, suggestions, directory, featured tags, and server ranking behavior;
9. reports, moderation, domain blocks, content warnings, sensitive media, filters, and visibility semantics;
10. chats or private-message extensions;
11. all additional Akkoma and Pleroma extensions;
12. rate limits, retry metadata, pagination cursors, idempotency, and error schemas.

## Required adapter contract

Later implementation must expose backend differences through a stable capability layer that:

- detects support from verified instance metadata and safe probes rather than branding alone;
- binds every capability decision to an explicit account and normalized instance origin;
- distinguishes unsupported behavior from authentication failure, authorization denial, malformed response, rate limiting, transient failure, and offline state;
- validates response shape before storing or rendering it;
- prevents server-specific fields from leaking directly into presentation components;
- defines pagination, streaming, retry, cancellation, and stale-data behavior;
- scopes cached data and capability decisions by account and instance;
- invalidates capability decisions when the account, instance version, authenticated scopes, or relevant instance metadata changes;
- fails closed for authentication, privacy, moderation, and visibility-sensitive behavior;
- supplies explicit degraded-mode UI when a capability is unavailable;
- records compatibility tests for every supported backend family and version range.

## Security and privacy gates

The matrix remains blocked for production decisions until it records:

- authentication scopes and token exposure for every protected capability;
- visibility and audience semantics for posts, replies, quotes, chats, and notifications;
- moderation and filter differences that could expose hidden or blocked content;
- URL, redirect, media, and attachment trust boundaries;
- instance-controlled HTML and metadata handling;
- rate-limit and retry behavior that avoids duplicate mutations;
- account-transition and cache-isolation behavior;
- runtime schemas and bounded parsing for every security-sensitive response.

## Evidence limitations

This revision directly inspected the central instance actions, OAuth application actions, OAuth token actions, authentication actions, and push-notification worker. Repository-wide static endpoint enumeration is complete for the syntax classes declared by the generated manifest. Runtime-computed destinations, third-party internal requests, backend configuration, and live protocol behavior still require integration evidence; these are explicit validation limits rather than undiscovered source callsites.

## Completion gate

This artifact now contains initial source-backed capability rows and the canonical evidence standard. The broader Phase 0 backend capability gate remains open until every active backend-dependent code path is mapped to its endpoint or transport, capability status, authentication requirements, failure behavior, cache ownership, tests, and documented fallback.
