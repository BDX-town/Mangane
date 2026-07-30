/**
 * Phase 6C — Account relationship executors.
 *
 * Handles: account.follow, account.unfollow, account.block, account.unblock,
 * account.mute, account.unmute.
 *
 * Security:
 * - Account IDs validated (non-empty, bounded, no control chars)
 * - Path parameters URI-encoded
 * - Follow supports options (reblogs, notify) — validated as booleans
 */

import { ApplicationError } from 'soapbox/domain/application-error';

import { executeRequest } from '../outbox-transport';

import type { OperationExecutor } from '../outbox-processor';
import type { AccountScope } from 'soapbox/db/repository';
import type { OutboxEntry } from 'soapbox/domain/outbox-operation';

// ─── Validation ──────────────────────────────────────────────────────────────

const MAX_ID_LENGTH = 512;

interface AccountTargetPayload {
  accountId: string;
}

interface AccountFollowPayload extends AccountTargetPayload {
  reblogs?: boolean;
  notify?: boolean;
  languages?: string[];
}

interface AccountMutePayload extends AccountTargetPayload {
  notifications?: boolean;
  duration?: number;
}

function validateAccountId(payload: unknown, operationType: string): AccountTargetPayload {
  if (!payload || typeof payload !== 'object') {
    throw new ApplicationError({
      kind: 'validation',
      message: `Outbox payload: ${operationType} requires an object payload.`,
    });
  }
  const p = payload as Record<string, unknown>;
  if (typeof p.accountId !== 'string' || p.accountId.length === 0 || p.accountId.length > MAX_ID_LENGTH) {
    throw new ApplicationError({
      kind: 'validation',
      message: `Outbox payload: ${operationType} requires a valid accountId.`,
    });
  }
  // eslint-disable-next-line no-control-regex
  if (/[\x00-\x1f]/.test(p.accountId)) {
    throw new ApplicationError({
      kind: 'validation',
      message: 'Outbox payload: accountId contains prohibited characters.',
    });
  }
  return { accountId: p.accountId };
}

function validateFollowPayload(payload: unknown): AccountFollowPayload {
  const base = validateAccountId(payload, 'account.follow');
  const p = payload as Record<string, unknown>;
  const result: AccountFollowPayload = { ...base };
  if (p.reblogs !== undefined) result.reblogs = Boolean(p.reblogs);
  if (p.notify !== undefined) result.notify = Boolean(p.notify);
  if (Array.isArray(p.languages)) {
    result.languages = p.languages
      .filter((l): l is string => typeof l === 'string' && l.length > 0 && l.length <= 10)
      .slice(0, 20);
  }
  return result;
}

function validateMutePayload(payload: unknown): AccountMutePayload {
  const base = validateAccountId(payload, 'account.mute');
  const p = payload as Record<string, unknown>;
  const result: AccountMutePayload = { ...base };
  if (p.notifications !== undefined) result.notifications = Boolean(p.notifications);
  if (p.duration !== undefined) {
    const d = Number(p.duration);
    if (Number.isFinite(d) && d >= 0) result.duration = d;
  }
  return result;
}

// ─── Executors ───────────────────────────────────────────────────────────────

export const executeAccountFollow: OperationExecutor = async(
  entry: OutboxEntry,
  scope: AccountScope,
  signal: AbortSignal,
): Promise<unknown> => {
  const payload = validateFollowPayload(entry.payload);
  const body: Record<string, unknown> = {};
  if (payload.reblogs !== undefined) body.reblogs = payload.reblogs;
  if (payload.notify !== undefined) body.notify = payload.notify;
  if (payload.languages) body.languages = payload.languages;

  const response = await executeRequest(scope, entry, {
    method: 'POST',
    url: `/api/v1/accounts/${encodeURIComponent(payload.accountId)}/follow`,
    data: Object.keys(body).length > 0 ? body : undefined,
    signal,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const executeAccountUnfollow: OperationExecutor = async(
  entry: OutboxEntry,
  scope: AccountScope,
  signal: AbortSignal,
): Promise<unknown> => {
  const { accountId } = validateAccountId(entry.payload, 'account.unfollow');
  const response = await executeRequest(scope, entry, {
    method: 'POST',
    url: `/api/v1/accounts/${encodeURIComponent(accountId)}/unfollow`,
    signal,
  });
  return response.data;
};

export const executeAccountBlock: OperationExecutor = async(
  entry: OutboxEntry,
  scope: AccountScope,
  signal: AbortSignal,
): Promise<unknown> => {
  const { accountId } = validateAccountId(entry.payload, 'account.block');
  const response = await executeRequest(scope, entry, {
    method: 'POST',
    url: `/api/v1/accounts/${encodeURIComponent(accountId)}/block`,
    signal,
  });
  return response.data;
};

export const executeAccountUnblock: OperationExecutor = async(
  entry: OutboxEntry,
  scope: AccountScope,
  signal: AbortSignal,
): Promise<unknown> => {
  const { accountId } = validateAccountId(entry.payload, 'account.unblock');
  const response = await executeRequest(scope, entry, {
    method: 'POST',
    url: `/api/v1/accounts/${encodeURIComponent(accountId)}/unblock`,
    signal,
  });
  return response.data;
};

export const executeAccountMute: OperationExecutor = async(
  entry: OutboxEntry,
  scope: AccountScope,
  signal: AbortSignal,
): Promise<unknown> => {
  const payload = validateMutePayload(entry.payload);
  const body: Record<string, unknown> = {};
  if (payload.notifications !== undefined) body.notifications = payload.notifications;
  if (payload.duration !== undefined) body.duration = payload.duration;

  const response = await executeRequest(scope, entry, {
    method: 'POST',
    url: `/api/v1/accounts/${encodeURIComponent(payload.accountId)}/mute`,
    data: Object.keys(body).length > 0 ? body : undefined,
    signal,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const executeAccountUnmute: OperationExecutor = async(
  entry: OutboxEntry,
  scope: AccountScope,
  signal: AbortSignal,
): Promise<unknown> => {
  const { accountId } = validateAccountId(entry.payload, 'account.unmute');
  const response = await executeRequest(scope, entry, {
    method: 'POST',
    url: `/api/v1/accounts/${encodeURIComponent(accountId)}/unmute`,
    signal,
  });
  return response.data;
};
