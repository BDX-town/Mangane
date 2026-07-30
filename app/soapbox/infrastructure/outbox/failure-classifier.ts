/**
 * Phase 6 — Failure classification for outbox operations.
 *
 * Converts raw errors (axios, fetch, DOMException, etc.) into typed
 * FailureReason values. This determines whether an operation retries,
 * fails permanently, or surfaces as a conflict.
 *
 * Classification rules from TECHNICAL_ARCHITECTURE.md §9:
 * - 401/403: never retry (auth failure)
 * - 400/422: never retry (validation failure)
 * - 404/410: never retry (resource gone)
 * - 409: conflict (surface to user)
 * - 429: retry with server-suggested delay
 * - 5xx: retry with backoff
 * - Network error: retry with backoff
 * - Timeout: retry with backoff
 */

import { ApplicationError, normalizeTransportError } from 'soapbox/domain/application-error';

import type { FailureReason } from 'soapbox/domain/outbox-operation';

export interface ClassifiedFailure {
  reason: FailureReason;
  message: string;
  retryAfterMs: number | null;
}

/**
 * Classify any error into a structured failure for outbox processing.
 */
export function classifyError(error: unknown): ClassifiedFailure {
  // Already an ApplicationError
  if (error instanceof ApplicationError) {
    return {
      reason: mapKindToReason(error),
      message: error.message,
      retryAfterMs: error.retryAfterMs ?? null,
    };
  }

  // Abort signals
  if (error instanceof DOMException && error.name === 'AbortError') {
    return { reason: 'cancelled', message: 'Operation was cancelled.', retryAfterMs: null };
  }

  // Timeout detection
  if (error instanceof DOMException && error.name === 'TimeoutError') {
    return { reason: 'timeout', message: 'The request timed out.', retryAfterMs: null };
  }

  // Storage quota
  if (error instanceof DOMException && (error.name === 'QuotaExceededError' || error.code === 22)) {
    return { reason: 'quota-exceeded', message: 'Local storage quota exceeded.', retryAfterMs: null };
  }

  // Normalize through the existing transport error pipeline
  const normalized = normalizeTransportError(error, { online: navigator.onLine });
  return {
    reason: mapKindToReason(normalized),
    message: normalized.message,
    retryAfterMs: normalized.retryAfterMs ?? null,
  };
}

function mapKindToReason(error: ApplicationError): FailureReason {
  switch (error.kind) {
    case 'offline': return 'network';
    case 'unauthenticated': return 'unauthorized';
    case 'forbidden': return 'forbidden';
    case 'rate-limited': return 'rate-limited';
    case 'validation': return 'validation';
    case 'cancelled': return 'cancelled';
    case 'transient':
      if (error.status === 409) return 'conflict';
      return 'server-error';
    case 'protocol':
    case 'unsupported':
      return 'validation'; // Protocol/unsupported → don't retry
    case 'unknown':
    default:
      if (error.status === 404) return 'not-found';
      if (error.status === 409) return 'conflict';
      if (error.status === 410) return 'gone';
      if (error.status && error.status >= 500) return 'server-error';
      return 'unknown';
  }
}
