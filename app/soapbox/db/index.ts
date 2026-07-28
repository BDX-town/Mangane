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
} from './schema';

// Database instance (for diagnostics and purge operations only)
export { db } from './instance';
