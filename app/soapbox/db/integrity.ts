/**
 * Phase 5B — Corruption detection and self-healing.
 *
 * Detects corrupted records in the local store and quarantines them
 * rather than serving bad data to the UI. Self-healing strategies:
 *
 * 1. STRUCTURAL: Missing required fields → quarantine + tombstone
 * 2. TYPE MISMATCH: Wrong field types → quarantine + tombstone
 * 3. REFERENTIAL: Orphan references → soft-delete reference (not record)
 * 4. TEMPORAL: Future timestamps → clamp to current time
 *
 * Diagnostics expose corruption counts without leaking content.
 */


// ─── Validation Rules ────────────────────────────────────────────────────────

export interface IntegrityViolation {
  /** Table where corruption was found */
  table: string;
  /** Record primary key components */
  accountUrl: string;
  entityId: string;
  /** What's wrong */
  violation: string;
  /** Severity determines action */
  severity: 'critical' | 'warning';
  /** When detected */
  detectedAt: number;
}

/**
 * Validates a record's structural integrity.
 * Returns violations found (empty array = valid).
 */
export function validateRecord(
  table: string,
  record: unknown,
  accountUrl: string,
): IntegrityViolation[] {
  const violations: IntegrityViolation[] = [];
  const now = Date.now();

  if (!record || typeof record !== 'object') {
    violations.push(makeViolation(table, accountUrl, '?', 'Record is null or not an object', 'critical'));
    return violations;
  }

  const r = record as Record<string, unknown>;

  // Base record validation
  if (typeof r.accountUrl !== 'string' || r.accountUrl.length === 0) {
    violations.push(makeViolation(table, accountUrl, String(r.id ?? '?'), 'Missing or invalid accountUrl', 'critical'));
  } else if (r.accountUrl !== accountUrl) {
    violations.push(makeViolation(table, accountUrl, String(r.id ?? '?'), 'accountUrl scope mismatch (IDOR)', 'critical'));
  }

  if (typeof r.localUpdatedAt !== 'number' || !Number.isFinite(r.localUpdatedAt)) {
    violations.push(makeViolation(table, accountUrl, String(r.id ?? '?'), 'Missing or invalid localUpdatedAt', 'warning'));
  } else if (r.localUpdatedAt > now + 60000) {
    // Allow 1 minute clock skew, but flag future timestamps beyond that
    violations.push(makeViolation(table, accountUrl, String(r.id ?? '?'), 'localUpdatedAt is in the future', 'warning'));
  }

  // Table-specific validation
  if (table === 'statuses') {
    validateStatus(r, accountUrl, violations);
  } else if (table === 'accounts') {
    validateAccount(r, accountUrl, violations);
  } else if (table === 'notifications') {
    validateNotification(r, accountUrl, violations);
  }

  return violations;
}

function validateStatus(r: Record<string, unknown>, accountUrl: string, violations: IntegrityViolation[]): void {
  if (typeof r.id !== 'string' || r.id.length === 0) {
    violations.push(makeViolation('statuses', accountUrl, '?', 'Missing status id', 'critical'));
  }
  if (typeof r.content !== 'string') {
    violations.push(makeViolation('statuses', accountUrl, String(r.id ?? '?'), 'content is not a string', 'critical'));
  }
  if (typeof r.accountId !== 'string' || r.accountId.length === 0) {
    violations.push(makeViolation('statuses', accountUrl, String(r.id ?? '?'), 'Missing accountId', 'critical'));
  }
  const validVisibilities = ['public', 'unlisted', 'private', 'direct'];
  if (!validVisibilities.includes(r.visibility as string)) {
    violations.push(makeViolation('statuses', accountUrl, String(r.id ?? '?'), 'Invalid visibility value', 'warning'));
  }
}

function validateAccount(r: Record<string, unknown>, accountUrl: string, violations: IntegrityViolation[]): void {
  if (typeof r.id !== 'string' || r.id.length === 0) {
    violations.push(makeViolation('accounts', accountUrl, '?', 'Missing account id', 'critical'));
  }
  if (typeof r.username !== 'string' || r.username.length === 0) {
    violations.push(makeViolation('accounts', accountUrl, String(r.id ?? '?'), 'Missing username', 'critical'));
  }
  if (typeof r.acct !== 'string') {
    violations.push(makeViolation('accounts', accountUrl, String(r.id ?? '?'), 'Missing acct field', 'warning'));
  }
}

function validateNotification(r: Record<string, unknown>, accountUrl: string, violations: IntegrityViolation[]): void {
  if (typeof r.id !== 'string' || r.id.length === 0) {
    violations.push(makeViolation('notifications', accountUrl, '?', 'Missing notification id', 'critical'));
  }
  if (typeof r.type !== 'string' || r.type.length === 0) {
    violations.push(makeViolation('notifications', accountUrl, String(r.id ?? '?'), 'Missing notification type', 'critical'));
  }
}

function makeViolation(
  table: string,
  accountUrl: string,
  entityId: string,
  violation: string,
  severity: 'critical' | 'warning',
): IntegrityViolation {
  return { table, accountUrl, entityId, violation, severity, detectedAt: Date.now() };
}

// ─── Self-Healing Actions ────────────────────────────────────────────────────

/**
 * Clamp a timestamp that's in the future back to now.
 * Used for the "temporal" self-healing strategy.
 */
export function clampTimestamp(timestamp: number): number {
  const now = Date.now();
  return timestamp > now ? now : timestamp;
}

/**
 * Determine the correct action for a set of violations.
 */
export function determineAction(violations: IntegrityViolation[]): 'quarantine' | 'heal' | 'pass' {
  if (violations.length === 0) return 'pass';
  if (violations.some(v => v.severity === 'critical')) return 'quarantine';
  return 'heal';
}

// ─── Diagnostics (content-free) ──────────────────────────────────────────────

export interface IntegrityReport {
  /** Number of records checked */
  checked: number;
  /** Number of records with violations */
  corrupted: number;
  /** Number of records quarantined (critical) */
  quarantined: number;
  /** Number of records healed (warning-only) */
  healed: number;
  /** Violation type counts (no record content) */
  violationCounts: Record<string, number>;
}

/**
 * Create an empty integrity report for accumulation.
 */
export function createEmptyReport(): IntegrityReport {
  return { checked: 0, corrupted: 0, quarantined: 0, healed: 0, violationCounts: {} };
}

/**
 * Accumulate a validation result into a report.
 * Does NOT include record content — only counts and violation types.
 */
export function accumulateReport(report: IntegrityReport, violations: IntegrityViolation[]): void {
  report.checked += 1;
  if (violations.length > 0) {
    report.corrupted += 1;
    const action = determineAction(violations);
    if (action === 'quarantine') report.quarantined += 1;
    else if (action === 'heal') report.healed += 1;
  }
  for (const v of violations) {
    report.violationCounts[v.violation] = (report.violationCounts[v.violation] || 0) + 1;
  }
}
