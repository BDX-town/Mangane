/**
 * Phase 5E — Editorial projections.
 *
 * Projections transform raw stored records into presentation-ready shapes
 * that Phase 8+ components can consume directly without parsing the `raw`
 * field. This is the boundary between storage and presentation.
 *
 * Principles:
 * - Presentation code must NEVER reach into `raw` to recover missing fields
 * - Projections are pure functions (no side effects, no DB access)
 * - Unknown/invalid values fail closed (return safe defaults, never coerce)
 * - Visibility normalization preserves ALL known values including `local`
 */

import type { StoredStatus, StoredAccount, StoredNotification, StoredConversation } from './schema';

// ─── Visibility (fail-closed normalization) ──────────────────────────────────

/**
 * All visibility values known to the Fediverse ecosystem.
 * This list is intentionally broader than just Mastodon's 4 values.
 */
const KNOWN_VISIBILITIES = new Set([
  'public',
  'unlisted',
  'private',
  'direct',
  'local',       // Akkoma/Pleroma local-only posts
  'mutualsonly', // Some implementations
  'list',        // List-only visibility
]);

export type KnownVisibility =
  | 'public'
  | 'unlisted'
  | 'private'
  | 'direct'
  | 'local'
  | 'mutualsonly'
  | 'list';

/**
 * Normalize visibility fail-closed.
 * - Known values pass through unchanged
 * - Unknown values are preserved as-is (never coerced to 'public')
 * - Null/undefined defaults to 'public' (server omission, not unknown value)
 * - Empty string defaults to 'public' (same as server omission)
 */
export function normalizeVisibility(raw: unknown): string {
  if (raw === null || raw === undefined || raw === '') return 'public';
  if (typeof raw !== 'string') return 'public';
  // Preserve the value — even if unknown, it's better than coercing to public
  // which could expose a private post. Unknown visibility is treated as
  // more restrictive than public by display components.
  return raw;
}

/**
 * Check if a visibility value is known and safe for display logic.
 */
export function isKnownVisibility(v: string): v is KnownVisibility {
  return KNOWN_VISIBILITIES.has(v);
}

// ─── Status Projection ───────────────────────────────────────────────────────

export interface StatusProjection {
  readonly id: string;
  readonly uri: string;
  readonly content: string;
  readonly accountId: string;
  readonly createdAt: string;
  readonly visibility: string; // Preserved as-is, not coerced
  readonly sensitive: boolean;
  readonly spoilerText: string;
  readonly mediaAttachmentIds: readonly string[];
  readonly inReplyToId: string | null;
  readonly inReplyToAccountId: string | null;
  readonly reblogId: string | null;
  readonly favourited: boolean;
  readonly reblogged: boolean;
  readonly bookmarked: boolean;
  readonly pinned: boolean;
  readonly isVisibilityKnown: boolean; // UI can show warning for unknown
}

/**
 * Project a stored status into a presentation-ready shape.
 * Presentation components consume this — never the raw field.
 */
export function projectStatus(stored: StoredStatus): StatusProjection {
  return {
    id: stored.id,
    uri: stored.uri,
    content: stored.content,
    accountId: stored.accountId,
    createdAt: stored.createdAt,
    visibility: normalizeVisibility(stored.visibility),
    sensitive: stored.sensitive,
    spoilerText: stored.spoilerText,
    mediaAttachmentIds: Object.freeze([...stored.mediaAttachmentIds]),
    inReplyToId: stored.inReplyToId,
    inReplyToAccountId: stored.inReplyToAccountId,
    reblogId: stored.reblogId,
    favourited: stored.favourited,
    reblogged: stored.reblogged,
    bookmarked: stored.bookmarked,
    pinned: stored.pinned,
    isVisibilityKnown: isKnownVisibility(normalizeVisibility(stored.visibility)),
  };
}

// ─── Account Projection ──────────────────────────────────────────────────────

export interface AccountProjection {
  readonly id: string;
  readonly username: string;
  readonly acct: string;
  readonly displayName: string;
  readonly avatar: string;
  readonly header: string;
  readonly followersCount: number;
  readonly followingCount: number;
  readonly statusesCount: number;
  readonly note: string;
  readonly url: string;
  readonly locked: boolean;
  readonly bot: boolean;
  readonly createdAt: string;
}

export function projectAccount(stored: StoredAccount): AccountProjection {
  return {
    id: stored.id,
    username: stored.username,
    acct: stored.acct,
    displayName: stored.displayName,
    avatar: stored.avatar,
    header: stored.header,
    followersCount: stored.followersCount,
    followingCount: stored.followingCount,
    statusesCount: stored.statusesCount,
    note: stored.note,
    url: stored.url,
    locked: stored.locked,
    bot: stored.bot,
    createdAt: stored.createdAt,
  };
}

// ─── Notification Projection ─────────────────────────────────────────────────

export interface NotificationProjection {
  readonly id: string;
  readonly type: string;
  readonly createdAt: string;
  readonly accountId: string;
  readonly statusId: string | null;
  readonly read: boolean;
}

export function projectNotification(stored: StoredNotification): NotificationProjection {
  return {
    id: stored.id,
    type: stored.type,
    createdAt: stored.createdAt,
    accountId: stored.accountId,
    statusId: stored.statusId,
    read: stored.read,
  };
}

// ─── Conversation Projection ─────────────────────────────────────────────────

export interface ConversationProjection {
  readonly id: string;
  readonly lastStatusId: string | null;
  readonly participantIds: readonly string[];
  readonly unread: boolean;
}

export function projectConversation(stored: StoredConversation): ConversationProjection {
  return {
    id: stored.id,
    lastStatusId: stored.lastStatusId,
    participantIds: Object.freeze([...stored.participantIds]),
    unread: stored.unread,
  };
}
