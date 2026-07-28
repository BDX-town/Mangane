/**
 * Phase 5C — Storage quota monitoring and retention policy.
 *
 * Monitors IndexedDB storage usage against browser-imposed quotas and
 * enforces retention policies to prevent storage exhaustion.
 *
 * Strategy:
 * - Monitor: use navigator.storage.estimate() for quota awareness
 * - Warn: emit observable state when usage exceeds 80% of quota
 * - Evict: when quota pressure is high, evict oldest records first
 * - Retain: keep records within configurable TTL and count limits
 * - Self-heal: on QuotaExceededError, trigger emergency eviction
 *
 * Eviction order (least-valuable first):
 * 1. Tombstones older than 7 days
 * 2. Notifications older than 30 days
 * 3. Statuses older than 14 days (non-bookmarked, non-pinned)
 * 4. Media metadata older than 14 days
 * 5. Conversations older than 30 days
 *
 * Never evicted automatically:
 * - Drafts (user-created content)
 * - Settings
 * - Checkpoints (sync state)
 * - Accounts (lightweight)
 * - Relationships (lightweight)
 * - Capabilities (lightweight)
 */

import Dexie from 'dexie';

import db from './instance';

import type { AccountScope } from './repository';

// ─── Configuration ───────────────────────────────────────────────────────────

export interface RetentionConfig {
  /** Max age in ms before tombstones are evicted */
  tombstoneTtlMs: number;
  /** Max age in ms before notifications are evicted */
  notificationTtlMs: number;
  /** Max age in ms before statuses are evicted */
  statusTtlMs: number;
  /** Max age in ms before media metadata is evicted */
  mediaTtlMs: number;
  /** Max age in ms before conversations are evicted */
  conversationTtlMs: number;
  /** Usage ratio (0-1) that triggers a warning */
  warningThreshold: number;
  /** Usage ratio (0-1) that triggers emergency eviction */
  criticalThreshold: number;
  /** Maximum records per table per account (hard cap) */
  maxRecordsPerTable: number;
}

const DEFAULT_RETENTION: RetentionConfig = {
  tombstoneTtlMs: 7 * 24 * 60 * 60 * 1000, // 7 days
  notificationTtlMs: 30 * 24 * 60 * 60 * 1000, // 30 days
  statusTtlMs: 14 * 24 * 60 * 60 * 1000, // 14 days
  mediaTtlMs: 14 * 24 * 60 * 60 * 1000, // 14 days
  conversationTtlMs: 30 * 24 * 60 * 60 * 1000, // 30 days
  warningThreshold: 0.8,
  criticalThreshold: 0.95,
  maxRecordsPerTable: 10000,
};

// ─── Quota Monitoring ────────────────────────────────────────────────────────

export interface QuotaStatus {
  /** Estimated bytes used */
  usageBytes: number;
  /** Estimated quota in bytes */
  quotaBytes: number;
  /** Usage as fraction of quota (0-1) */
  usageRatio: number;
  /** Current pressure level */
  pressure: 'normal' | 'warning' | 'critical' | 'unknown';
  /** Whether the estimate API is available */
  available: boolean;
}

/**
 * Get current storage quota status.
 * Returns 'unknown' pressure if the Storage API is unavailable.
 */
export async function getQuotaStatus(config = DEFAULT_RETENTION): Promise<QuotaStatus> {
  if (!navigator.storage?.estimate) {
    return { usageBytes: 0, quotaBytes: 0, usageRatio: 0, pressure: 'unknown', available: false };
  }

  try {
    const estimate = await navigator.storage.estimate();
    const usageBytes = estimate.usage ?? 0;
    const quotaBytes = estimate.quota ?? 0;
    const usageRatio = quotaBytes > 0 ? usageBytes / quotaBytes : 0;

    let pressure: QuotaStatus['pressure'] = 'normal';
    if (usageRatio >= config.criticalThreshold) pressure = 'critical';
    else if (usageRatio >= config.warningThreshold) pressure = 'warning';

    return { usageBytes, quotaBytes, usageRatio, pressure, available: true };
  } catch {
    return { usageBytes: 0, quotaBytes: 0, usageRatio: 0, pressure: 'unknown', available: false };
  }
}

// ─── Retention Enforcement ───────────────────────────────────────────────────

export interface EvictionResult {
  /** Table that was evicted from */
  table: string;
  /** Number of records removed */
  evicted: number;
}

export interface EvictionReport {
  /** Why eviction was triggered */
  trigger: 'ttl' | 'quota-pressure' | 'max-records' | 'manual';
  /** Results per table */
  results: EvictionResult[];
  /** Total records evicted */
  totalEvicted: number;
  /** Duration in ms */
  durationMs: number;
}

/**
 * Enforce TTL-based retention for a specific account.
 * Removes records older than their configured TTL.
 * Safe to call frequently — only deletes expired records.
 */
