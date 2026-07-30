# Phase 6 — Durable Outbox and Synchronization Reconciliation

Status: **Complete**

Last updated: 2026-07-30

## Summary

Phase 6 delivers a durable outbox for reliable local-first mutations. Every
mutation that leaves the device goes through an IndexedDB-backed queue with
stable operation IDs, retry classification, exponential backoff, dependency
ordering, and user-visible lifecycle states.

## Delivered (Slice 6A — Outbox Foundations)

### Domain types (`app/soapbox/domain/`)

- `outbox-operation.ts` — Complete type system:
  - `OutboxState`: pending, in-flight, retrying, failed, conflict, completed, cancelled
  - `OutboxOperationType`: 26 supported mutation types
  - `ConflictPolicy`: last-write-wins, fail-on-conflict, merge, skip-if-done
  - `IdempotencyStrategy`: idempotency-key, check-before-send, naturally-idempotent, none
  - `FailureReason`: 12 failure classifications with permanent/retryable partitioning
  - `OutboxEntry`: full stored record contract
  - `MAX_ATTEMPTS`, `DEFAULT_IDEMPOTENCY`, `DEFAULT_CONFLICT_POLICY` per type
  - `PERMANENT_FAILURES` set and `isRetryable()` guard

- `outbox-retry.ts` — Retry scheduling:
  - `computeNextAttemptAt()` with exponential backoff + jitter + bounds
  - Server Retry-After header respected (capped at maxDelay)
  - Configurable: baseDelay (1s), maxDelay (5min), jitter [0.5, 1.5]
  - `shouldRetry()` predicate for retry decisions

### Storage layer (`app/soapbox/db/`)

- `schema.ts` — V4 schema adds `outbox` table with compound indexes:
  - Primary: `[accountUrl+id]` (IDOR prevention)
  - State index: `[accountUrl+state]` (efficient state queries)
  - Scheduling: `[accountUrl+nextAttemptAt]` (retry timer)
  - Priority: `[accountUrl+priority]` (queue ordering)
  - `StoredOutboxEntry` interface

- `outbox-repository.ts` — Account-scoped repository:
  - `enqueue()` — persist new operation
  - `getEntry()` / `updateEntry()` — read/write single entries
  - `getReadyOperations()` — dequeue ready ops (respects dependencies + timing)
  - `getByState()` / `getActiveOperations()` — UI queries
  - `countByState()` — badge counts
  - `cancelEntry()` / `retryEntry()` / `discardEntry()` — recovery actions
  - `purgeCompleted()` — retention enforcement (default 24h)
  - `purgeAccount()` — logout/account removal
  - `recoverStaleInflight()` — crash recovery at startup

### Infrastructure (`app/soapbox/infrastructure/outbox/`)

- `outbox-processor.ts` — Execution engine:
  - Tick-based processing (not polling)
  - `registerExecutor()` — per-type executor registration
  - Dependency-aware dequeuing (uploads before posts)
  - Error classification → retry scheduling or permanent failure
  - Crash recovery (in-flight → retrying on startup)
  - Timer-based scheduling for delayed retries
  - `subscribe()` for change notifications
  - `initialize()` / `stop()` lifecycle

- `outbox-service.ts` — High-level public API:
  - `enqueue()` — create operations with generated IDs + idempotency keys
  - `cancel()` / `retry()` / `discard()` — recovery tools
  - `getActive()` / `getByState()` / `getCounts()` — queries

- `use-outbox.ts` — React hooks:
  - `useOutbox(scope)` — full snapshot (operations, hasPending, hasFailed, hasConflicts)
  - `useOutboxCounts(scope)` — lightweight badge counts

- `network-listener.ts` — Browser online/offline → processor trigger

- `failure-classifier.ts` — Error → FailureReason bridge

- `index.ts` — Barrel exports

## Delivered (Slice 6B — Status & Media Executors)

- `executors/status-executors.ts` — status.create, status.edit, status.delete:
  - Full payload validation (content length, media IDs, poll options, visibility)
  - Control character injection prevention in all ID fields
  - Idempotency-Key header support for create/edit
  - URI component encoding on all path parameters

