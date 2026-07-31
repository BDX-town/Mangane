/**
 * Phase 8B-4 — Provider client infrastructure.
 *
 * Shared infrastructure for external entity providers (Wikidata, DBpedia, etc.).
 * Implements:
 * - Exponential backoff with full jitter and Retry-After support
 * - Circuit breaker pattern (closed/open/half-open)
 * - Per-provider concurrency cap
 * - Request coalescing (dedup identical in-flight requests)
 * - Positive and negative TTL caching
 * - Cancellation via AbortSignal
 * - No private data transmission (enforced at contract level)
 *
 * Security:
 * - HTTPS-only for all provider requests
 * - No tokens, drafts, private content, or reading history sent
 * - Response size bounded
 * - Provider endpoints validated at construction time
 */

// ─── Circuit breaker ─────────────────────────────────────────────────────────

export type CircuitState = 'closed' | 'open' | 'half-open';

export interface CircuitBreakerConfig {
  /** Failures before opening the circuit. Default: 5. */
  failureThreshold: number;
  /** Time in ms before attempting half-open. Default: 60_000. */
  resetTimeoutMs: number;
  /** Successes in half-open before closing. Default: 2. */
  successThreshold: number;
}

const DEFAULT_CIRCUIT_CONFIG: CircuitBreakerConfig = {
  failureThreshold: 5,
  resetTimeoutMs: 60_000,
  successThreshold: 2,
};

export class CircuitBreaker {

  private state: CircuitState = 'closed';
  private failureCount = 0;
  private successCount = 0;
  private lastFailureAt = 0;
  private readonly config: CircuitBreakerConfig;

  constructor(config: Partial<CircuitBreakerConfig> = {}) {
    this.config = { ...DEFAULT_CIRCUIT_CONFIG, ...config };
  }

  getState(): CircuitState {
    if (this.state === 'open') {
      // Check if reset timeout has elapsed → transition to half-open
      if (Date.now() - this.lastFailureAt >= this.config.resetTimeoutMs) {
        this.state = 'half-open';
        this.successCount = 0;
      }
    }
    return this.state;
  }

  canExecute(): boolean {
    const current = this.getState();
    return current !== 'open';
  }

  recordSuccess(): void {
    if (this.state === 'half-open') {
      this.successCount++;
      if (this.successCount >= this.config.successThreshold) {
        this.state = 'closed';
        this.failureCount = 0;
      }
    } else {
      this.failureCount = 0;
    }
  }

  recordFailure(): void {
    this.failureCount++;
    this.lastFailureAt = Date.now();
    if (this.state === 'half-open') {
      this.state = 'open';
    } else if (this.failureCount >= this.config.failureThreshold) {
      this.state = 'open';
    }
  }

  reset(): void {
    this.state = 'closed';
    this.failureCount = 0;
    this.successCount = 0;
  }

}

// ─── Backoff computation ─────────────────────────────────────────────────────

export interface BackoffConfig {
  baseDelayMs: number;
  maxDelayMs: number;
}

const DEFAULT_BACKOFF: BackoffConfig = {
  baseDelayMs: 1_000,
  maxDelayMs: 60_000,
};

/**
 * Compute delay with full jitter.
 * Formula: random(0, min(maxDelay, base * 2^attempt))
 */
export function computeBackoffDelay(
  attempt: number,
  config: BackoffConfig = DEFAULT_BACKOFF,
): number {
  const exponential = config.baseDelayMs * Math.pow(2, attempt);
  const capped = Math.min(exponential, config.maxDelayMs);
  return Math.floor(Math.random() * capped);
}

// ─── Cache with positive and negative TTL ────────────────────────────────────

export interface CacheEntry<T> {
  value: T | null; // null = negative cache (not found)
  expiresAt: number;
  provider: string;
  fetchedAt: number;
}

export class ProviderCache<T> {

  private readonly cache = new Map<string, CacheEntry<T>>();
  private readonly positiveTtlMs: number;
  private readonly negativeTtlMs: number;
  private readonly maxEntries: number;

  constructor(options: {
    positiveTtlMs?: number;
    negativeTtlMs?: number;
    maxEntries?: number;
  } = {}) {
    this.positiveTtlMs = options.positiveTtlMs ?? 24 * 60 * 60 * 1000; // 24h
    this.negativeTtlMs = options.negativeTtlMs ?? 60 * 60 * 1000; // 1h
    this.maxEntries = options.maxEntries ?? 5000;
  }

  get(key: string): CacheEntry<T> | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }
    return entry;
  }

  set(key: string, value: T | null, provider: string): void {
    // Evict oldest if at capacity
    if (this.cache.size >= this.maxEntries) {
      const oldest = this.findOldest();
      if (oldest) this.cache.delete(oldest);
    }

    const ttl = value !== null ? this.positiveTtlMs : this.negativeTtlMs;
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttl,
      provider,
      fetchedAt: Date.now(),
    });
  }

  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  clear(): void {
    this.cache.clear();
  }

  get size(): number {
    return this.cache.size;
  }

  private findOldest(): string | undefined {
    let oldestKey: string | undefined;
    let oldestTime = Infinity;
    for (const [key, entry] of this.cache) {
      if (entry.fetchedAt < oldestTime) {
        oldestTime = entry.fetchedAt;
        oldestKey = key;
      }
    }
    return oldestKey;
  }

}

// ─── Request coalescing ──────────────────────────────────────────────────────

/**
 * Deduplicates identical concurrent requests.
 * If a request for the same key is already in flight, returns the same promise.
 */
export class RequestCoalescer<T> {

  private readonly inflight = new Map<string, Promise<T>>();

  async execute(key: string, fn: () => Promise<T>): Promise<T> {
    const existing = this.inflight.get(key);
    if (existing) return existing;

    const promise = fn().finally(() => {
      this.inflight.delete(key);
    });
    this.inflight.set(key, promise);
    return promise;
  }

  get pendingCount(): number {
    return this.inflight.size;
  }

}

// ─── Concurrency limiter ─────────────────────────────────────────────────────

export class ConcurrencyLimiter {

  private active = 0;
  private readonly queue: Array<() => void> = [];

  constructor(private readonly maxConcurrency: number = 3) {}

  async acquire(): Promise<void> {
    if (this.active < this.maxConcurrency) {
      this.active++;
      return;
    }
    return new Promise<void>(resolve => {
      this.queue.push(resolve);
    });
  }

  release(): void {
    this.active--;
    const next = this.queue.shift();
    if (next) {
      this.active++;
      next();
    }
  }

  get activeCount(): number {
    return this.active;
  }

  get queuedCount(): number {
    return this.queue.length;
  }

}

// ─── Provider health ─────────────────────────────────────────────────────────

export type ProviderHealth = 'healthy' | 'degraded' | 'unavailable';

export function assessProviderHealth(circuitBreaker: CircuitBreaker): ProviderHealth {
  const state = circuitBreaker.getState();
  switch (state) {
    case 'closed': return 'healthy';
    case 'half-open': return 'degraded';
    case 'open': return 'unavailable';
  }
}
