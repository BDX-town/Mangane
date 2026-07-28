/**
 * Phase 5D — Integration bridge between remote data flow and local store.
 *
 * This module provides the glue between the existing Redux/API data pipeline
 * and the Phase 5 IndexedDB store. It operates behind the `localStore`
 * feature flag (default: off).
 *
 * Write path (API → IndexedDB):
 *   When accounts/statuses/notifications arrive from the API via the importer,
 *   this module asynchronously persists them to the local store. Persistence
 *   failures are non-fatal — they log a warning but never block the UI.
 *
 * Read path (IndexedDB → Redux hydration):
 *   On app startup, this module hydrates Redux with locally cached data
 *   before the API responds. This provides instant UI rendering for
 *   previously-visited content.
 *
 * Design principles:
 * - Non-blocking: write failures never affect the UI or API flow
 * - Account-scoped: all operations require a valid account URL
 * - Batched: uses bulkPut for efficient writes
 * - Idempotent: repeated writes of the same data are safe
 * - Feature-flagged: entirely disabled unless `localStore` setting is true
 */

import { createAccountScope, statusesRepo, accountsRepo, notificationsRepo } from './repository';

import type { AccountScope } from './repository';
import type { StoredStatus, StoredAccount, StoredNotification } from './schema';

// ─── Feature Flag ────────────────────────────────────────────────────────────

let enabled = false;

/** Enable or disable the local store sync. Called on app init. */
export function setLocalStoreEnabled(value: boolean): void {
  enabled = value;
}

/** Check if local store sync is currently enabled. */
export function isLocalStoreEnabled(): boolean {
  return enabled;
}

// ─── Write Path: API → IndexedDB ─────────────────────────────────────────────

/**
 * Persist fetched accounts to the local store.
 * Called after importFetchedAccounts normalizes the data.
 *
 * Non-blocking: catches and logs errors without propagating.
 */
export async function persistAccounts(
  accountUrl: string,
  accounts: ReadonlyArray<Record<string, any>>,
): Promise<void> {
  if (!enabled || accounts.length === 0) return;

  let scope: AccountScope;
  try {
    scope = createAccountScope(accountUrl);
  } catch {
    return; // Invalid scope — skip silently
  }

  try {
    const records: Omit<StoredAccount, 'accountUrl' | 'localUpdatedAt'>[] = accounts
      .filter(a => a && typeof a.id === 'string' && a.id.length > 0)
      .map(a => ({
        id: String(a.id),
        username: String(a.username || ''),
        acct: String(a.acct || ''),
        displayName: String(a.display_name || a.displayName || ''),
        avatar: String(a.avatar || ''),
        header: String(a.header || ''),
        followersCount: Number(a.followers_count ?? a.followersCount ?? 0),
        followingCount: Number(a.following_count ?? a.followingCount ?? 0),
        statusesCount: Number(a.statuses_count ?? a.statusesCount ?? 0),
        note: String(a.note || ''),
        url: String(a.url || ''),
        locked: Boolean(a.locked),
        bot: Boolean(a.bot),
        createdAt: String(a.created_at || a.createdAt || ''),
        raw: a,
      }));

    if (records.length > 0) {
      await accountsRepo.putMany(scope, records);
    }
  } catch (error) {
    // Non-fatal: log and continue
    if (process.env.NODE_ENV === 'development') {
      console.warn('[local-store] Failed to persist accounts:', error);
    }
  }
}

/**
 * Persist fetched statuses to the local store.
 * Called after importFetchedStatuses normalizes the data.
 *
 * Non-blocking: catches and logs errors without propagating.
 */
