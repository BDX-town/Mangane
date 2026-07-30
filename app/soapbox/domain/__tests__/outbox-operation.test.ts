import {
  DEFAULT_CONFLICT_POLICY,
  DEFAULT_IDEMPOTENCY,
  isRetryable,
  MAX_ATTEMPTS,
  PERMANENT_FAILURES,
} from '../outbox-operation';

import type { FailureReason, OutboxOperationType } from '../outbox-operation';

describe('outbox-operation constants', () => {
  const ALL_OPERATION_TYPES: OutboxOperationType[] = [
    'status.create', 'status.edit', 'status.delete',
    'status.favourite', 'status.unfavourite',
    'status.reblog', 'status.unreblog',
    'status.bookmark', 'status.unbookmark',
    'status.pin', 'status.unpin',
    'status.mute', 'status.unmute',
    'media.upload', 'poll.vote',
    'account.follow', 'account.unfollow',
    'account.block', 'account.unblock',
    'account.mute', 'account.unmute',
    'report.create',
    'notification.dismiss', 'notifications.clear',
    'marker.update',
  ];

  it('MAX_ATTEMPTS covers all operation types', () => {
    for (const type of ALL_OPERATION_TYPES) {
      expect(MAX_ATTEMPTS[type]).toBeGreaterThanOrEqual(1);
    }
  });

  it('DEFAULT_IDEMPOTENCY covers all operation types', () => {
    for (const type of ALL_OPERATION_TYPES) {
      expect(DEFAULT_IDEMPOTENCY[type]).toBeDefined();
    }
  });

  it('DEFAULT_CONFLICT_POLICY covers all operation types', () => {
    for (const type of ALL_OPERATION_TYPES) {
      expect(DEFAULT_CONFLICT_POLICY[type]).toBeDefined();
    }
  });

  it('max attempts are reasonable (1-10 range)', () => {
    for (const type of ALL_OPERATION_TYPES) {
      expect(MAX_ATTEMPTS[type]).toBeGreaterThanOrEqual(1);
      expect(MAX_ATTEMPTS[type]).toBeLessThanOrEqual(10);
    }
  });

  it('status.create uses idempotency-key strategy', () => {
    expect(DEFAULT_IDEMPOTENCY['status.create']).toBe('idempotency-key');
  });

  it('status.delete is naturally-idempotent', () => {
    expect(DEFAULT_IDEMPOTENCY['status.delete']).toBe('naturally-idempotent');
  });

  it('toggles use check-before-send', () => {
    expect(DEFAULT_IDEMPOTENCY['status.favourite']).toBe('check-before-send');
    expect(DEFAULT_IDEMPOTENCY['account.follow']).toBe('check-before-send');
  });

  it('status.edit uses fail-on-conflict policy', () => {
    expect(DEFAULT_CONFLICT_POLICY['status.edit']).toBe('fail-on-conflict');
  });

  it('marker.update uses last-write-wins policy', () => {
    expect(DEFAULT_CONFLICT_POLICY['marker.update']).toBe('last-write-wins');
  });

  it('delete operations use skip-if-done policy', () => {
    expect(DEFAULT_CONFLICT_POLICY['status.delete']).toBe('skip-if-done');
  });
});

describe('isRetryable', () => {
  it('returns false for all permanent failures', () => {
    const permanent: FailureReason[] = ['unauthorized', 'forbidden', 'validation', 'not-found', 'gone', 'cancelled'];
    for (const reason of permanent) {
      expect(isRetryable(reason)).toBe(false);
    }
  });

  it('returns true for transient failures', () => {
    const transient: FailureReason[] = ['network', 'timeout', 'rate-limited', 'server-error', 'quota-exceeded', 'conflict', 'unknown'];
    for (const reason of transient) {
      expect(isRetryable(reason)).toBe(true);
    }
  });

  it('PERMANENT_FAILURES set is consistent with isRetryable', () => {
    for (const reason of PERMANENT_FAILURES) {
      expect(isRetryable(reason)).toBe(false);
    }
  });
});
