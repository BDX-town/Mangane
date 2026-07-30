/**
 * Phase 6D — Reconciliation tests.
 *
 * Tests duplicate detection, out-of-order handling, and conflict policy
 * application for incoming server events vs pending outbox operations.
 */

import { reconcile, detectDuplicateCreate, isOperationStale } from '../reconciliation';

import type { IncomingEvent } from '../reconciliation';
import type { OutboxEntry } from 'soapbox/domain/outbox-operation';

function makeEntry(overrides: Partial<OutboxEntry> = {}): OutboxEntry {
  return {
    id: 'op-1',
    accountUrl: 'https://instance.example/users/alice',
    operationType: 'status.favourite',
    state: 'pending',
    payload: { statusId: 'status-123' },
    idempotencyKey: null,
    idempotencyStrategy: 'check-before-send',
    conflictPolicy: 'skip-if-done',
    dependsOn: [],
    priority: 100,
    createdAt: Date.now(),
    attemptedAt: null,
    nextAttemptAt: null,
    completedAt: null,
    attemptCount: 0,
    maxAttempts: 3,
    lastFailureReason: null,
    lastErrorMessage: null,
    serverRetryAfterMs: null,
    result: null,
    ...overrides,
  };
}

describe('reconcile', () => {
  it('returns no-op when no active operations exist', () => {
    const event: IncomingEvent = { type: 'status.favourited', entityId: '123', isDone: true };
    const result = reconcile([], event);
    expect(result.action).toBe('no-op');
  });

  it('matches by idempotency key', () => {
    const op = makeEntry({ idempotencyKey: 'mangane-status.create-abc123' });
    const event: IncomingEvent = {
      type: 'status.created',
      entityId: 'new-status',
      isDone: true,
      idempotencyKey: 'mangane-status.create-abc123',
    };
    const result = reconcile([op], event);
    expect(result.action).toBe('complete');
    expect(result.operationId).toBe(op.id);
  });

  it('does not match different idempotency keys', () => {
    const op = makeEntry({ idempotencyKey: 'key-1' });
    const event: IncomingEvent = {
      type: 'status.created',
      entityId: 'x',
      isDone: true,
      idempotencyKey: 'key-2',
    };
    const result = reconcile([op], event);
    expect(result.action).toBe('no-op');
  });

  it('applies skip-if-done for toggle operations', () => {
    const op = makeEntry({
      operationType: 'status.favourite',
      conflictPolicy: 'skip-if-done',
      payload: { statusId: 'status-123' },
    });
    const event: IncomingEvent = {
      type: 'status.favourited',
      entityId: 'status-123',
      isDone: true,
    };
    const result = reconcile([op], event);
    expect(result.action).toBe('skip');
    expect(result.operationId).toBe(op.id);
  });

  it('does not skip if event isDone is false', () => {
    const op = makeEntry({
      operationType: 'status.favourite',
      conflictPolicy: 'skip-if-done',
      payload: { statusId: 'status-123' },
    });
    const event: IncomingEvent = {
      type: 'status.favourited',
      entityId: 'status-123',
      isDone: false,
    };
    const result = reconcile([op], event);
    expect(result.action).toBe('no-op');
  });

  it('detects edit conflicts with fail-on-conflict policy', () => {
    const op = makeEntry({
      operationType: 'status.edit',
      conflictPolicy: 'fail-on-conflict',
      state: 'pending',
      payload: { statusId: 'status-456', content: 'my edit' },
    });
    const event: IncomingEvent = {
      type: 'status.updated',
      entityId: 'status-456',
      isDone: true,
    };
    const result = reconcile([op], event);
    expect(result.action).toBe('conflict');
    expect(result.operationId).toBe(op.id);
  });

  it('does not conflict on completed edits', () => {
    const op = makeEntry({
      operationType: 'status.edit',
      conflictPolicy: 'fail-on-conflict',
      state: 'completed',
      payload: { statusId: 'status-456', content: 'my edit' },
    });
    const event: IncomingEvent = {
      type: 'status.updated',
      entityId: 'status-456',
      isDone: true,
    };
    const result = reconcile([op], event);
    // Completed operations don't conflict
    expect(result.action).toBe('no-op');
  });

  it('last-write-wins never conflicts', () => {
    const op = makeEntry({
      operationType: 'marker.update',
      conflictPolicy: 'last-write-wins',
      payload: { home: { lastReadId: '999' } },
    });
    const event: IncomingEvent = {
      type: 'marker.updated',
      entityId: 'home',
      isDone: true,
    };
    // marker.update targets don't match entityId in the simple case,
    // but if they did, last-write-wins should not produce a conflict
    const result = reconcile([op], event);
    expect(result.action).toBe('no-op');
  });

  it('ignores events targeting unrelated entities', () => {
    const op = makeEntry({ payload: { statusId: 'status-999' } });
    const event: IncomingEvent = {
      type: 'status.favourited',
      entityId: 'status-111',
      isDone: true,
    };
    const result = reconcile([op], event);
    expect(result.action).toBe('no-op');
  });
});

