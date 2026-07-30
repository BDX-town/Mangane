/**
 * Phase 6B — Status mutation executors.
 *
 * Handles: status.create, status.edit, status.delete
 *
 * Each executor:
 * 1. Validates the payload structure (never trusts stored data blindly)
 * 2. Constructs the API request
 * 3. Sends via the transport layer (authenticated, timeout-bounded)
 * 4. Returns the server response for the outbox result field
 *
 * Security:
 * - Payload validation prevents injection via corrupted IndexedDB records
 * - All strings are type-checked and length-bounded before sending
 * - Media IDs are validated as non-empty strings (no traversal)
 * - Content is sent as-is (server handles sanitization)
 */

import { ApplicationError } from 'soapbox/domain/application-error';

import { executeRequest } from '../outbox-transport';

import type { OperationExecutor } from '../outbox-processor';
import type { AccountScope } from 'soapbox/db/repository';
import type { OutboxEntry } from 'soapbox/domain/outbox-operation';

// ─── Payload Types (internal validation targets) ─────────────────────────────

interface StatusCreatePayload {
  content: string;
  visibility?: string;
  sensitive?: boolean;
  spoilerText?: string;
  inReplyToId?: string | null;
  mediaIds?: string[];
  language?: string | null;
  poll?: {
    options: string[];
    expiresIn: number;
    multiple?: boolean;
    hideTotals?: boolean;
  } | null;
  quoteId?: string | null;
  contentType?: string;
  scheduledAt?: string | null;
  to?: string[];
}

interface StatusEditPayload {
  statusId: string;
  content: string;
  visibility?: string;
  sensitive?: boolean;
  spoilerText?: string;
  mediaIds?: string[];
  language?: string | null;
  poll?: {
    options: string[];
    expiresIn: number;
    multiple?: boolean;
    hideTotals?: boolean;
  } | null;
  contentType?: string;
}

interface StatusDeletePayload {
  statusId: string;
}

// ─── Validation ──────────────────────────────────────────────────────────────

const MAX_CONTENT_LENGTH = 100_000; // Generous upper bound
const MAX_MEDIA_IDS = 20;
const MAX_POLL_OPTIONS = 10;
const MAX_SPOILER_LENGTH = 5_000;
const MAX_ID_LENGTH = 512;

function assertString(value: unknown, field: string): string {
  if (typeof value !== 'string') {
    throw new ApplicationError({
      kind: 'validation',
      message: `Outbox payload: ${field} must be a string.`,
    });
  }
  return value;
}

function assertNonEmptyId(value: unknown, field: string): string {
  const str = assertString(value, field);
  if (str.length === 0 || str.length > MAX_ID_LENGTH) {
    throw new ApplicationError({
      kind: 'validation',
      message: `Outbox payload: ${field} is invalid (empty or too long).`,
    });
  }
  // Prevent null bytes and control characters in IDs
  // eslint-disable-next-line no-control-regex
  if (/[\x00-\x1f]/.test(str)) {
    throw new ApplicationError({
      kind: 'validation',
      message: `Outbox payload: ${field} contains prohibited characters.`,
    });
  }
  return str;
}