export async function enforceRetention(
  scope: AccountScope,
  config = DEFAULT_RETENTION,
): Promise<EvictionReport> {
  const startTime = Date.now();
  const results: EvictionResult[] = [];
  const cutoffs = {
    tombstones: startTime - config.tombstoneTtlMs,
    notifications: startTime - config.notificationTtlMs,
    statuses: startTime - config.statusTtlMs,
    media: startTime - config.mediaTtlMs,
    conversations: startTime - config.conversationTtlMs,
  };

  // Tombstones: evict by deletedAt
  const tombstoneEvicted = await db.tombstones
    .where('[accountUrl+id]')
    .between([scope.accountUrl, Dexie.minKey], [scope.accountUrl, Dexie.maxKey])
    .and(r => r.deletedAt < cutoffs.tombstones)
    .delete();
  if (tombstoneEvicted > 0) results.push({ table: 'tombstones', evicted: tombstoneEvicted });

  // Notifications: evict by localUpdatedAt
  const notifEvicted = await db.notifications
    .where('accountUrl').equals(scope.accountUrl)
    .and(r => r.localUpdatedAt < cutoffs.notifications)
    .delete();
  if (notifEvicted > 0) results.push({ table: 'notifications', evicted: notifEvicted });

  // Statuses: evict old, non-bookmarked, non-pinned
  const statusEvicted = await db.statuses
    .where('accountUrl').equals(scope.accountUrl)
    .and(r => r.localUpdatedAt < cutoffs.statuses && !r.bookmarked && !r.pinned)
    .delete();
  if (statusEvicted > 0) results.push({ table: 'statuses', evicted: statusEvicted });

  // Media: evict by localUpdatedAt
  const mediaEvicted = await db.media
    .where('accountUrl').equals(scope.accountUrl)
    .and(r => r.localUpdatedAt < cutoffs.media)
    .delete();
  if (mediaEvicted > 0) results.push({ table: 'media', evicted: mediaEvicted });

  // Conversations: evict by localUpdatedAt
  const convEvicted = await db.conversations
    .where('accountUrl').equals(scope.accountUrl)
    .and(r => r.localUpdatedAt < cutoffs.conversations)
    .delete();
  if (convEvicted > 0) results.push({ table: 'conversations', evicted: convEvicted });

  const totalEvicted = results.reduce((sum, r) => sum + r.evicted, 0);
  return { trigger: 'ttl', results, totalEvicted, durationMs: Date.now() - startTime };
}

/**
 * Enforce maximum record count per table for an account.
 * Evicts oldest records (by localUpdatedAt) when a table exceeds the limit.
 */
export async function enforceMaxRecords(
  scope: AccountScope,
  config = DEFAULT_RETENTION,
): Promise<EvictionReport> {
  const startTime = Date.now();
  const results: EvictionResult[] = [];

  const tables = [
    { table: db.statuses, name: 'statuses' },
    { table: db.notifications, name: 'notifications' },
    { table: db.media, name: 'media' },
    { table: db.conversations, name: 'conversations' },
  ];

  for (const { table, name } of tables) {
    const count = await table.where('accountUrl').equals(scope.accountUrl).count();
    if (count > config.maxRecordsPerTable) {
      const excess = count - config.maxRecordsPerTable;
      // Get the oldest records by localUpdatedAt and delete them
      const oldest = await table
        .where('accountUrl').equals(scope.accountUrl)
        .sortBy('localUpdatedAt');
      const toDelete = oldest.slice(0, excess);
      if (toDelete.length > 0) {
        const keys = toDelete.map(r => (r as any).id
          ? [scope.accountUrl, (r as any).id]
          : undefined,
        ).filter(Boolean) as [string, string][];
        if (keys.length > 0) {
          await table.bulkDelete(keys);
          results.push({ table: name, evicted: keys.length });
        }
      }
    }
  }

  const totalEvicted = results.reduce((sum, r) => sum + r.evicted, 0);
  return { trigger: 'max-records', results, totalEvicted, durationMs: Date.now() - startTime };
}

// ─── Dexie import for key constants ──────────────────────────────────────────

// ─── Diagnostics ─────────────────────────────────────────────────────────────

export interface StorageDiagnostics {
  quota: QuotaStatus;
  tableCounts: Record<string, number>;
  totalRecords: number;
  oldestRecordAge: number | null;
}

/**
 * Get storage diagnostics for an account.
 * Reports counts and ages — never record content.
 */
export async function getStorageDiagnostics(scope: AccountScope): Promise<StorageDiagnostics> {
  const quota = await getQuotaStatus();

  const tableNames = ['accounts', 'statuses', 'notifications', 'relationships',
    'conversations', 'media', 'drafts', 'checkpoints', 'tombstones', 'capabilities', 'settings'];

  const tableCounts: Record<string, number> = {};
  let totalRecords = 0;
  let oldestTimestamp: number | null = null;

  for (const name of tableNames) {
    const table = (db as any)[name];
    if (!table) continue;
    const count = await table.where('accountUrl').equals(scope.accountUrl).count();
    tableCounts[name] = count;
    totalRecords += count;

    // Find oldest localUpdatedAt
    if (count > 0) {
      const oldest = await table
        .where('accountUrl').equals(scope.accountUrl)
        .sortBy('localUpdatedAt');
      if (oldest.length > 0 && oldest[0].localUpdatedAt) {
        if (oldestTimestamp === null || oldest[0].localUpdatedAt < oldestTimestamp) {
          oldestTimestamp = oldest[0].localUpdatedAt;
        }
      }
    }
  }

  const oldestRecordAge = oldestTimestamp !== null ? Date.now() - oldestTimestamp : null;

  return { quota, tableCounts, totalRecords, oldestRecordAge };
}

export { DEFAULT_RETENTION };
