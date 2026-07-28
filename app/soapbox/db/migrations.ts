/**
 * Phase 5B — Schema versioning and resumable migrations.
 *
 * Handles IndexedDB schema upgrades safely:
 * - Tracks migration state in a dedicated metadata table
 * - Supports interruption: if the browser closes mid-migration, it resumes
 * - Each migration step is idempotent (safe to re-run)
 * - Migration errors are logged but don't block app startup
 * - Corruption is detected and quarantined rather than propagated
 *
 * Dexie handles the IndexedDB version upgrade (structural schema changes)
 * automatically. This module handles DATA migrations that need to run
 * after a schema version bump (e.g., populating new fields, converting
 * formats, rebuilding indexes).
 */


// ─── Migration Metadata ──────────────────────────────────────────────────────

export interface MigrationRecord {
  /** Migration identifier (e.g., "v1-to-v2-add-language-field") */
  readonly id: string;
  /** Schema version this migration targets */
  readonly targetVersion: number;
  /** Current status */
  status: 'pending' | 'running' | 'completed' | 'failed';
  /** When migration started (ms since epoch) */
  startedAt: number | null;
  /** When migration completed or failed */
  completedAt: number | null;
  /** Error message if failed */
  error: string | null;
  /** Number of records processed (for resumability) */
  processedCount: number;
  /** Total records to process (if known) */
  totalCount: number | null;
}

/**
 * Migration function signature.
 * Receives a progress callback for resumability tracking.
 */
export type MigrationFn = (
  progress: (processed: number, total: number | null) => void,
) => Promise<void>;

export interface MigrationDefinition {
  readonly id: string;
  readonly targetVersion: number;
  readonly description: string;
  readonly run: MigrationFn;
}

// ─── Migration Journal (persisted in localStorage for crash recovery) ────────

const JOURNAL_KEY = 'mangane:db:migration-journal:v1';

interface MigrationJournal {
  schemaVersion: 1;
  migrations: MigrationRecord[];
}

function readJournal(): MigrationJournal {
  try {
    const raw = localStorage.getItem(JOURNAL_KEY);
    if (!raw) return { schemaVersion: 1, migrations: [] };
    const parsed = JSON.parse(raw);
    if (parsed?.schemaVersion !== 1 || !Array.isArray(parsed?.migrations)) {
      localStorage.removeItem(JOURNAL_KEY);
      return { schemaVersion: 1, migrations: [] };
    }
    return parsed as MigrationJournal;
  } catch {
    try {
      localStorage.removeItem(JOURNAL_KEY);
    } catch { /* ignore */ }
    return { schemaVersion: 1, migrations: [] };
  }
}

function writeJournal(journal: MigrationJournal): void {
  try {
    localStorage.setItem(JOURNAL_KEY, JSON.stringify(journal));
  } catch {
    // Quota exceeded on migration metadata is non-fatal;
    // the migration will re-run on next startup which is safe (idempotent).
  }
}

function updateMigrationRecord(id: string, update: Partial<MigrationRecord>): void {
  const journal = readJournal();
  const index = journal.migrations.findIndex(m => m.id === id);
  if (index >= 0) {
    journal.migrations[index] = { ...journal.migrations[index], ...update };
  } else {
    journal.migrations.push({
      id,
      targetVersion: update.targetVersion ?? 0,
      status: 'pending',
      startedAt: null,
      completedAt: null,
      error: null,
      processedCount: 0,
      totalCount: null,
      ...update,
    });
  }
  writeJournal(journal);
}

// ─── Migration Runner ────────────────────────────────────────────────────────

/** Registry of all defined migrations, ordered by targetVersion then id. */
const MIGRATIONS: MigrationDefinition[] = [];

/**
 * Register a migration. Call this at module load time.
 * Migrations are run in order of targetVersion, then registration order.
 */
export function registerMigration(definition: MigrationDefinition): void {
  MIGRATIONS.push(definition);
  MIGRATIONS.sort((a, b) => a.targetVersion - b.targetVersion || a.id.localeCompare(b.id));
}

/**
 * Run all pending migrations.
 * This is called once at app startup after the database is open.
 *
 * Properties:
 * - Idempotent: completed migrations are skipped
 * - Resumable: interrupted migrations restart from the beginning (migration
 *   functions must be idempotent for this to be safe)
 * - Non-blocking: errors in one migration don't prevent others from running
 * - Observable: returns a report of what happened
 */
export async function runPendingMigrations(): Promise<MigrationReport> {
  const journal = readJournal();
  const completedIds = new Set(
    journal.migrations.filter(m => m.status === 'completed').map(m => m.id),
  );

  const results: MigrationResult[] = [];

  for (const migration of MIGRATIONS) {
    if (completedIds.has(migration.id)) {
      results.push({ id: migration.id, status: 'skipped', durationMs: 0 });
      continue;
    }

    const startTime = Date.now();
    updateMigrationRecord(migration.id, {
      targetVersion: migration.targetVersion,
      status: 'running',
      startedAt: startTime,
      error: null,
    });

    try {
      await migration.run((processed, total) => {
        updateMigrationRecord(migration.id, {
          processedCount: processed,
          totalCount: total,
        });
      });

      const durationMs = Date.now() - startTime;
      updateMigrationRecord(migration.id, {
        status: 'completed',
        completedAt: Date.now(),
      });
      results.push({ id: migration.id, status: 'completed', durationMs });
    } catch (error: unknown) {
      const durationMs = Date.now() - startTime;
      const message = error instanceof Error ? error.message : 'Unknown migration error';
      updateMigrationRecord(migration.id, {
        status: 'failed',
        completedAt: Date.now(),
        error: message.slice(0, 500), // Truncate to prevent localStorage bloat
      });
      results.push({ id: migration.id, status: 'failed', durationMs, error: message });
      // Continue with other migrations — don't block startup
    }
  }

  return { migrations: results, journalSize: readJournal().migrations.length };
}

export interface MigrationResult {
  id: string;
  status: 'completed' | 'failed' | 'skipped';
  durationMs: number;
  error?: string;
}

export interface MigrationReport {
  migrations: MigrationResult[];
  journalSize: number;
}

/**
 * Get the current migration state for diagnostics.
 * Returns sanitized data (no record content).
 */
export function getMigrationDiagnostics(): { pending: number; completed: number; failed: number } {
  const journal = readJournal();
  return {
    pending: MIGRATIONS.filter(m => !journal.migrations.find(j => j.id === m.id && j.status === 'completed')).length,
    completed: journal.migrations.filter(m => m.status === 'completed').length,
    failed: journal.migrations.filter(m => m.status === 'failed').length,
  };
}

/**
 * Reset migration journal. Used for testing or emergency recovery.
 * Does NOT undo data changes — only resets tracking.
 */
export function resetMigrationJournal(): void {
  try {
    localStorage.removeItem(JOURNAL_KEY);
  } catch { /* ignore */ }
}
