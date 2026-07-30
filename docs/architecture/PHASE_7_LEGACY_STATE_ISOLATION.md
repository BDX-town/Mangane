# Phase 7 — Legacy State Isolation and Module Migration Framework

Status: **Complete**

Last updated: 2026-07-30

## Summary

Phase 7 establishes the application boundary layer that isolates legacy Redux
state from migrated presentation code. It provides a migration framework,
state inventory, governance tooling, and a feed-neutral timeline read model
that hides transport, persistence, and normalization details.

## Deliverables — all met

### 1. State inventory (57 slices classified)

`app/soapbox/application/state-policy.ts` categorizes all 57 Redux slices by:
- Authority: server / durable / ephemeral
- Current persistence: whether it survives reload today
- Target persistence: where it will live after migration
- Account scope: IDOR-relevance for account switch/logout
- Migration status: legacy / boundary-wrapped / migrated

### 2. Domain selectors/commands (timeline read model)

`app/soapbox/application/timeline-queries.ts` provides:
- `queryTimeline()` — reads timeline state as plain TypeScript
- `queryStatus()` — denormalizes status with account, media, poll
- `queryAccount()` — reads account as plain view object

No Immutable.js types leak through these functions.

### 3. Server-state vs durable-state policy

Documented in `state-policy.ts`:
- SERVER: truth on remote; local copy is evictable cache
- DURABLE: truth in IndexedDB; survives reload/offline
- EPHEMERAL: session-only; lost on reload
- Conflict resolution: DURABLE wins until outbox reconciles

### 4. Module migration template

`app/soapbox/application/migration-framework.ts`:
- 5-phase workflow: identified → boundary-added → dual-path → legacy-removed → verified
- Per-module tracking: legacy dependencies, target APIs, current phase
- `getMigrationProgress()` for CI/governance
- `isModuleMigrated()` for runtime checks

### 5. Deprecated API tracking

`DEPRECATED_ACCESSES` registry:
- `state.timelines.get(...)` → `useTimelineState()`
- `state.statuses.get(id)` → `useStatusView()`
- `state.accounts.get(id)` → `useAccountView()`
- `makeGetStatus` → `useStatusView`
- `makeGetAccount` → `useAccountView`

Each entry tracks: pattern, replacement, introducing phase, removal phase, enforcement status.

### 6. Test helpers for legacy/new-path equivalence

`app/soapbox/application/__tests__/migration-helpers.ts`:
- `assertTimelineConsistency()` — validates query results against Redux state
- `assertStatusConsistency()` — validates view shape and types
- `assertPlainObject()` — detects Immutable.js type leakage

### 7. Feed-neutral timeline read model

`app/soapbox/application/timeline-read-model.ts`:
- `TimelineState` — items, hasMore, isLoading, isOnline, queuedCount, hasFailed
- `StatusView` — full denormalized status with account, reblog, media, poll
- `AccountView` — username, acct, displayName, avatar, verified, bot
- `MediaView`, `PollView`, `PollOptionView` — nested types
- `CanonicalTimelineId` — typed timeline identifiers
- `EMPTY_TIMELINE` — frozen default state

### 8. React hooks (presentation API)

`app/soapbox/application/use-timeline.ts`:
- `useTimelineState(timelineId)` — reactive timeline state
- `useStatusView(statusId)` — reactive single status
- `useAccountView(accountId)` — reactive single account
- `useStatusViews(ids)` — batch status lookup

## Exit criteria

- [x] Home timeline module uses stable application boundaries
  (`features/home_timeline` is at `boundary-added` phase in migration registry)
- [x] Notifications module identified with legacy dependencies documented
  and target APIs defined
- [x] Duplicate state sources have defined authority and retirement plan
  (57 slices classified with server/durable/ephemeral authority)

## Architecture boundary rules

Migrated modules MUST:
- Import from `soapbox/application` (hooks, types)
- Import from `soapbox/infrastructure/outbox` (mutations)
- Return plain TypeScript objects only

Migrated modules MUST NOT:
- Import from `soapbox/selectors`
- Import from `soapbox/reducers`
- Use `useAppSelector` directly
- Reference `ImmutableMap`, `ImmutableList`, etc.
- Call `api(getState)` directly (use outbox)

## File inventory

| File | Purpose |
|------|---------|
| `app/soapbox/application/index.ts` | Barrel export (public API) |
| `app/soapbox/application/state-policy.ts` | 57-slice inventory + governance queries |
| `app/soapbox/application/timeline-read-model.ts` | Read model types (plain TS) |
| `app/soapbox/application/timeline-queries.ts` | Redux → plain TS adapter |
| `app/soapbox/application/use-timeline.ts` | React hooks for presentation |
| `app/soapbox/application/migration-framework.ts` | Migration registry + deprecated API tracking |
| `app/soapbox/application/__tests__/state-policy.test.ts` | Inventory completeness + policy tests |
| `app/soapbox/application/__tests__/timeline-read-model.test.ts` | Type contract tests |
| `app/soapbox/application/__tests__/migration-framework.test.ts` | Registry + governance tests |
| `app/soapbox/application/__tests__/migration-helpers.ts` | Equivalence verification utilities |
