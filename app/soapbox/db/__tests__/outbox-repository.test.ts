/**
 * Phase 6 — Outbox repository tests.
 *
 * Tests account-scoped CRUD, dependency resolution, state transitions,
 * and crash recovery using fake-indexeddb.
 */

import 'fake-indexeddb/auto';

import type { OutboxEntry } from 'soapbox/domain/outbox-operation';
import type { AccountScope } from '../repository';

jest.mock('../instance', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { ManganeDatabase: DB } = require('../schema');
  const instance = new DB(`test-outbox-${Date.now()}`);
  return { __esModule: true, db: instance, default: instance };
});

// Import after mock
import * as outboxRepo from '../outbox-repository';
import db from '../instance';

beforeAll(async () => {
  await (db as any).open();
});

afterAll(async () => {
  await (db as any).delete();
});

afterEach(async () => {
  await (db as any).outbox.clear();
});

const scopeA: AccountScope = { accountUrl: 'https://instance.example/users/alice' };
const scopeB: AccountScope = { accountUrl: 'https://instance.example/users/bob' };

function makeEntry(overrides: Partial<OutboxEntry> = {}): OutboxEntry {
  return {
    id: `op-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    accountUrl: scopeA.accountUrl,
    operationType: 'status.create',
    state: 'pending',
    payload: { content: 'Hello' },
    idempotencyKey: null,
    idempotencyStrategy: 'none',
    conflictPolicy: 'fail-on-conflict',
    dependsOn: [],
    priority: 100,
    createdAt: Date.now(),
    attemptedAt: null,
    nextAttemptAt: null,
    completedAt: null,
    attemptCount: 0,
    maxAttempts: 5,
    lastFailureReason: null,
    lastErrorMessage: null,
    serverRetryAfterMs: null,
    result: null,
    ...overrides,
  };
}

describe('outbox-repository', () => {
  describe('enqueue and getEntry', () => {
    it('persists an entry and retrieves it', async () => {
      const entry = makeEntry();
      await outboxRepo.enqueue(scopeA, entry);
      const retrieved = await outboxRepo.getEntry(scopeA, entry.id);
      expect(retrieved).toBeDefined();
      expect(retrieved!.id).toBe(entry.id);
      expect(retrieved!.operationType).toBe('status.create');
      expect(retrieved!.state).toBe('pending');
    });

    it('enforces account scope isolation (IDOR prevention)', async () => {
      const entry = makeEntry();
      await outboxRepo.enqueue(scopeA, entry);
      // Bob cannot read Alice's entries
      const retrieved = await outboxRepo.getEntry(scopeB, entry.id);
      expect(retrieved).toBeUndefined();
    });
  });

  describe('updateEntry', () => {
    it('updates mutable fields', async () => {
      const entry = makeEntry();
      await outboxRepo.enqueue(scopeA, entry);
      await outboxRepo.updateEntry(scopeA, entry.id, {
        state: 'in-flight',
        attemptedAt: Date.now(),
        attemptCount: 1,
      });
      const updated = await outboxRepo.getEntry(scopeA, entry.id);
      expect(updated!.state).toBe('in-flight');
      expect(updated!.attemptCount).toBe(1);
    });

    it('does not update across account scopes', async () => {
      const entry = makeEntry();
      await outboxRepo.enqueue(scopeA, entry);
      await outboxRepo.updateEntry(scopeB, entry.id, { state: 'failed' });
      const unchanged = await outboxRepo.getEntry(scopeA, entry.id);
      expect(unchanged!.state).toBe('pending');
    });
  });

  describe('getReadyOperations', () => {
    it('returns pending operations with no nextAttemptAt', async () => {
      const e1 = makeEntry({ id: 'op-1', state: 'pending' });
      await outboxRepo.enqueue(scopeA, e1);
      const ready = await outboxRepo.getReadyOperations(scopeA);
      expect(ready.length).toBe(1);
      expect(ready[0].id).toBe('op-1');
    });

    it('excludes operations with future nextAttemptAt', async () => {
      const futureEntry = makeEntry({
        id: 'op-future',
        state: 'retrying',
        nextAttemptAt: Date.now() + 60_000,
      });
      await outboxRepo.enqueue(scopeA, futureEntry);
      const ready = await outboxRepo.getReadyOperations(scopeA);
      expect(ready.length).toBe(0);
    });

    it('includes operations with past nextAttemptAt', async () => {
      const pastEntry = makeEntry({
        id: 'op-past',
        state: 'retrying',
        nextAttemptAt: Date.now() - 1000,
      });
      await outboxRepo.enqueue(scopeA, pastEntry);
      const ready = await outboxRepo.getReadyOperations(scopeA);
      expect(ready.length).toBe(1);
    });

    it('respects dependency ordering', async () => {
      const parent = makeEntry({ id: 'upload-1', state: 'pending' });
      const child = makeEntry({
        id: 'post-1',
        state: 'pending',
        dependsOn: ['upload-1'],
      });
      await outboxRepo.enqueue(scopeA, parent);
      await outboxRepo.enqueue(scopeA, child);

      const ready = await outboxRepo.getReadyOperations(scopeA);
      // Only parent should be ready (child depends on it)
      expect(ready.length).toBe(1);
      expect(ready[0].id).toBe('upload-1');
    });

    it('releases child when parent completes', async () => {
      const parent = makeEntry({ id: 'upload-2', state: 'completed', completedAt: Date.now() });
      const child = makeEntry({
        id: 'post-2',
        state: 'pending',
        dependsOn: ['upload-2'],
      });
      await outboxRepo.enqueue(scopeA, parent);
      await outboxRepo.enqueue(scopeA, child);

      const ready = await outboxRepo.getReadyOperations(scopeA);
      expect(ready.some(r => r.id === 'post-2')).toBe(true);
    });

    it('sorts by priority then createdAt', async () => {
      const low = makeEntry({ id: 'low', priority: 200, createdAt: 1000 });
      const high = makeEntry({ id: 'high', priority: 10, createdAt: 2000 });
      const mid = makeEntry({ id: 'mid', priority: 100, createdAt: 500 });
      await outboxRepo.enqueue(scopeA, low);
      await outboxRepo.enqueue(scopeA, high);
      await outboxRepo.enqueue(scopeA, mid);

      const ready = await outboxRepo.getReadyOperations(scopeA, Date.now(), 10);
      expect(ready[0].id).toBe('high');
      expect(ready[1].id).toBe('mid');
      expect(ready[2].id).toBe('low');
    });
  });

  describe('cancelEntry', () => {
    it('cancels a pending entry', async () => {
      const entry = makeEntry({ id: 'cancel-me' });
      await outboxRepo.enqueue(scopeA, entry);
      const result = await outboxRepo.cancelEntry(scopeA, 'cancel-me');
      expect(result).toBe(true);
      const updated = await outboxRepo.getEntry(scopeA, 'cancel-me');
      expect(updated!.state).toBe('cancelled');
      expect(updated!.completedAt).toBeDefined();
    });

    it('refuses to cancel an in-flight entry', async () => {
      const entry = makeEntry({ id: 'in-flight', state: 'in-flight' });
      await outboxRepo.enqueue(scopeA, entry);
      const result = await outboxRepo.cancelEntry(scopeA, 'in-flight');
      expect(result).toBe(false);
    });

    it('refuses to cancel a completed entry', async () => {
      const entry = makeEntry({ id: 'done', state: 'completed' });
      await outboxRepo.enqueue(scopeA, entry);
      const result = await outboxRepo.cancelEntry(scopeA, 'done');
      expect(result).toBe(false);
    });

    it('enforces account scope on cancel', async () => {
      const entry = makeEntry({ id: 'alice-op' });
      await outboxRepo.enqueue(scopeA, entry);
      const result = await outboxRepo.cancelEntry(scopeB, 'alice-op');
      expect(result).toBe(false);
    });
  });

  describe('retryEntry', () => {
    it('resets a failed entry to pending', async () => {
      const entry = makeEntry({
        id: 'failed-op',
        state: 'failed',
        lastFailureReason: 'network',
        nextAttemptAt: Date.now() + 9999,
      });
      await outboxRepo.enqueue(scopeA, entry);
      const result = await outboxRepo.retryEntry(scopeA, 'failed-op');
      expect(result).toBe(true);
      const updated = await outboxRepo.getEntry(scopeA, 'failed-op');
      expect(updated!.state).toBe('pending');
      expect(updated!.nextAttemptAt).toBeNull();
      expect(updated!.lastFailureReason).toBeNull();
    });

    it('retries a conflict entry', async () => {
      const entry = makeEntry({ id: 'conflict-op', state: 'conflict' });
      await outboxRepo.enqueue(scopeA, entry);
      const result = await outboxRepo.retryEntry(scopeA, 'conflict-op');
      expect(result).toBe(true);
    });

    it('refuses to retry a pending entry', async () => {
      const entry = makeEntry({ id: 'pending-op' });
      await outboxRepo.enqueue(scopeA, entry);
      const result = await outboxRepo.retryEntry(scopeA, 'pending-op');
      expect(result).toBe(false);
    });
  });

  describe('discardEntry', () => {
    it('deletes a terminal entry', async () => {
      const entry = makeEntry({ id: 'discard-me', state: 'failed' });
      await outboxRepo.enqueue(scopeA, entry);
      const result = await outboxRepo.discardEntry(scopeA, 'discard-me');
      expect(result).toBe(true);
      const gone = await outboxRepo.getEntry(scopeA, 'discard-me');
      expect(gone).toBeUndefined();
    });

    it('refuses to discard an active entry', async () => {
      const entry = makeEntry({ id: 'active-op', state: 'in-flight' });
      await outboxRepo.enqueue(scopeA, entry);
      const result = await outboxRepo.discardEntry(scopeA, 'active-op');
      expect(result).toBe(false);
    });
  });

  describe('recoverStaleInflight', () => {
    it('resets in-flight entries to retrying on recovery', async () => {
      const stale = makeEntry({ id: 'stale-op', state: 'in-flight' });
      await outboxRepo.enqueue(scopeA, stale);
      const count = await outboxRepo.recoverStaleInflight(scopeA);
      expect(count).toBe(1);
      const recovered = await outboxRepo.getEntry(scopeA, 'stale-op');
      expect(recovered!.state).toBe('retrying');
      expect(recovered!.nextAttemptAt).toBeLessThanOrEqual(Date.now());
    });

    it('does not touch entries in other states', async () => {
      const pending = makeEntry({ id: 'pending-ok', state: 'pending' });
      await outboxRepo.enqueue(scopeA, pending);
      const count = await outboxRepo.recoverStaleInflight(scopeA);
      expect(count).toBe(0);
    });
  });

  describe('countByState', () => {
    it('returns correct counts per state', async () => {
      await outboxRepo.enqueue(scopeA, makeEntry({ id: 'p1', state: 'pending' }));
      await outboxRepo.enqueue(scopeA, makeEntry({ id: 'p2', state: 'pending' }));
      await outboxRepo.enqueue(scopeA, makeEntry({ id: 'f1', state: 'failed' }));
      await outboxRepo.enqueue(scopeA, makeEntry({ id: 'c1', state: 'completed' }));

      const counts = await outboxRepo.countByState(scopeA);
      expect(counts.pending).toBe(2);
      expect(counts.failed).toBe(1);
      expect(counts.completed).toBe(1);
      expect(counts['in-flight']).toBe(0);
    });

    it('does not count entries from other accounts', async () => {
      await outboxRepo.enqueue(scopeA, makeEntry({ id: 'alice-1' }));
      await outboxRepo.enqueue(scopeB, makeEntry({ id: 'bob-1', accountUrl: scopeB.accountUrl }));

      const aliceCounts = await outboxRepo.countByState(scopeA);
      expect(aliceCounts.pending).toBe(1);
    });
  });

  describe('purgeCompleted', () => {
    it('purges old completed entries', async () => {
      const old = makeEntry({
        id: 'old-done',
        state: 'completed',
        completedAt: Date.now() - 48 * 60 * 60 * 1000,
      });
      const recent = makeEntry({
        id: 'recent-done',
        state: 'completed',
        completedAt: Date.now() - 1000,
      });
      await outboxRepo.enqueue(scopeA, old);
      await outboxRepo.enqueue(scopeA, recent);

      const purged = await outboxRepo.purgeCompleted(scopeA, 24 * 60 * 60 * 1000);
      expect(purged).toBe(1);

      expect(await outboxRepo.getEntry(scopeA, 'old-done')).toBeUndefined();
      expect(await outboxRepo.getEntry(scopeA, 'recent-done')).toBeDefined();
    });
  });

  describe('purgeAccount', () => {
    it('deletes all entries for an account', async () => {
      await outboxRepo.enqueue(scopeA, makeEntry({ id: 'a1' }));
      await outboxRepo.enqueue(scopeA, makeEntry({ id: 'a2' }));
      await outboxRepo.enqueue(scopeB, makeEntry({ id: 'b1', accountUrl: scopeB.accountUrl }));

      const count = await outboxRepo.purgeAccount(scopeA);
      expect(count).toBe(2);

      // Bob's entry is untouched
      const bobEntry = await (db as any).outbox.get([scopeB.accountUrl, 'b1']);
      expect(bobEntry).toBeDefined();
    });
  });
});
