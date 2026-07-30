/**
 * Phase 6C — Status interaction executors.
 *
 * Handles: favourite, unfavourite, reblog, unreblog, bookmark, unbookmark,
 * pin, unpin, mute, unmute.
 *
 * These are all toggle-style operations with "skip-if-done" conflict policy.
 * The executor validates the target status ID and sends the toggle request.
 *
 * Security:
 * - Status IDs validated (non-empty, bounded length, no control chars)
 * - All requests use relative URLs (SSRF prevention via transport layer)
 * - encodeURIComponent on all path parameters (path traversal prevention)
 */

import { ApplicationError } from 'soapbox/domain/application-error';

import { executeRequest } from '../outbox-transport';

import type { OperationExecutor } from '../outbox-processor';
import type { AccountScope } from 'soapbox/db/repository';
import type { OutboxEntry } from 'soapbox/domain/outbox-operation';

// ─── Shared validation ───────────────────────────────────────────────────────

const MAX_ID_LENGTH = 512;

interface StatusTargetPayload {
  statusId: string;
}

function validateStatusTargetPayload(payload: unknown, operationType: string): StatusTargetPayload {
  if (!payload || typeof payload !== 'object') {
    throw new ApplicationError({
      kind: 'validation',
      message: `Outbox payload: ${operationType} requires an object payload.`,
    });
  }
  const p = payload as Record<string, unknown>;
  if (typeof p.statusId !== 'string' || p.statusId.length === 0 || p.statusId.length > MAX_ID_LENGTH) {
    throw new ApplicationError({
      kind: 'validation',
      message: `Outbox payload: ${operationType} requires a valid statusId.`,
    });
  }
  // eslint-disable-next-line no-control-regex
  if (/[\x00-\x1f]/.test(p.statusId)) {
    throw new ApplicationError({
      kind: 'validation',
      message: 'Outbox payload: statusId contains prohibited characters.',
    });
  }
  return { statusId: p.statusId };
}

// ─── Generic toggle executor factory ─────────────────────────────────────────

function createStatusToggleExecutor(action: string): OperationExecutor {
  return async(
    entry: OutboxEntry,
    scope: AccountScope,
    signal: AbortSignal,
  ): Promise<unknown> => {
    const { statusId } = validateStatusTargetPayload(entry.payload, `status.${action}`);
    const response = await executeRequest(scope, entry, {
      method: 'POST',
      url: `/api/v1/statuses/${encodeURIComponent(statusId)}/${action}`,
      signal,
    });
    return response.data;
  };
}

// ─── Exported executors ──────────────────────────────────────────────────────

export const executeStatusFavourite = createStatusToggleExecutor('favourite');
export const executeStatusUnfavourite = createStatusToggleExecutor('unfavourite');
export const executeStatusReblog = createStatusToggleExecutor('reblog');
export const executeStatusUnreblog = createStatusToggleExecutor('unreblog');
export const executeStatusBookmark = createStatusToggleExecutor('bookmark');
export const executeStatusUnbookmark = createStatusToggleExecutor('unbookmark');
export const executeStatusPin = createStatusToggleExecutor('pin');
export const executeStatusUnpin = createStatusToggleExecutor('unpin');
export const executeStatusMute = createStatusToggleExecutor('mute');
export const executeStatusUnmute = createStatusToggleExecutor('unmute');
