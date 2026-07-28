/**
 * Phase 5 — Canonical local data store schema.
 *
 * Defines the IndexedDB schema using Dexie.js for all local record types.
 * Every table uses account-scoped compound keys to prevent cross-account
 * data access (IDOR protection at the storage layer).
 *
 * Design principles:
 * - Every record belongs to exactly one account (accountUrl field)
 * - Primary keys are compound: [accountUrl+entityId] for guaranteed isolation
 * - Indexes support efficient per-account queries without full table scans
 * - Schema versions are tracked; migrations are additive and non-destructive
 * - No record can be read or written without an explicit account scope
 *
 * Performance notes (from Dexie best practices):
 * - Use bulkPut for batch writes (10x faster than individual puts)
 * - Limit compound indexes on iOS (max 1-2 per table for write perf)
 * - Prefer range queries over anyOf() for large datasets
 * - One singleton Dexie instance per application lifetime
 */

import Dexie from 'dexie';

import type { Table } from 'dexie';

// ─── Entity Interfaces ───────────────────────────────────────────────────────

/** Base fields present on every stored record. */
export interface BaseRecord {
  /** Account URL that owns this record (partition key for IDOR isolation) */
  readonly accountUrl: string;
  /** When this record was last written to the local store */
  readonly localUpdatedAt: number;
}

export interface StoredAccount extends BaseRecord {
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
  readonly raw: unknown; // Original API response for forward compat
}

export interface StoredStatus extends BaseRecord {
  readonly id: string;
  readonly uri: string;
  readonly content: string;
  readonly accountId: string;
  readonly createdAt: string;
  readonly visibility: 'public' | 'unlisted' | 'private' | 'direct';
  readonly sensitive: boolean;
  readonly spoilerText: string;
  readonly mediaAttachmentIds: string[];
  readonly inReplyToId: string | null;
  readonly inReplyToAccountId: string | null;
  readonly reblogId: string | null;
  readonly favourited: boolean;
  readonly reblogged: boolean;
  readonly bookmarked: boolean;
  readonly pinned: boolean;
  readonly raw: unknown;
}

export interface StoredNotification extends BaseRecord {
  readonly id: string;
  readonly type: string;
  readonly createdAt: string;
  readonly accountId: string;
  readonly statusId: string | null;
  readonly read: boolean;
  readonly raw: unknown;
}

export interface StoredRelationship extends BaseRecord {
  readonly id: string; // Target account ID
  readonly following: boolean;
  readonly followedBy: boolean;
  readonly blocking: boolean;
  readonly blockedBy: boolean;
  readonly muting: boolean;
  readonly mutingNotifications: boolean;
  readonly requested: boolean;
  readonly domainBlocking: boolean;
  readonly endorsed: boolean;
  readonly note: string;
}

export interface StoredConversation extends BaseRecord {
  readonly id: string;
  readonly lastStatusId: string | null;
  readonly participantIds: string[];
  readonly unread: boolean;
  readonly raw: unknown;
}

export interface StoredMedia extends BaseRecord {
  readonly id: string;
  readonly statusId: string;
  readonly type: 'image' | 'video' | 'gifv' | 'audio' | 'unknown';
  readonly url: string;
  readonly previewUrl: string;
  readonly description: string | null;
  readonly blurhash: string | null;
  readonly raw: unknown;
}

export interface StoredDraft extends BaseRecord {
  readonly id: string; // Client-generated UUID
  readonly content: string;
  readonly visibility: 'public' | 'unlisted' | 'private' | 'direct';
  readonly sensitive: boolean;
  readonly spoilerText: string;
  readonly inReplyToId: string | null;
  readonly mediaIds: string[];
  readonly language: string | null;
  readonly createdAt: number;
  readonly updatedAt: number;
}

export interface StoredCheckpoint extends BaseRecord {
  readonly id: string; // Timeline or collection identifier
  readonly type: 'home' | 'notifications' | 'local' | 'federated' | 'list' | 'hashtag';
  readonly maxId: string | null;
  readonly minId: string | null;
  readonly updatedAt: number;
}

export interface StoredTombstone extends BaseRecord {
  readonly id: string; // Entity ID that was deleted
  readonly entityType: 'status' | 'account' | 'notification' | 'conversation';
  readonly deletedAt: number;
  readonly reason: 'user-action' | 'remote-delete' | 'moderation' | 'unknown';
}

export interface StoredCapability extends BaseRecord {
  readonly instanceUrl: string;
  readonly capabilities: Record<string, boolean>;
  readonly detectedAt: number;
  readonly raw: unknown;
}

export interface StoredSetting extends BaseRecord {
  readonly key: string;
  readonly value: unknown;
  readonly updatedAt: number;
}

// ─── Database Schema Version ─────────────────────────────────────────────────

export const SCHEMA_VERSION = 1;

/**
 * Schema definition string for Dexie.
 * Format: "primaryKey, index1, index2, ..."
 * Compound keys: "[field1+field2]" ensures uniqueness across accounts.
 * The & prefix means unique index.
 */
export const SCHEMA_V1 = {
  accounts: '[accountUrl+id], accountUrl, [accountUrl+acct], localUpdatedAt',
  statuses: '[accountUrl+id], accountUrl, [accountUrl+accountId], [accountUrl+createdAt], [accountUrl+inReplyToId], localUpdatedAt',
  notifications: '[accountUrl+id], accountUrl, [accountUrl+createdAt], [accountUrl+read], localUpdatedAt',
  relationships: '[accountUrl+id], accountUrl, localUpdatedAt',
  conversations: '[accountUrl+id], accountUrl, [accountUrl+lastStatusId], localUpdatedAt',
  media: '[accountUrl+id], accountUrl, [accountUrl+statusId], localUpdatedAt',
  drafts: '[accountUrl+id], accountUrl, [accountUrl+updatedAt], localUpdatedAt',
  checkpoints: '[accountUrl+id], accountUrl, localUpdatedAt',
  tombstones: '[accountUrl+id], accountUrl, [accountUrl+entityType], deletedAt',
  capabilities: '[accountUrl+instanceUrl], accountUrl, detectedAt',
  settings: '[accountUrl+key], accountUrl, updatedAt',
};

// ─── Database Class ──────────────────────────────────────────────────────────

export class ManganeDatabase extends Dexie {

  accounts!: Table<StoredAccount>;
  statuses!: Table<StoredStatus>;
  notifications!: Table<StoredNotification>;
  relationships!: Table<StoredRelationship>;
  conversations!: Table<StoredConversation>;
  media!: Table<StoredMedia>;
  drafts!: Table<StoredDraft>;
  checkpoints!: Table<StoredCheckpoint>;
  tombstones!: Table<StoredTombstone>;
  capabilities!: Table<StoredCapability>;
  settings!: Table<StoredSetting>;

  constructor(name = 'mangane-local-store') {
    super(name);

    this.version(SCHEMA_VERSION).stores(SCHEMA_V1);
  }

}
