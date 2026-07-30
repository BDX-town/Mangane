/**
 * Phase 6 — Retry scheduling with exponential backoff, jitter, and bounds.
 *
 * Computes the next retry delay for a failed outbox operation.
 * Implements the requirements from TECHNICAL_ARCHITECTURE.md §9:
 * - Exponential backoff with jitter
 * - Upper bounds (max 5 minutes between retries)
 * - Server-suggested Retry-After honored when present
 * - Rate-limited operations respect server timing
 *
 * The formula is: min(maxDelay, baseDelay * 2^attempt * jitter)
 * where jitter is uniform random in [0.5, 1.5].
 */

import type { FailureReason, OutboxEntry } from './outbox-operation';

// ─── Configuration ───────────────────────────────────────────────────────────

export interface RetryConfig {
  /** Base delay in ms for the first retry. Default: 1000ms. */
  baseDelayMs: number;
  /** Maximum delay cap in ms. Default: 300_000ms (5 minutes). */
  maxDelayMs: number;
  /** Minimum jitter multiplier. Default: 0.5. */
  jitterMin: number;
  /** Maximum jitter multiplier. Default: 1.5. */
  jitterMax: number;
}

export const DEFAULT_RETRY_CONFIG: Readonly<RetryConfig> = {
  baseDelayMs: 1_000,
  maxDelayMs: 300_000, // 5 minutes
  jitterMin: 0.5,
  jitterMax: 1.5,
};

// ─── Rate-limit aware overrides ──────────────────────────────────────────────

/** Delay overrides based on failure reason (before exponential calc). */
const REASON_BASE_DELAY: Partial<Record<FailureReason, number>> = {
  'rate-limited': 10_000, // Start higher for rate limits
  'server-error': 3_000,  // 5xx — give server time to recover
  'timeout': 2_000,       // Timeout — slight breathing room
};

// ─── Core Scheduling ─────────────────────────────────────────────────────────

/**
 * Compute the next retry timestamp for a failed operation.
 *
 * @param entry - The outbox entry that failed.
 * @param now - Current time in ms (injectable for testing).
 * @param config - Retry configuration (defaults to standard values).
 * @param random - Random number generator [0,1) (injectable for testing).
 * @returns Absolute timestamp (ms) for the next attempt, or null if no retry.
 */
export function computeNextAttemptAt(
  entry: Pick<OutboxEntry, 'attemptCount' | 'lastFailureReason' | 'serverRetryAfterMs' | 'maxAttempts'>,
  now: number = Date.now(),
  config: RetryConfig = DEFAULT_RETRY_CONFIG,
  random: () => number = Math.random,
): number | null {
  // No more retries available
  if (entry.attemptCount >= entry.maxAttempts) return null;

  // If server provided a Retry-After, respect it (with bounds)
  if (entry.serverRetryAfterMs !== null && entry.serverRetryAfterMs > 0) {
    const bounded = Math.min(entry.serverRetryAfterMs, config.maxDelayMs);
    return now + bounded;
  }

  // Select base delay (reason-specific or default)
  const reasonBase = entry.lastFailureReason
    ? REASON_BASE_DELAY[entry.lastFailureReason] ?? config.baseDelayMs
    : config.baseDelayMs;

  // Exponential: base * 2^(attemptCount - 1), since attemptCount already includes the failed one
  const exponentialFactor = Math.pow(2, Math.max(0, entry.attemptCount - 1));
  const exponentialDelay = reasonBase * exponentialFactor;

  // Jitter: uniform random in [jitterMin, jitterMax]
  const jitter = config.jitterMin + random() * (config.jitterMax - config.jitterMin);
  const jitteredDelay = exponentialDelay * jitter;

  // Apply upper bound
  const cappedDelay = Math.min(jitteredDelay, config.maxDelayMs);

  // Floor to avoid sub-ms scheduling
  return now + Math.ceil(cappedDelay);
}

/**
 * Determine if an operation should be retried based on its current state.
 * Returns false for:
 * - Terminal states (completed, cancelled, failed at max attempts)
 * - Permanent failure reasons (auth, validation, not-found, gone)
 */
export function shouldRetry(
  entry: Pick<OutboxEntry, 'attemptCount' | 'maxAttempts' | 'lastFailureReason' | 'state'>,
): boolean {
  if (entry.state === 'completed' || entry.state === 'cancelled' || entry.state === 'failed') {
    return false;
  }
  if (entry.attemptCount >= entry.maxAttempts) return false;
  if (entry.lastFailureReason && !isRetryableReason(entry.lastFailureReason)) return false;
  return true;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Reasons that permit automatic retry. */
function isRetryableReason(reason: FailureReason): boolean {
  switch (reason) {
    case 'network':
    case 'timeout':
    case 'rate-limited':
    case 'server-error':
    case 'quota-exceeded':
    case 'unknown':
      return true;
    default:
      return false;
  }
}