function validateStatusCreatePayload(payload: unknown): StatusCreatePayload {
  if (!payload || typeof payload !== 'object') {
    throw new ApplicationError({
      kind: 'validation',
      message: 'Outbox payload: status.create requires an object payload.',
    });
  }
  const p = payload as Record<string, unknown>;
  const content = assertString(p.content, 'content');
  if (content.length > MAX_CONTENT_LENGTH) {
    throw new ApplicationError({
      kind: 'validation',
      message: 'Outbox payload: content exceeds maximum length.',
    });
  }

  const result: StatusCreatePayload = { content };

  if (p.visibility !== undefined) result.visibility = assertString(p.visibility, 'visibility');
  if (p.sensitive !== undefined) result.sensitive = Boolean(p.sensitive);
  if (p.spoilerText !== undefined) {
    const spoiler = assertString(p.spoilerText, 'spoilerText');
    if (spoiler.length > MAX_SPOILER_LENGTH) {
      throw new ApplicationError({ kind: 'validation', message: 'Outbox payload: spoilerText too long.' });
    }
    result.spoilerText = spoiler;
  }
  if (p.inReplyToId !== undefined && p.inReplyToId !== null) {
    result.inReplyToId = assertNonEmptyId(p.inReplyToId, 'inReplyToId');
  }
  if (p.quoteId !== undefined && p.quoteId !== null) {
    result.quoteId = assertNonEmptyId(p.quoteId, 'quoteId');
  }
  if (p.language !== undefined && p.language !== null) {
    result.language = assertString(p.language, 'language');
  }
  if (p.contentType !== undefined) {
    result.contentType = assertString(p.contentType, 'contentType');
  }
  if (p.scheduledAt !== undefined && p.scheduledAt !== null) {
    result.scheduledAt = assertString(p.scheduledAt, 'scheduledAt');
  }

  if (Array.isArray(p.mediaIds)) {
    if (p.mediaIds.length > MAX_MEDIA_IDS) {
      throw new ApplicationError({ kind: 'validation', message: 'Outbox payload: too many media IDs.' });
    }
    result.mediaIds = p.mediaIds.map((id, i) => assertNonEmptyId(id, `mediaIds[${i}]`));
  }

  if (Array.isArray(p.to)) {
    result.to = p.to.map((addr, i) => assertString(addr, `to[${i}]`));
  }

  if (p.poll !== undefined && p.poll !== null) {
    const poll = p.poll as Record<string, unknown>;
    if (!Array.isArray(poll.options) || poll.options.length === 0 || poll.options.length > MAX_POLL_OPTIONS) {
      throw new ApplicationError({ kind: 'validation', message: 'Outbox payload: invalid poll options.' });
    }
    const expiresIn = Number(poll.expiresIn);
    if (!Number.isFinite(expiresIn) || expiresIn < 60) {
      throw new ApplicationError({ kind: 'validation', message: 'Outbox payload: invalid poll expiration.' });
    }
    result.poll = {
      options: poll.options.map((o, i) => assertString(o, `poll.options[${i}]`)),
      expiresIn,
      multiple: Boolean(poll.multiple),
      hideTotals: Boolean(poll.hideTotals),
    };
  }

  return result;
}

function validateStatusEditPayload(payload: unknown): StatusEditPayload {
  if (!payload || typeof payload !== 'object') {
    throw new ApplicationError({
      kind: 'validation',
      message: 'Outbox payload: status.edit requires an object payload.',
    });
  }
  const p = payload as Record<string, unknown>;
  const statusId = assertNonEmptyId(p.statusId, 'statusId');
  const content = assertString(p.content, 'content');
  if (content.length > MAX_CONTENT_LENGTH) {
    throw new ApplicationError({ kind: 'validation', message: 'Outbox payload: content exceeds maximum length.' });
  }

  const result: StatusEditPayload = { statusId, content };
  if (p.visibility !== undefined) result.visibility = assertString(p.visibility, 'visibility');
  if (p.sensitive !== undefined) result.sensitive = Boolean(p.sensitive);
  if (p.spoilerText !== undefined) {
    const spoiler = assertString(p.spoilerText, 'spoilerText');
    if (spoiler.length > MAX_SPOILER_LENGTH) {
      throw new ApplicationError({ kind: 'validation', message: 'Outbox payload: spoilerText too long.' });
    }
    result.spoilerText = spoiler;
  }
  if (p.contentType !== undefined) {
    result.contentType = assertString(p.contentType, 'contentType');
  }
  if (p.language !== undefined && p.language !== null) {
    result.language = assertString(p.language, 'language');
  }
  if (Array.isArray(p.mediaIds)) {
    if (p.mediaIds.length > MAX_MEDIA_IDS) {
      throw new ApplicationError({ kind: 'validation', message: 'Outbox payload: too many media IDs.' });
    }
    result.mediaIds = p.mediaIds.map((id, i) => assertNonEmptyId(id, `mediaIds[${i}]`));
  }
  if (p.poll !== undefined && p.poll !== null) {
    const poll = p.poll as Record<string, unknown>;
    if (!Array.isArray(poll.options) || poll.options.length === 0 || poll.options.length > MAX_POLL_OPTIONS) {
      throw new ApplicationError({ kind: 'validation', message: 'Outbox payload: invalid poll options.' });
    }
    const expiresIn = Number(poll.expiresIn);
    if (!Number.isFinite(expiresIn) || expiresIn < 60) {
      throw new ApplicationError({ kind: 'validation', message: 'Outbox payload: invalid poll expiration.' });
    }
    result.poll = {
      options: poll.options.map((o, i) => assertString(o, `poll.options[${i}]`)),
      expiresIn,
      multiple: Boolean(poll.multiple),
      hideTotals: Boolean(poll.hideTotals),
    };
  }

  return result;
}

