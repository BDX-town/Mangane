# State Authority and Duplication Matrix

Status: **Current / Phase 0 in progress**

Last updated: 2026-07-23

## Purpose

This document establishes the canonical Phase 0 inventory for data that may exist simultaneously in Redux, React Query, localStorage, sessionStorage, IndexedDB/localForage, service-worker state, native notifications, HTTP caches, media caches, and future local-first stores.

Its purpose is to prevent later phases from introducing competing authorities, cross-account leakage, stale resurrection, incomplete logout, duplicate mutation handling, or non-deterministic recovery.

## Required matrix

| Data domain | Canonical authority now | Other copies or projections | Persistence | Account/instance scope | Writer(s) | Invalidation and purge | Offline role | Migration target | Tests | Status |
|---|---|---|---|---|---|---|---|---|---|---|

Allowed states are **Verified-current**, **Partial**, **Unknown**, **Blocked**, **Deprecated**, and **Target-only**.

## Initial verified rows

| Data domain | Canonical authority now | Other copies or projections | Persistence | Account/instance scope | Writer(s) | Invalidation and purge | Offline role | Migration target | Tests | Status |
|---|---|---|---|---|---|---|---|---|---|---|
| Authentication graph | Redux `auth` domain | selected identity in root state; account entities; persisted account snapshots | full auth graph in localStorage; selected identity in sessionStorage; account snapshots in localForage | keyed by deployment and account URL, with active identity stored separately | auth actions, reducer and purge coordinator | ordered purge removes Redux/serialized credentials, selection and snapshots; corruption/quota fail closed; tombstones resume failures | enables account restoration | explicit `AccountScope` plus non-exportable credential provider remains a later migration | logout, account-removal, corrupt storage, quota and stale-write tests established | Phase 0C verified |
| Account entities | Redux accounts domain | auth user records; localForage auth-account snapshots; UI-derived selectors | localForage snapshot path verified for remembered auth accounts | account IDs and account URLs can both participate in lookup | importers, account actions, auth restore | stale snapshots and cross-instance invalidation are not fully enumerated | remembered account bootstrap | normalized account store scoped by account and instance | incomplete | Partial |
| Active account identity | root `state.me` and `state.auth.me` both participate | sessionStorage selected identity; account URL resolution | sessionStorage verified | active account, but consistency across representations is not guaranteed | auth/account switching flows | logout and switch behavior span multiple reducers and stores | startup selection | one explicit session authority with derived selectors | mismatch and transition tests required | Blocked |
| Instance metadata | Redux instance domain | localForage/KVStore `instance:{host}` record; capability derivations | IndexedDB/localForage through KVStore | host-derived; account-to-host resolution can be stale | instance thunks and reducer | loaded from storage concurrently with network fetch; version and account-change invalidation are not proven | cached startup metadata | account/instance-scoped capability record with versioned TTL | stale-host and version-change tests required | Partial |
| React Query server data | one global QueryClient | trends, suggestion accounts and relationships duplicate data into Redux | in-memory cache with infinite cache lifetime | three verified direct keys omit account and instance scope | executable scanner plus query authority gate | logout cancels/clears; stateful HTTP results are session/account-generation fenced | transient reuse only; no persistence API discovered | scoped query keys remain Phase 1 design | late-generation response tests established; alias/mutation drift fails the gate | Phase 0C purge verified; key migration open |
| Push notification credentials and status references | native `NotificationOptions.data` plus worker revocation cache | push payload; Redux/session credentials in the page | native notification persistence outside page lifecycle; SHA-256 revocation fingerprint cache | token/action scope, with account/instance redesign still later work | push and purge-message handlers | cross-tab logout persists restart-durable revocation, awaits acknowledgement, closes notifications and unsubscribes push | enables background actions | scoped action-capability replacement remains later hardening | durable binding and adversarial drift tests established | Phase 0C purge verified; payload redesign open |
| Service-worker cached application assets | inherited offline-plugin cache | browser HTTP cache and live application bundle | Cache Storage | global inherited cache name; account independence and upgrade boundaries need proof | generated service worker/runtime | deterministic cleanup and rollback are not established | PWA shell availability | versioned application cache with bounded retention and upgrade tests | worker excluded from Jest coverage | Partial |
| Shared application configuration and instance capabilities | Redux `soapbox`, `instance`, and custom-emoji domains are preserved by root logout | build configuration and cached instance records | mixed build-time and browser storage | may be deployment-global or instance-specific; boundary is incomplete | startup loaders and reducers | root logout preservation is verified; instance/account transitions need explicit invalidation | startup and degraded rendering | immutable deployment config separated from scoped server capabilities | transition and stale-config tests required | Partial |

## Non-negotiable authority rules

1. Every durable data class must have one named canonical authority.
2. Redux and React Query may not both be writable authorities for the same server entity.
3. Derived indexes, search vectors, summaries, and rankings must be rebuildable and must never become the only copy of user-authored or server-authoritative data.
4. Credentials must not be copied into native notifications, query keys, URLs, logs, telemetry, cache names, or general-purpose entity records.
5. Every persistent record must carry enough account, instance, schema-version, and provenance information to reject stale or cross-scope data.
6. Logout, account removal, instance switching, and credential revocation require one deterministic purge transaction spanning all authorities and projections.
7. Offline mutations need one durable journal with idempotency, ordering, conflict, retry, cancellation, and rollback semantics.
8. Cache invalidation must be event-driven where correctness or privacy depends on it; infinite lifetime cannot substitute for authority rules.

## Remaining inventory

The matrix is incomplete until it enumerates every Redux domain, React Query key and mutation, localStorage/sessionStorage key, localForage object, Cache Storage entry, native notification field, object URL, media cache, draft, upload, outbox item, streaming checkpoint, and future local-intelligence projection.

For each duplicated data class, Phase 0 must decide whether the copy is authoritative, a cache, a projection, a journal, a migration artifact, or deprecated state.

## Completion gate

Phase 1 must not introduce the new architecture seam until account/session authority, entity ownership, query-cache scope, persistent-store schema, purge behavior, and mutation-journal ownership are explicit enough to prevent dual writes and cross-account data resurrection.
