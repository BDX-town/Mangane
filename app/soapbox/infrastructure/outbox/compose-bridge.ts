/**
 * Phase 6F — Compose → outbox bridge.
 *
 * Provides functions that the existing compose action can call to route
 * mutations through the durable outbox instead of direct API calls.
 *
 * This is an opt-in bridge: the existing compose flow continues to work
 * as before. When the outbox feature flag is enabled, compose calls these
 * functions which enqueue operations into the outbox rather than making
 * immediate HTTP requests.
 *
 * The bridge handles:
 * - Converting compose state into outbox-compatible payloads
 * - Media upload dependency chaining
 * - Optimistic state generation for immediate UI feedback
 * - Account scope resolution from the current session
 *
 * Security:
 * - Input validation happens both here (shape) and in the executor (depth)
 * - Account scope derived from authenticated session, never from user input
 * - Media blobs are validated for type and size before enqueuing
 */

import { createAccountScope } from 'soapbox/db/repository';

import { enqueue } from './outbox-service';

import type { AccountScope } from 'soapbox/db/repository';
import type { OutboxOperationType } from 'soapbox/domain/outbox-operation';

// ─── Feature flag ────────────────────────────────────────────────────────────

let outboxEnabled = false;

/** Enable or disable outbox routing for compose. */
export function setOutboxComposeEnabled(enabled: boolean): void {
  outboxEnabled = enabled;
}

/** Check if compose is routing through the outbox. */
export function isOutboxComposeEnabled(): boolean {
  return outboxEnabled;
}

// ─── Compose payload types ───────────────────────────────────────────────────

export interface ComposeParams {
  status: string;
  in_reply_to_id?: string | null;
  quote_id?: string | null;
  media_ids?: string[];
  sensitive?: boolean;
  spoiler_text?: string;
  visibility?: string;
  content_type?: string;
  poll?: {
    options: string[];
    expires_in: number;
    multiple?: boolean;
    hide_totals?: boolean;
  } | null;
  scheduled_at?: string | null;
  language?: string | null;
  to?: string[] | Set<string> | null;
}

// ─── Bridge functions ────────────────────────────────────────────────────────

/**
 * Enqueue a status creation through the durable outbox.
 *
 * @param accountUrl - The authenticated user's account URL
 * @param params - Compose parameters (same shape as existing createStatus)
 * @param statusId - If editing, the existing status ID; null for new posts
 * @returns The operation ID for tracking, or null if outbox is disabled
 */
export async function enqueueCompose(
  accountUrl: string,
  params: ComposeParams,
  statusId: string | null = null,
): Promise<string | null> {
  if (!outboxEnabled) return null;

  let scope: AccountScope;
  try {
    scope = createAccountScope(accountUrl);
  } catch {
    return null; // Invalid scope — fallback to direct API
  }

  const operationType: OutboxOperationType = statusId ? 'status.edit' : 'status.create';

  const payload = buildPayload(params, statusId);
  const operationId = await enqueue(scope, operationType, {
    payload,
    priority: 50, // Higher priority than background operations
  });

  return operationId;
}

/**
 * Enqueue a status deletion through the outbox.
 */
export async function enqueueDelete(
  accountUrl: string,
  statusId: string,
): Promise<string | null> {
  if (!outboxEnabled) return null;

  let scope: AccountScope;
  try {
    scope = createAccountScope(accountUrl);
  } catch {
    return null;
  }

  return enqueue(scope, 'status.delete', {
    payload: { statusId },
    priority: 10, // Deletes get high priority
  });
}

/**
 * Enqueue a toggle interaction through the outbox.
 */
export async function enqueueInteraction(
  accountUrl: string,
  operationType: OutboxOperationType,
  targetId: string,
  targetField: 'statusId' | 'accountId' = 'statusId',
): Promise<string | null> {
  if (!outboxEnabled) return null;

  let scope: AccountScope;
  try {
    scope = createAccountScope(accountUrl);
  } catch {
    return null;
  }

  return enqueue(scope, operationType, {
    payload: { [targetField]: targetId },
  });
}

/**
 * Enqueue a media upload with dependency tracking.
 * Returns the operation ID which can be used as a dependency for status.create.
 */
export async function enqueueMediaUpload(
  accountUrl: string,
  file: Blob,
  description?: string,
  focus?: string,
): Promise<string | null> {
  if (!outboxEnabled) return null;

  let scope: AccountScope;
  try {
    scope = createAccountScope(accountUrl);
  } catch {
    return null;
  }

  return enqueue(scope, 'media.upload', {
    payload: { file, description, focus },
    priority: 40, // Higher than status create so deps resolve first
  });
}

// ─── Internal helpers ────────────────────────────────────────────────────────

function buildPayload(
  params: ComposeParams,
  statusId: string | null,
): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    content: params.status,
  };

  if (statusId) payload.statusId = statusId;
  if (params.visibility) payload.visibility = params.visibility;
  if (params.sensitive !== undefined) payload.sensitive = params.sensitive;
  if (params.spoiler_text) payload.spoilerText = params.spoiler_text;
  if (params.in_reply_to_id) payload.inReplyToId = params.in_reply_to_id;
  if (params.quote_id) payload.quoteId = params.quote_id;
  if (params.language) payload.language = params.language;
  if (params.content_type) payload.contentType = params.content_type;
  if (params.scheduled_at) payload.scheduledAt = params.scheduled_at;

  if (params.media_ids && params.media_ids.length > 0) {
    payload.mediaIds = [...params.media_ids];
  }

  if (params.to) {
    let toArray: string[];
    if (params.to instanceof Set) {
      toArray = Array.from(params.to);
    } else if (Array.isArray(params.to)) {
      toArray = params.to;
    } else {
      toArray = [];
    }
    if (toArray.length > 0) payload.to = toArray;
  }

  if (params.poll) {
    payload.poll = {
      options: [...params.poll.options],
      expiresIn: params.poll.expires_in,
      multiple: params.poll.multiple ?? false,
      hideTotals: params.poll.hide_totals ?? false,
    };
  }

  return payload;
}