export async function persistStatuses(
  accountUrl: string,
  statuses: ReadonlyArray<Record<string, any>>,
): Promise<void> {
  if (!enabled || statuses.length === 0) return;

  let scope: AccountScope;
  try {
    scope = createAccountScope(accountUrl);
  } catch {
    return;
  }

  try {
    const records: Omit<StoredStatus, 'accountUrl' | 'localUpdatedAt'>[] = statuses
      .filter(s => s && typeof s.id === 'string' && s.id.length > 0)
      .map(s => ({
        id: String(s.id),
        uri: String(s.uri || ''),
        content: String(s.content || ''),
        accountId: String(s.account?.id || s.account_id || s.accountId || ''),
        createdAt: String(s.created_at || s.createdAt || ''),
        visibility: normalizeVisibility(s.visibility),
        sensitive: Boolean(s.sensitive),
        spoilerText: String(s.spoiler_text || s.spoilerText || ''),
        mediaAttachmentIds: Array.isArray(s.media_attachments || s.mediaAttachments)
          ? (s.media_attachments || s.mediaAttachments).map((m: any) => String(m?.id || ''))
          : [],
        inReplyToId: s.in_reply_to_id || s.inReplyToId || null,
        inReplyToAccountId: s.in_reply_to_account_id || s.inReplyToAccountId || null,
        reblogId: s.reblog?.id || s.reblogId || null,
        favourited: Boolean(s.favourited),
        reblogged: Boolean(s.reblogged),
        bookmarked: Boolean(s.bookmarked),
        pinned: Boolean(s.pinned),
        raw: s,
      }));

    if (records.length > 0) {
      await statusesRepo.putMany(scope, records);
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[local-store] Failed to persist statuses:', error);
    }
  }
}

/**
 * Persist fetched notifications to the local store.
 *
 * Non-blocking: catches and logs errors without propagating.
 */
export async function persistNotifications(
  accountUrl: string,
  notifications: ReadonlyArray<Record<string, any>>,
): Promise<void> {
  if (!enabled || notifications.length === 0) return;

  let scope: AccountScope;
  try {
    scope = createAccountScope(accountUrl);
  } catch {
    return;
  }

  try {
    const records: Omit<StoredNotification, 'accountUrl' | 'localUpdatedAt'>[] = notifications
      .filter(n => n && typeof n.id === 'string' && n.id.length > 0)
      .map(n => ({
        id: String(n.id),
        type: String(n.type || ''),
        createdAt: String(n.created_at || n.createdAt || ''),
        accountId: String(n.account?.id || n.account_id || n.accountId || ''),
        statusId: n.status?.id || n.status_id || n.statusId || null,
        read: Boolean(n.pleroma?.is_seen ?? n.read ?? false),
        raw: n,
      }));

    if (records.length > 0) {
      await notificationsRepo.putMany(scope, records);
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[local-store] Failed to persist notifications:', error);
    }
  }
}

// ─── Read Path: IndexedDB → Hydration ────────────────────────────────────────

/**
 * Load cached statuses for an account from the local store.
 * Used at startup to hydrate the timeline before API responds.
 *
 * Returns raw API response objects (the `raw` field) for compatibility
 * with the existing importer/normalizer pipeline.
 */
export async function loadCachedStatuses(
  accountUrl: string,
  options: { limit?: number } = {},
): Promise<Record<string, any>[]> {
  if (!enabled) return [];

  let scope: AccountScope;
  try {
    scope = createAccountScope(accountUrl);
  } catch {
    return [];
  }

  try {
    const records = await statusesRepo.query(scope, {
      limit: options.limit ?? 40,
      reverse: true, // Most recent first
    });
    // Return the raw API objects for the importer to process
    return records
      .map(r => r.raw as Record<string, any>)
      .filter(r => r && typeof r === 'object');
  } catch {
    return [];
  }
}

/**
 * Load cached notifications for an account from the local store.
 */
export async function loadCachedNotifications(
  accountUrl: string,
  options: { limit?: number } = {},
): Promise<Record<string, any>[]> {
  if (!enabled) return [];

  let scope: AccountScope;
  try {
    scope = createAccountScope(accountUrl);
  } catch {
    return [];
  }

  try {
    const records = await notificationsRepo.query(scope, {
      limit: options.limit ?? 30,
      reverse: true,
    });
    return records
      .map(r => r.raw as Record<string, any>)
      .filter(r => r && typeof r === 'object');
  } catch {
    return [];
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function normalizeVisibility(v: unknown): 'public' | 'unlisted' | 'private' | 'direct' {
  if (v === 'public' || v === 'unlisted' || v === 'private' || v === 'direct') return v;
  return 'public';
}