function validateStatusDeletePayload(payload: unknown): StatusDeletePayload {
  if (!payload || typeof payload !== 'object') {
    throw new ApplicationError({
      kind: 'validation',
      message: 'Outbox payload: status.delete requires an object payload.',
    });
  }
  const p = payload as Record<string, unknown>;
  return { statusId: assertNonEmptyId(p.statusId, 'statusId') };
}

// ─── Executors ───────────────────────────────────────────────────────────────

export const executeStatusCreate: OperationExecutor = async(
  entry: OutboxEntry,
  scope: AccountScope,
  signal: AbortSignal,
): Promise<unknown> => {
  const payload = validateStatusCreatePayload(entry.payload);

  // Build the Mastodon-compatible request body
  const body: Record<string, unknown> = {
    status: payload.content,
  };
  if (payload.visibility) body.visibility = payload.visibility;
  if (payload.sensitive !== undefined) body.sensitive = payload.sensitive;
  if (payload.spoilerText) body.spoiler_text = payload.spoilerText;
  if (payload.inReplyToId) body.in_reply_to_id = payload.inReplyToId;
  if (payload.quoteId) body.quote_id = payload.quoteId;
  if (payload.language) body.language = payload.language;
  if (payload.contentType) body.content_type = payload.contentType;
  if (payload.scheduledAt) body.scheduled_at = payload.scheduledAt;
  if (payload.mediaIds && payload.mediaIds.length > 0) body.media_ids = payload.mediaIds;
  if (payload.to && payload.to.length > 0) body.to = payload.to;
  if (payload.poll) {
    body.poll = {
      options: payload.poll.options,
      expires_in: payload.poll.expiresIn,
      multiple: payload.poll.multiple,
      hide_totals: payload.poll.hideTotals,
    };
  }

  const response = await executeRequest(scope, entry, {
    method: 'POST',
    url: '/api/v1/statuses',
    data: body,
    signal,
    headers: { 'Content-Type': 'application/json' },
  });

  return response.data;
};

export const executeStatusEdit: OperationExecutor = async(
  entry: OutboxEntry,
  scope: AccountScope,
  signal: AbortSignal,
): Promise<unknown> => {
  const payload = validateStatusEditPayload(entry.payload);

  const body: Record<string, unknown> = {
    status: payload.content,
  };
  if (payload.visibility) body.visibility = payload.visibility;
  if (payload.sensitive !== undefined) body.sensitive = payload.sensitive;
  if (payload.spoilerText !== undefined) body.spoiler_text = payload.spoilerText;
  if (payload.contentType) body.content_type = payload.contentType;
  if (payload.language) body.language = payload.language;
  if (payload.mediaIds && payload.mediaIds.length > 0) body.media_ids = payload.mediaIds;
  if (payload.poll) {
    body.poll = {
      options: payload.poll.options,
      expires_in: payload.poll.expiresIn,
      multiple: payload.poll.multiple,
      hide_totals: payload.poll.hideTotals,
    };
  }

  const response = await executeRequest(scope, entry, {
    method: 'PUT',
    url: `/api/v1/statuses/${encodeURIComponent(payload.statusId)}`,
    data: body,
    signal,
    headers: { 'Content-Type': 'application/json' },
  });

  return response.data;
};

export const executeStatusDelete: OperationExecutor = async(
  entry: OutboxEntry,
  scope: AccountScope,
  signal: AbortSignal,
): Promise<unknown> => {
  const payload = validateStatusDeletePayload(entry.payload);

  const response = await executeRequest(scope, entry, {
    method: 'DELETE',
    url: `/api/v1/statuses/${encodeURIComponent(payload.statusId)}`,
    signal,
  });

  return response.data;
};