describe('detectDuplicateCreate', () => {
  it('detects matching content', () => {
    const op = makeEntry({
      operationType: 'status.create',
      state: 'in-flight',
      payload: { content: 'Hello world!' },
      createdAt: Date.now(),
    });
    const match = detectDuplicateCreate([op], { content: '<p>Hello world!</p>' });
    expect(match).toBe(op.id);
  });

  it('normalizes whitespace and case', () => {
    const op = makeEntry({
      operationType: 'status.create',
      state: 'pending',
      payload: { content: '  Hello   World  ' },
      createdAt: Date.now(),
    });
    const match = detectDuplicateCreate([op], { content: '<p>hello world</p>' });
    expect(match).toBe(op.id);
  });

  it('returns null for non-matching content', () => {
    const op = makeEntry({
      operationType: 'status.create',
      state: 'pending',
      payload: { content: 'Something else' },
      createdAt: Date.now(),
    });
    const match = detectDuplicateCreate([op], { content: '<p>Totally different</p>' });
    expect(match).toBeNull();
  });

  it('ignores operations older than 5 minutes', () => {
    const op = makeEntry({
      operationType: 'status.create',
      state: 'pending',
      payload: { content: 'Old post' },
      createdAt: Date.now() - 10 * 60 * 1000, // 10 minutes ago
    });
    const match = detectDuplicateCreate([op], { content: '<p>Old post</p>' });
    expect(match).toBeNull();
  });

  it('ignores completed operations', () => {
    const op = makeEntry({
      operationType: 'status.create',
      state: 'completed',
      payload: { content: 'Done' },
      createdAt: Date.now(),
    });
    const match = detectDuplicateCreate([op], { content: '<p>Done</p>' });
    expect(match).toBeNull();
  });

  it('ignores non-create operations', () => {
    const op = makeEntry({
      operationType: 'status.edit',
      state: 'pending',
      payload: { content: 'Edit', statusId: '123' },
      createdAt: Date.now(),
    });
    const match = detectDuplicateCreate([op], { content: '<p>Edit</p>' });
    expect(match).toBeNull();
  });

  it('returns null for empty content', () => {
    const match = detectDuplicateCreate([], { content: '' });
    expect(match).toBeNull();
  });
});

describe('isOperationStale', () => {
  it('returns false if server event is older than operation', () => {
    const op = makeEntry({ createdAt: 2000, state: 'pending' });
    expect(isOperationStale(op, 1000)).toBe(false);
  });

  it('returns true if server event is newer than pending operation', () => {
    const op = makeEntry({ createdAt: 1000, state: 'pending' });
    expect(isOperationStale(op, 2000)).toBe(true);
  });

  it('returns false for completed operations', () => {
    const op = makeEntry({ createdAt: 1000, state: 'completed' });
    expect(isOperationStale(op, 2000)).toBe(false);
  });

  it('returns false for cancelled operations', () => {
    const op = makeEntry({ createdAt: 1000, state: 'cancelled' });
    expect(isOperationStale(op, 2000)).toBe(false);
  });
});