- `executors/media-executor.ts` — media.upload:
  - MIME type allowlist (image/*, video/*, audio/*)
  - File size bounds (max 100MB)
  - Alt text / description length validation
  - Focal point format validation
  - FormData multipart upload with 120s timeout

## Delivered (Slice 6C — Interaction & Account Executors)

- `executors/interaction-executors.ts` — favourite, unfavourite, reblog,
  unreblog, bookmark, unbookmark, pin, unpin, mute, unmute:
  - Factory pattern for toggle-style operations
  - Shared status ID validation

- `executors/account-executors.ts` — follow, unfollow, block, unblock, mute, unmute:
  - Follow supports options (reblogs, notify, languages)
  - Mute supports duration and notification options
  - Account ID validation with control char rejection

- `executors/misc-executors.ts` — poll.vote, report.create, notification.dismiss,
  notifications.clear, marker.update:
  - Poll choice validation (integer bounds)
  - Report comment length limiting, status ID count caps
  - Marker last_read_id validation

- `executors/index.ts` — `registerAllExecutors()` wires all 26 operation types

## Delivered (Transport & Security Layer)

- `outbox-transport.ts` — Authenticated HTTP execution:
  - Fresh token resolution per request (no stale caching)
  - SSRF prevention: URL scheme detection (rejects file://, ftp://, etc.)
  - Protocol-relative URL rejection (//)
  - Origin confinement (absolute URLs must match account instance)
  - Embedded credential rejection in URLs
  - AbortSignal threading for cancellation
  - 30s default timeout / 120s upload timeout
  - `setStoreAccessor()` for Redux bridge without circular deps

## Delivered (Slice 6D — Stream/Poll Reconciliation)

- `reconciliation.ts` — Dedup and out-of-order event processing:
  - `reconcile()` — matches incoming server events against active operations
  - Idempotency-key matching (strongest dedup signal)
  - Entity-level matching (statusId, accountId)
  - Conflict policy application per operation type
  - Toggle-state skip detection (skip-if-done)
  - `detectDuplicateCreate()` — content fingerprinting for status creation dedup
  - `isOperationStale()` — timestamp-based ordering for out-of-order events
  - HTML normalization, entity decoding, whitespace collapsing

## Delivered (Slice 6E — Conflict Handling)

- `conflict-resolver.ts` — Edit/draft conflict resolution:
  - `analyzeConflict()` — structured conflict info with available strategies
  - Per-type strategies: edit (keep-local/remote/both/cancel), create (retry/keep-both/cancel)
  - `computeResolution()` — pure function mapping strategy → instructions
  - Content-at-risk detection for user content preservation
  - Draft-saving instructions for keep-both strategy

## Delivered (Slice 6F — Compose Integration)

- `compose-bridge.ts` — Compose → outbox routing:
  - Feature-flagged (opt-in via `setOutboxComposeEnabled()`)
  - `enqueueCompose()` — converts compose params → outbox payload
  - `enqueueDelete()` — high-priority status deletion
  - `enqueueInteraction()` — toggle interactions (favourite, follow, etc.)
  - `enqueueMediaUpload()` — media upload with dependency tracking
  - Poll, to (Set/Array), media_ids, and all compose fields converted
  - Account scope validated from authenticated session URL

## Delivered (Slice 6G — Recovery Tools)

- `outbox-recovery.ts` — Safe manual recovery:
  - `retryOperation()` / `cancelOperation()` / `discardOperation()` — single ops
  - `resolveConflict()` — multi-step: strategy → draft save → outbox update
  - `retryAllFailed()` — batch retry all failed operations
  - `cancelAllPending()` — batch cancel all pending/retrying operations
  - Account scope validation on all operations (IDOR prevention)
  - Draft persistence for keep-both resolution (content bounded to 100K)

## Architecture decisions

1. **Single-threaded per account**: one operation at a time avoids dependency
   races. Throughput scales with operation count per tick, not parallelism.

2. **IndexedDB as queue**: durability across page reloads, crashes, and
   browser restarts. No localStorage size limits.

3. **Executor registry**: decoupled from the queue. Feature modules register
   their own executor functions. The processor doesn't know about API details.

4. **Idempotency-key header**: for create operations, preventing duplicate
   posts on retry. Backends that support it (Mastodon 4.2+) will deduplicate.

5. **Dependency ordering**: media uploads declare dependencies; status.create
   depends on media.upload IDs. Processor won't attempt a child until all
   parents are completed.

6. **Crash recovery**: operations stuck in 'in-flight' at startup are reset
   to 'retrying' with immediate next attempt.

## Remaining slices (queued)

- **6D**: Stream/poll reconciliation (duplicate and out-of-order handling) ✅
- **6E**: Conflict handling UI for edits and drafts ✅
- **6F**: Compose integration (offline compose → outbox enqueue) ✅
- **6G**: Recovery UI (pending/failed badges, retry/cancel/discard actions) ✅

## Exit criteria (from roadmap)

- [x] Offline compose and supported actions reconcile correctly
- [x] Permanent errors do not retry forever
- [x] Duplicate requests do not create duplicate posts where preventable

## File inventory

| File | Purpose |
|------|---------|
| `app/soapbox/domain/outbox-operation.ts` | Domain types, policies, constants |
| `app/soapbox/domain/outbox-retry.ts` | Retry scheduling algorithm |
| `app/soapbox/db/schema.ts` | V4 schema (outbox table) |
| `app/soapbox/db/outbox-repository.ts` | Account-scoped persistence |
| `app/soapbox/db/index.ts` | Updated public exports |
| `app/soapbox/infrastructure/outbox/index.ts` | Barrel export |
| `app/soapbox/infrastructure/outbox/outbox-processor.ts` | Execution engine |
| `app/soapbox/infrastructure/outbox/outbox-service.ts` | High-level API |
| `app/soapbox/infrastructure/outbox/outbox-transport.ts` | Authenticated HTTP + SSRF prevention |
| `app/soapbox/infrastructure/outbox/use-outbox.ts` | React hooks |
| `app/soapbox/infrastructure/outbox/network-listener.ts` | Online/offline bridge |
| `app/soapbox/infrastructure/outbox/failure-classifier.ts` | Error classification |
| `app/soapbox/infrastructure/outbox/executors/index.ts` | Executor registration |
| `app/soapbox/infrastructure/outbox/executors/status-executors.ts` | Status CRUD executors |
| `app/soapbox/infrastructure/outbox/executors/interaction-executors.ts` | Toggle executors |
| `app/soapbox/infrastructure/outbox/executors/account-executors.ts` | Account relationship executors |
| `app/soapbox/infrastructure/outbox/executors/media-executor.ts` | Media upload executor |
| `app/soapbox/infrastructure/outbox/executors/misc-executors.ts` | Poll, report, notification, marker executors |
| `app/soapbox/infrastructure/outbox/reconciliation.ts` | Stream/poll dedup and ordering |
| `app/soapbox/infrastructure/outbox/conflict-resolver.ts` | Edit/draft conflict resolution |
| `app/soapbox/infrastructure/outbox/compose-bridge.ts` | Compose → outbox routing bridge |
| `app/soapbox/infrastructure/outbox/outbox-recovery.ts` | Manual recovery tools |

## Test inventory

| File | Coverage |
|------|----------|
| `app/soapbox/domain/__tests__/outbox-operation.test.ts` | Constants completeness, retry classification |
| `app/soapbox/domain/__tests__/outbox-retry.test.ts` | Backoff computation, jitter, caps, shouldRetry |
| `app/soapbox/db/__tests__/outbox-repository.test.ts` | IDOR, CRUD, dependencies, state transitions, crash recovery |
| `app/soapbox/infrastructure/outbox/__tests__/outbox-transport.test.ts` | SSRF prevention, token resolution |
| `app/soapbox/infrastructure/outbox/executors/__tests__/payload-validation.test.ts` | All 26 executor payload validations |
| `app/soapbox/infrastructure/outbox/__tests__/reconciliation.test.ts` | Dedup, ordering, conflict policy |
| `app/soapbox/infrastructure/outbox/__tests__/conflict-resolver.test.ts` | Conflict analysis and resolution |
| `app/soapbox/infrastructure/outbox/__tests__/compose-bridge.test.ts` | Feature flag, payload conversion, scope |
