/**
 * Phase 5 — Canonical local data store.
 *
 * Public API for the Mangane local database.
 * All access to IndexedDB goes through this module.
 *
 * Usage:
 *   import { createAccountScope, statusesRepo } from 'soapbox/db';
 *   const scope = createAccountScope(account.url);
 *   const status = await statusesRepo.get(scope, statusId);
 */

// Account scoping (IDOR protection)
export { createAccountScope, AccountScopeError } from './repository';
export type { AccountScope } from './repository';

// Repository instances
export {
  accountsRepo,
  statusesRepo,
  notificationsRepo,
  relationshipsRepo,
  draftsRepo,
  checkpointsRepo,
  tombstonesRepo,
  purgeAllAccountData,
} from './repository';

// Error types
export { RepositoryError, QuotaExceededRepositoryError, CorruptionError } from './repository';

// Schema (for testing and diagnostics only)
export { SCHEMA_VERSION, SCHEMA_V1, ManganeDatabase } from './schema';

// Migrations
export { runPendingMigrations, registerMigration, getMigrationDiagnostics, resetMigrationJournal } from './migrations';
export type { MigrationDefinition, MigrationReport, MigrationResult } from './migrations';

// Integrity
export { validateRecord, clampTimestamp, determineAction, createEmptyReport, accumulateReport } from './integrity';
export type { IntegrityViolation, IntegrityReport } from './integrity';

// Quota and retention
export { getQuotaStatus, enforceRetention, enforceMaxRecords, getStorageDiagnostics, DEFAULT_RETENTION } from './quota';
export type { QuotaStatus, RetentionConfig, EvictionReport, StorageDiagnostics } from './quota';

// Sync bridge (API ↔ IndexedDB)
export {
  setLocalStoreEnabled,
  isLocalStoreEnabled,
  persistAccounts,
  persistStatuses,
  persistNotifications,
  loadCachedStatuses,
  loadCachedNotifications,
} from './sync';

// Timeline membership and ordering
export { timelineRepo } from './timelines';
export type { TimelineId, TimelineMember, TimelineCursor, TimelineGap } from './timelines';

// Bounded timeline hydration for semantic position continuity
export { loadTimelineWindow } from './timeline-window';
export type { TimelineWindowRequest, TimelineWindow } from './timeline-window';

// Projections (storage → presentation boundary)
export {
  normalizeVisibility,
  isKnownVisibility,
  projectStatus,
  projectAccount,
  projectNotification,
  projectConversation,
} from './projections';
export type {
  KnownVisibility,
  StatusProjection,
  AccountProjection,
  NotificationProjection,
  ConversationProjection,
} from './projections';

// Position anchors (scroll restoration)
export {
  capturePosition,
  restorePosition,
  clearPosition,
  purgePositions,
  getPositionDiagnostics,
} from './position-anchor';
export type { PositionAnchor } from './position-anchor';

// Server marker degradation
export { resolvePosition, shouldUploadMarker } from './markers';
export type { ServerMarker, MarkerResolution } from './markers';
export type {
  BaseRecord,
  StoredAccount,
  StoredStatus,
  StoredNotification,
  StoredRelationship,
  StoredConversation,
  StoredMedia,
  StoredDraft,
  StoredCheckpoint,
  StoredTombstone,
  StoredCapability,
  StoredSetting,
  StoredOutboxEntry,
} from './schema';

// Database instance (for diagnostics and purge operations only)
export { db } from './instance';

// Outbox repository (Phase 6 — durable mutations)
export {
  enqueue as outboxEnqueue,
  getEntry as outboxGetEntry,
  updateEntry as outboxUpdateEntry,
  getReadyOperations as outboxGetReady,
  getByState as outboxGetByState,
  getActiveOperations as outboxGetActive,
  countByState as outboxCountByState,
  cancelEntry as outboxCancel,
  retryEntry as outboxRetry,
  discardEntry as outboxDiscard,
  purgeCompleted as outboxPurgeCompleted,
  purgeAccount as outboxPurgeAccount,
  recoverStaleInflight as outboxRecoverStale,
} from './outbox-repository';
