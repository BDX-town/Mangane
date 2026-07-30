import { computeNextAttemptAt, shouldRetry, DEFAULT_RETRY_CONFIG } from '../outbox-retry';

import type { OutboxEntry } from '../outbox-operation';

describe('computeNextAttemptAt', () => {
  const now = 1_000_000;
  const fixedRandom = () => 0.5; // Produces jitter of exactly 1.0

  const baseEntry = {
    attemptCount: 1,
    lastFailureReason: 'network' as const,
    serverRetryAfterMs: null,
    maxAttempts: 5,
  };

  it('returns null when attemptCount >= maxAttempts', () => {
    const entry = { ...baseEntry, attemptCount: 5 };
    expect(computeNextAttemptAt(entry, now, DEFAULT_RETRY_CONFIG, fixedRandom)).toBeNull();
  });

  it('computes exponential backoff for first retry', () => {
    const entry = { ...baseEntry, attemptCount: 1 };
    // base=1000, exponential=2^0=1, jitter=1.0 → delay=1000
    const result = computeNextAttemptAt(entry, now, DEFAULT_RETRY_CONFIG, fixedRandom);
    expect(result).toBe(now + 1000);
  });

  it('doubles delay on second retry', () => {
    const entry = { ...baseEntry, attemptCount: 2 };
    // base=1000, exponential=2^1=2, jitter=1.0 → delay=2000
    const result = computeNextAttemptAt(entry, now, DEFAULT_RETRY_CONFIG, fixedRandom);
    expect(result).toBe(now + 2000);
  });

  it('applies exponential growth on subsequent retries', () => {
    const entry = { ...baseEntry, attemptCount: 4 };
    // base=1000, exponential=2^3=8, jitter=1.0 → delay=8000
    const result = computeNextAttemptAt(entry, now, DEFAULT_RETRY_CONFIG, fixedRandom);
    expect(result).toBe(now + 8000);
  });

  it('caps delay at maxDelayMs', () => {
    // Use high attempt count but below maxAttempts to test the cap
    const entry = { ...baseEntry, attemptCount: 4, maxAttempts: 20 };
    const result = computeNextAttemptAt(entry, now, DEFAULT_RETRY_CONFIG, fixedRandom);
    // base=1000, exponential=2^3=8, jitter=1.0 → 8000
    // At attempt 4 this won't hit the cap. Use a larger attempt:
    const bigEntry = { ...baseEntry, attemptCount: 15, maxAttempts: 20 };
    const bigResult = computeNextAttemptAt(bigEntry, now, DEFAULT_RETRY_CONFIG, fixedRandom);
    // base=1000, exponential=2^14=16384, jitter=1.0 → 16_384_000 > 300_000
    expect(bigResult).toBe(now + DEFAULT_RETRY_CONFIG.maxDelayMs);
  });

  it('respects server-provided retryAfterMs', () => {
    const entry = { ...baseEntry, serverRetryAfterMs: 5000 };
    const result = computeNextAttemptAt(entry, now, DEFAULT_RETRY_CONFIG, fixedRandom);
    expect(result).toBe(now + 5000);
  });

  it('bounds server retryAfterMs to maxDelayMs', () => {
    const entry = { ...baseEntry, serverRetryAfterMs: 999_999 };
    const result = computeNextAttemptAt(entry, now, DEFAULT_RETRY_CONFIG, fixedRandom);
    expect(result).toBe(now + DEFAULT_RETRY_CONFIG.maxDelayMs);
  });

  it('applies jitter variation', () => {
    const lowJitter = () => 0; // min jitter = 0.5
    const highJitter = () => 1; // max jitter = 1.5
    const entry = { ...baseEntry, attemptCount: 1 };

    const low = computeNextAttemptAt(entry, now, DEFAULT_RETRY_CONFIG, lowJitter);
    const high = computeNextAttemptAt(entry, now, DEFAULT_RETRY_CONFIG, highJitter);

    // base=1000, exp=1, low jitter=0.5 → 500, high jitter=1.5 → 1500
    expect(low).toBe(now + 500);
    expect(high).toBe(now + 1500);
  });

  it('uses higher base delay for rate-limited failures', () => {
    const entry = { ...baseEntry, attemptCount: 1, lastFailureReason: 'rate-limited' as const };
    // rate-limited base is 10_000, exp=1, jitter=1.0 → 10_000
    const result = computeNextAttemptAt(entry, now, DEFAULT_RETRY_CONFIG, fixedRandom);
    expect(result).toBe(now + 10_000);
  });

  it('uses higher base delay for server errors', () => {
    const entry = { ...baseEntry, attemptCount: 1, lastFailureReason: 'server-error' as const };
    // server-error base is 3000, exp=1, jitter=1.0 → 3000
    const result = computeNextAttemptAt(entry, now, DEFAULT_RETRY_CONFIG, fixedRandom);
    expect(result).toBe(now + 3000);
  });

  it('returns timestamp in the future (never in the past)', () => {
    const entry = { ...baseEntry, attemptCount: 1 };
    const result = computeNextAttemptAt(entry, now, DEFAULT_RETRY_CONFIG, fixedRandom);
    expect(result).toBeGreaterThan(now);
  });
});

describe('shouldRetry', () => {
  it('returns false for completed state', () => {
    expect(shouldRetry({ state: 'completed', attemptCount: 1, maxAttempts: 5, lastFailureReason: null })).toBe(false);
  });

  it('returns false for cancelled state', () => {
    expect(shouldRetry({ state: 'cancelled', attemptCount: 1, maxAttempts: 5, lastFailureReason: null })).toBe(false);
  });

  it('returns false for failed state', () => {
    expect(shouldRetry({ state: 'failed', attemptCount: 5, maxAttempts: 5, lastFailureReason: 'network' })).toBe(false);
  });

  it('returns false when attemptCount >= maxAttempts', () => {
    expect(shouldRetry({ state: 'retrying', attemptCount: 5, maxAttempts: 5, lastFailureReason: 'network' })).toBe(false);
  });

  it('returns false for permanent failure reasons', () => {
    const permanent = ['unauthorized', 'forbidden', 'validation', 'not-found', 'gone', 'cancelled'] as const;
    for (const reason of permanent) {
      expect(shouldRetry({ state: 'retrying', attemptCount: 1, maxAttempts: 5, lastFailureReason: reason })).toBe(false);
    }
  });

  it('returns true for transient failure reasons', () => {
    const transient = ['network', 'timeout', 'rate-limited', 'server-error', 'unknown'] as const;
    for (const reason of transient) {
      expect(shouldRetry({ state: 'retrying', attemptCount: 1, maxAttempts: 5, lastFailureReason: reason })).toBe(true);
    }
  });

  it('returns true for pending state with no failure', () => {
    expect(shouldRetry({ state: 'pending', attemptCount: 0, maxAttempts: 5, lastFailureReason: null })).toBe(true);
  });
});
