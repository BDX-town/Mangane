/**
 * Phase 6E — Conflict resolver tests.
 *
 * Tests conflict analysis and resolution computation for edit/create conflicts.
 */

import { analyzeConflict, computeResolution } from '../conflict-resolver';

import type { OutboxEntry } from 'soapbox/domain/outbox-operation';

function makeEntry(overrides: Partial<OutboxEntry> = {}): OutboxEntry {
  return {
    id: 'op-conflict',
    accountUrl: 'https://instance.example/users/alice',
    operationType: 'status.edit',
    state: 'conflict',
    payload: { statusId: 'status-123', content: 'My edited content' },
    idempotencyKey: null,
    idempotencyStrategy: 'idempotency-key',
    conflictPolicy: 'fail-on-conflict',
    dependsOn: [],
    priority: 100,
    createdAt: Date.now(),
    attemptedAt: Date.now(),
    nextAttemptAt: null,
    completedAt: null,
    attemptCount: 1,
    maxAttempts: 5,
    lastFailureReason: 'conflict',
    lastErrorMessage: 'Remote edit detected.',
    serverRetryAfterMs: null,
    result: null,
    ...overrides,
  };
}

describe('analyzeConflict', () => {
  it('returns empty strategies for non-conflict operations', () => {
    const op = makeEntry({ state: 'pending' });
    const info = analyzeConflict(op);
    expect(info.availableStrategies).toHaveLength(0);
  });

  it('provides edit-specific strategies for status.edit conflicts', () => {
    const op = makeEntry({ operationType: 'status.edit', state: 'conflict' });
    const info = analyzeConflict(op);
    expect(info.availableStrategies).toContain('keep-local');
    expect(info.availableStrategies).toContain('keep-remote');
    expect(info.availableStrategies).toContain('keep-both');
    expect(info.availableStrategies).toContain('cancel');
    expect(info.hasContentAtRisk).toBe(true);
    expect(info.localContent).toBe('My edited content');
  });

  it('provides create-specific strategies for status.create conflicts', () => {
    const op = makeEntry({
      operationType: 'status.create',
      state: 'conflict',
      payload: { content: 'New post' },
    });
    const info = analyzeConflict(op);
    expect(info.availableStrategies).toContain('retry');
    expect(info.availableStrategies).toContain('keep-both');
    expect(info.availableStrategies).toContain('cancel');
    expect(info.hasContentAtRisk).toBe(true);
    expect(info.localContent).toBe('New post');
  });

  it('provides generic strategies for other operation types', () => {
    const op = makeEntry({
      operationType: 'account.follow',
      state: 'conflict',
      payload: { accountId: 'acc-1' },
    });
    const info = analyzeConflict(op);
    expect(info.availableStrategies).toContain('retry');
    expect(info.availableStrategies).toContain('cancel');
    expect(info.hasContentAtRisk).toBe(false);
    expect(info.localContent).toBeNull();
  });

  it('handles null payload gracefully', () => {
    const op = makeEntry({
      operationType: 'status.edit',
      state: 'conflict',
      payload: null,
    });
    const info = analyzeConflict(op);
    expect(info.hasContentAtRisk).toBe(false);
    expect(info.localContent).toBeNull();
  });
});

describe('computeResolution', () => {
  const op = makeEntry();

  it('keep-local instructs retry without draft', () => {
    const result = computeResolution(op, 'keep-local');
    expect(result.outboxAction).toBe('retry');
    expect(result.saveDraft).toBe(false);
  });

  it('keep-remote instructs discard without draft', () => {
    const result = computeResolution(op, 'keep-remote');
    expect(result.outboxAction).toBe('discard');
    expect(result.saveDraft).toBe(false);
  });

  it('keep-both instructs cancel with draft saved', () => {
    const result = computeResolution(op, 'keep-both');
    expect(result.outboxAction).toBe('cancel');
    expect(result.saveDraft).toBe(true);
    expect(result.draftContent).toBe('My edited content');
  });

  it('keep-both with null content saves null draft', () => {
    const noContentOp = makeEntry({ payload: { statusId: '123' } });
    const result = computeResolution(noContentOp, 'keep-both');
    expect(result.saveDraft).toBe(true);
    expect(result.draftContent).toBeNull();
  });

  it('retry instructs retry without draft', () => {
    const result = computeResolution(op, 'retry');
    expect(result.outboxAction).toBe('retry');
    expect(result.saveDraft).toBe(false);
  });

  it('cancel instructs cancel without draft', () => {
    const result = computeResolution(op, 'cancel');
    expect(result.outboxAction).toBe('cancel');
    expect(result.saveDraft).toBe(false);
  });
});
