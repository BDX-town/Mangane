/**
 * Phase 6C — Miscellaneous executors.
 *
 * Handles: poll.vote, report.create, notification.dismiss,
 * notifications.clear, marker.update.
 *
 * Security:
 * - All IDs validated (non-empty, bounded, no control chars)
 * - Report reasons length-bounded
 * - Poll choices validated as integer arrays within bounds
 * - Marker values validated as strings
 */

import { ApplicationError } from 'soapbox/domain/application-error';

import { executeRequest } from '../outbox-transport';

import type { OperationExecutor } from '../outbox-processor';
import type { AccountScope } from 'soapbox/db/repository';
import type { OutboxEntry } from 'soapbox/domain/outbox-operation';

// ─── Shared validation ───────────────────────────────────────────────────────

const MAX_ID_LENGTH = 512;

function assertNonEmptyId(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.length === 0 || value.length > MAX_ID_LENGTH) {
    throw new ApplicationError({
      kind: 'validation',
      message: `Outbox payload: ${field} is invalid.`,
    });
  }
  // eslint-disable-next-line no-control-regex
  if (/[\x00-\x1f]/.test(value)) {
    throw new ApplicationError({
      kind: 'validation',
      message: `Outbox payload: ${field} contains prohibited characters.`,
    });
  }
  return value;
}

// ─── Poll Vote ───────────────────────────────────────────────────────────────

interface PollVotePayload {
  pollId: string;
  choices: number[];
}

function validatePollVotePayload(payload: unknown): PollVotePayload {
  if (!payload || typeof payload !== 'object') {
    throw new ApplicationError({
      kind: 'validation',
      message: 'Outbox payload: poll.vote requires an object payload.',
    });
  }
  const p = payload as Record<string, unknown>;
  const pollId = assertNonEmptyId(p.pollId, 'pollId');

  if (!Array.isArray(p.choices) || p.choices.length === 0 || p.choices.length > 20) {
    throw new ApplicationError({
      kind: 'validation',
      message: 'Outbox payload: poll.vote requires a non-empty choices array.',
    });
  }

  const choices = p.choices.map((c, i) => {
    const num = Number(c);
    if (!Number.isInteger(num) || num < 0 || num > 100) {
      throw new ApplicationError({
        kind: 'validation',
        message: `Outbox payload: choices[${i}] must be a non-negative integer.`,
      });
    }
    return num;
  });

  return { pollId, choices };
}

