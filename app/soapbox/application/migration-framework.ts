/**
 * Phase 7 — Module migration framework.
 *
 * Provides the template and tracking infrastructure for migrating
 * legacy modules from direct Redux/Immutable.js access to the
 * stable application boundary (timeline-read-model + outbox).
 *
 * Migration workflow:
 * 1. Register the module in the deprecated API registry
 * 2. Wrap legacy access behind the domain boundary (this file's patterns)
 * 3. Verify equivalence using test helpers
 * 4. Remove the deprecated access
 * 5. Update the migration status in state-policy.ts
 *
 * This file is imported by governance/CI scripts to track progress.
 */

// ─── Module migration registry ──────────────────────────────────────────────

export type MigrationPhase =
  | 'identified'       // Legacy access inventoried
  | 'boundary-added'   // Domain boundary wrapper created
  | 'dual-path'        // Both paths active, equivalence tested
  | 'legacy-removed'   // Direct Redux access removed
  | 'verified';        // CI confirms no regression

export interface ModuleMigration {
  /** Module identifier (feature directory name). */
  readonly module: string;
  /** Human-readable description. */
  readonly description: string;
  /** Current migration phase. */
  readonly phase: MigrationPhase;
  /** Redux slices this module directly accesses. */
  readonly legacyDependencies: ReadonlyArray<string>;
  /** Application boundary APIs it should use instead. */
  readonly targetAPIs: ReadonlyArray<string>;
  /** Tracking issue or PR reference. */
  readonly tracking: string;
}

/**
 * Registry of all module migrations.
 * Updated as modules progress through the migration workflow.
 */
export const MODULE_MIGRATIONS: ReadonlyArray<ModuleMigration> = Object.freeze([
  {
    module: 'features/home_timeline',
    description: 'Home timeline feed display',
    phase: 'boundary-added',
    legacyDependencies: ['timelines', 'statuses', 'accounts'],
    targetAPIs: ['useTimelineState', 'useStatusView', 'useAccountView'],
    tracking: 'Phase 7',
  },
  {
    module: 'features/notifications',
    description: 'Notification list and interactions',
    phase: 'identified',
    legacyDependencies: ['notifications', 'statuses', 'accounts'],
    targetAPIs: ['useTimelineState', 'useStatusView', 'useAccountView'],
    tracking: 'Phase 7',
  },
]);

// ─── Deprecated access tracking ─────────────────────────────────────────────

export interface DeprecatedAccess {
  /** The import/pattern being deprecated. */
  readonly pattern: string;
  /** What to use instead. */
  readonly replacement: string;
  /** Phase that introduces the replacement. */
  readonly introducedIn: string;
  /** Phase by which usage should be removed. */
  readonly removeBy: string;
  /** Whether it's actively being enforced by lint/CI. */
  readonly enforced: boolean;
}

/**
 * Registry of deprecated access patterns.
 * CI scripts reference this to enforce migration progress.
 */
export const DEPRECATED_ACCESSES: ReadonlyArray<DeprecatedAccess> = Object.freeze([
  {
    pattern: 'useAppSelector(state => state.timelines.get(...))',
    replacement: 'useTimelineState(timelineId)',
    introducedIn: 'Phase 7',
    removeBy: 'Phase 9',
    enforced: false,
  },
  {
    pattern: 'useAppSelector(state => state.statuses.get(id))',
    replacement: 'useStatusView(statusId)',
    introducedIn: 'Phase 7',
    removeBy: 'Phase 9',
    enforced: false,
  },
  {
    pattern: 'useAppSelector(state => state.accounts.get(id))',
    replacement: 'useAccountView(accountId)',
    introducedIn: 'Phase 7',
    removeBy: 'Phase 9',
    enforced: false,
  },
  {
    pattern: 'import { makeGetStatus } from "soapbox/selectors"',
    replacement: 'import { useStatusView } from "soapbox/application/use-timeline"',
    introducedIn: 'Phase 7',
    removeBy: 'Phase 9',
    enforced: false,
  },
  {
    pattern: 'import { makeGetAccount } from "soapbox/selectors"',
    replacement: 'import { useAccountView } from "soapbox/application/use-timeline"',
    introducedIn: 'Phase 7',
    removeBy: 'Phase 9',
    enforced: false,
  },
]);

// ─── Governance queries ──────────────────────────────────────────────────────

/** Count modules at each migration phase. */
export function getMigrationProgress(): Record<MigrationPhase, number> {
  const counts: Record<MigrationPhase, number> = {
    identified: 0,
    'boundary-added': 0,
    'dual-path': 0,
    'legacy-removed': 0,
    verified: 0,
  };
  for (const m of MODULE_MIGRATIONS) {
    counts[m.phase]++;
  }
  return counts;
}

/** Check if a module has completed migration. */
export function isModuleMigrated(module: string): boolean {
  const entry = MODULE_MIGRATIONS.find(m => m.module === module);
  return entry?.phase === 'verified' || entry?.phase === 'legacy-removed';
}
