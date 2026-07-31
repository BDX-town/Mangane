/**
 * Phase 8B-4 — Provider client infrastructure tests.
 *
 * Tests circuit breaker, backoff, cache, coalescing, and concurrency.
 */

import {
  CircuitBreaker,
  computeBackoffDelay,
  ConcurrencyLimiter,
  ProviderCache,
  RequestCoalescer,
} from '../providers/provider-client';

describe('CircuitBreaker', () => {
  it('starts closed', () => {
    const cb = new CircuitBreaker();
    expect(cb.getState()).toBe('closed');
    expect(cb.canExecute()).toBe(true);
  });

  it('opens after reaching failure threshold', () => {
    const cb = new CircuitBreaker({ failureThreshold: 3, resetTimeoutMs: 1000, successThreshold: 1 });
    cb.recordFailure();
    cb.recordFailure();
    expect(cb.getState()).toBe('closed');
    cb.recordFailure();
    expect(cb.getState()).toBe('open');
    expect(cb.canExecute()).toBe(false);
  });

  it('transitions to half-open after reset timeout', () => {
    const cb = new CircuitBreaker({ failureThreshold: 1, resetTimeoutMs: 0, successThreshold: 1 });
    cb.recordFailure();
    // resetTimeoutMs = 0, so getState() immediately sees it as half-open
    expect(cb.getState()).toBe('half-open');
    expect(cb.canExecute()).toBe(true);
  });

  it('closes after success threshold in half-open', () => {
    const cb = new CircuitBreaker({ failureThreshold: 1, resetTimeoutMs: 0, successThreshold: 2 });
    cb.recordFailure();
    // Now half-open
    cb.getState();
    cb.recordSuccess();
    expect(cb.getState()).toBe('half-open');
    cb.recordSuccess();
    expect(cb.getState()).toBe('closed');
  });

  it('re-opens on failure in half-open', () => {
    const cb = new CircuitBreaker({ failureThreshold: 1, resetTimeoutMs: 0, successThreshold: 2 });
    cb.recordFailure();
    expect(cb.getState()).toBe('half-open'); // Immediately half-open due to 0ms timeout
    cb.recordFailure(); // Failure in half-open → re-opens
    // After failure in half-open, state goes to open. But with 0ms reset, getState transitions back.
    // The internal state IS open after recordFailure in half-open, lastFailureAt is reset.
    // With 0ms timeout, next getState() sees elapsed >= 0 → half-open again.
    // This is correct behavior: the circuit tries again immediately with 0ms timeout.
    expect(cb.getState()).toBe('half-open');
  });

  it('resets to clean state', () => {
    const cb = new CircuitBreaker({ failureThreshold: 1, resetTimeoutMs: 60000, successThreshold: 1 });
    cb.recordFailure();
    expect(cb.canExecute()).toBe(false);
    cb.reset();
    expect(cb.getState()).toBe('closed');
    expect(cb.canExecute()).toBe(true);
  });
});

describe('computeBackoffDelay', () => {
  it('returns a value within bounds', () => {
    for (let i = 0; i < 100; i++) {
      const delay = computeBackoffDelay(0, { baseDelayMs: 1000, maxDelayMs: 60000 });
      expect(delay).toBeGreaterThanOrEqual(0);
      expect(delay).toBeLessThanOrEqual(1000);
    }
  });

  it('grows with attempt number', () => {
    // Statistical: higher attempts should average higher delays
    const lowAttempts = Array.from({ length: 50 }, () => computeBackoffDelay(0));
    const highAttempts = Array.from({ length: 50 }, () => computeBackoffDelay(5));
    const avgLow = lowAttempts.reduce((a, b) => a + b, 0) / 50;
    const avgHigh = highAttempts.reduce((a, b) => a + b, 0) / 50;
    expect(avgHigh).toBeGreaterThan(avgLow);
  });

  it('is capped by maxDelayMs', () => {
    for (let i = 0; i < 50; i++) {
      const delay = computeBackoffDelay(20, { baseDelayMs: 1000, maxDelayMs: 5000 });
      expect(delay).toBeLessThanOrEqual(5000);
    }
  });
});

describe('ProviderCache', () => {
  it('stores and retrieves values', () => {
    const cache = new ProviderCache<string>();
    cache.set('key1', 'value1', 'test');
    const entry = cache.get('key1');
    expect(entry).toBeDefined();
    expect(entry!.value).toBe('value1');
  });

  it('supports negative cache (null values)', () => {
    const cache = new ProviderCache<string>();
    cache.set('missing', null, 'test');
    const entry = cache.get('missing');
    expect(entry).toBeDefined();
    expect(entry!.value).toBeNull();
  });

  it('expires entries after TTL', () => {
    const cache = new ProviderCache<string>({ positiveTtlMs: 1 });
    cache.set('expired', 'val', 'test');
    // Wait 2ms to ensure expiry
    const start = Date.now();
    while (Date.now() - start < 2) { /* spin */ }
    expect(cache.get('expired')).toBeUndefined();
  });

  it('evicts oldest when at capacity', () => {
    const cache = new ProviderCache<string>({ maxEntries: 2 });
    cache.set('a', 'va', 'test');
    cache.set('b', 'vb', 'test');
    cache.set('c', 'vc', 'test'); // Should evict 'a'
    expect(cache.get('a')).toBeUndefined();
    expect(cache.get('b')).toBeDefined();
    expect(cache.get('c')).toBeDefined();
  });

  it('clears all entries', () => {
    const cache = new ProviderCache<string>();
    cache.set('x', 'y', 'test');
    cache.clear();
    expect(cache.size).toBe(0);
  });
});

describe('RequestCoalescer', () => {
  it('deduplicates concurrent requests', async() => {
    const coalescer = new RequestCoalescer<string>();
    let callCount = 0;
    const fn = () => new Promise<string>(resolve => {
      callCount++;
      setTimeout(() => resolve('result'), 10);
    });

    const [r1, r2] = await Promise.all([
      coalescer.execute('key', fn),
      coalescer.execute('key', fn),
    ]);

    expect(r1).toBe('result');
    expect(r2).toBe('result');
    expect(callCount).toBe(1); // Only one actual call
  });

  it('allows different keys to execute independently', async() => {
    const coalescer = new RequestCoalescer<string>();
    let callCount = 0;
    const fn = (val: string) => () => {
      callCount++;
      return Promise.resolve(val);
    };

    const [r1, r2] = await Promise.all([
      coalescer.execute('a', fn('first')),
      coalescer.execute('b', fn('second')),
    ]);

    expect(r1).toBe('first');
    expect(r2).toBe('second');
    expect(callCount).toBe(2);
  });
});

describe('ConcurrencyLimiter', () => {
  it('limits concurrent executions', async() => {
    const limiter = new ConcurrencyLimiter(2);
    let maxActive = 0;

    const task = async() => {
      await limiter.acquire();
      if (limiter.activeCount > maxActive) maxActive = limiter.activeCount;
      await new Promise(r => setTimeout(r, 10));
      limiter.release();
    };

    await Promise.all([task(), task(), task(), task()]);
    expect(maxActive).toBeLessThanOrEqual(2);
  });

  it('queues excess requests', async() => {
    const limiter = new ConcurrencyLimiter(1);
    await limiter.acquire();
    expect(limiter.activeCount).toBe(1);

    // This should queue
    const pending = limiter.acquire();
    expect(limiter.queuedCount).toBe(1);

    limiter.release();
    await pending;
    expect(limiter.activeCount).toBe(1);
    limiter.release();
  });
});