export const executePollVote: OperationExecutor = async(
  entry: OutboxEntry,
  scope: AccountScope,
  signal: AbortSignal,
): Promise<unknown> => {
  const { pollId, choices } = validatePollVotePayload(entry.payload);
  const response = await executeRequest(scope, entry, {
    method: 'POST',
    url: `/api/v1/polls/${encodeURIComponent(pollId)}/votes`,
    data: { choices },
    signal,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

// ─── Report ──────────────────────────────────────────────────────────────────

interface ReportPayload {
  accountId: string;
  statusIds?: string[];
  comment?: string;
  forward?: boolean;
  category?: string;
  ruleIds?: number[];
}

const MAX_COMMENT_LENGTH = 2_000;
const MAX_STATUS_IDS = 50;

function validateReportPayload(payload: unknown): ReportPayload {
  if (!payload || typeof payload !== 'object') {
    throw new ApplicationError({
      kind: 'validation',
      message: 'Outbox payload: report.create requires an object payload.',
    });
  }
  const p = payload as Record<string, unknown>;
  const accountId = assertNonEmptyId(p.accountId, 'accountId');
  const result: ReportPayload = { accountId };

  if (Array.isArray(p.statusIds)) {
    if (p.statusIds.length > MAX_STATUS_IDS) {
      throw new ApplicationError({
        kind: 'validation',
        message: 'Outbox payload: too many status IDs in report.',
      });
    }
    result.statusIds = p.statusIds.map((id, i) => assertNonEmptyId(id, `statusIds[${i}]`));
  }

  if (p.comment !== undefined && p.comment !== null) {
    if (typeof p.comment !== 'string') {
      throw new ApplicationError({
        kind: 'validation',
        message: 'Outbox payload: comment must be a string.',
      });
    }
    if (p.comment.length > MAX_COMMENT_LENGTH) {
      throw new ApplicationError({
        kind: 'validation',
        message: 'Outbox payload: comment exceeds maximum length.',
      });
    }
    result.comment = p.comment;
  }

  if (p.forward !== undefined) result.forward = Boolean(p.forward);
  if (p.category !== undefined && typeof p.category === 'string') {
    result.category = p.category.slice(0, 100);
  }
  if (Array.isArray(p.ruleIds)) {
    result.ruleIds = p.ruleIds
      .map(Number)
      .filter(n => Number.isInteger(n) && n > 0)
      .slice(0, 50);
  }

  return result;
}

export const executeReportCreate: OperationExecutor = async(
  entry: OutboxEntry,
  scope: AccountScope,
  signal: AbortSignal,
): Promise<unknown> => {
  const payload = validateReportPayload(entry.payload);
  const body: Record<string, unknown> = {
    account_id: payload.accountId,
  };
  if (payload.statusIds) body.status_ids = payload.statusIds;
  if (payload.comment) body.comment = payload.comment;
  if (payload.forward !== undefined) body.forward = payload.forward;
  if (payload.category) body.category = payload.category;
  if (payload.ruleIds) body.rule_ids = payload.ruleIds;

  const response = await executeRequest(scope, entry, {
    method: 'POST',
    url: '/api/v1/reports',
    data: body,
    signal,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

// ─── Notification Dismiss ────────────────────────────────────────────────────

interface NotificationDismissPayload {
  notificationId: string;
}

function validateNotificationDismissPayload(payload: unknown): NotificationDismissPayload {
  if (!payload || typeof payload !== 'object') {
    throw new ApplicationError({
      kind: 'validation',
      message: 'Outbox payload: notification.dismiss requires an object payload.',
    });
  }
  const p = payload as Record<string, unknown>;
  return { notificationId: assertNonEmptyId(p.notificationId, 'notificationId') };
}

export const executeNotificationDismiss: OperationExecutor = async(
  entry: OutboxEntry,
  scope: AccountScope,
  signal: AbortSignal,
): Promise<unknown> => {
  const { notificationId } = validateNotificationDismissPayload(entry.payload);
  const response = await executeRequest(scope, entry, {
    method: 'POST',
    url: '/api/v1/notifications/dismiss',
    data: { id: notificationId },
    signal,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

// ─── Notifications Clear ─────────────────────────────────────────────────────

export const executeNotificationsClear: OperationExecutor = async(
  entry: OutboxEntry,
  scope: AccountScope,
  signal: AbortSignal,
): Promise<unknown> => {
  // No payload needed — clears all notifications for the authenticated user
  const response = await executeRequest(scope, entry, {
    method: 'POST',
    url: '/api/v1/notifications/clear',
    signal,
  });
  return response.data;
};

// ─── Marker Update ───────────────────────────────────────────────────────────

interface MarkerUpdatePayload {
  home?: { lastReadId: string };
  notifications?: { lastReadId: string };
}

function validateMarkerPayload(payload: unknown): MarkerUpdatePayload {
  if (!payload || typeof payload !== 'object') {
    throw new ApplicationError({
      kind: 'validation',
      message: 'Outbox payload: marker.update requires an object payload.',
    });
  }
  const p = payload as Record<string, unknown>;
  const result: MarkerUpdatePayload = {};

  if (p.home && typeof p.home === 'object') {
    const h = p.home as Record<string, unknown>;
    if (typeof h.lastReadId === 'string' && h.lastReadId.length > 0 && h.lastReadId.length <= MAX_ID_LENGTH) {
      result.home = { lastReadId: h.lastReadId };
    }
  }
  if (p.notifications && typeof p.notifications === 'object') {
    const n = p.notifications as Record<string, unknown>;
    if (typeof n.lastReadId === 'string' && n.lastReadId.length > 0 && n.lastReadId.length <= MAX_ID_LENGTH) {
      result.notifications = { lastReadId: n.lastReadId };
    }
  }

  if (!result.home && !result.notifications) {
    throw new ApplicationError({
      kind: 'validation',
      message: 'Outbox payload: marker.update requires at least one marker.',
    });
  }

  return result;
}

export const executeMarkerUpdate: OperationExecutor = async(
  entry: OutboxEntry,
  scope: AccountScope,
  signal: AbortSignal,
): Promise<unknown> => {
  const payload = validateMarkerPayload(entry.payload);
  const body: Record<string, unknown> = {};
  if (payload.home) body.home = { last_read_id: payload.home.lastReadId };
  if (payload.notifications) body.notifications = { last_read_id: payload.notifications.lastReadId };

  const response = await executeRequest(scope, entry, {
    method: 'POST',
    url: '/api/v1/markers',
    data: body,
    signal,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};
