/**
 * Phase 7 — Migration framework tests.
 */

import {
  DEPRECATED_ACCESSES,
  getMigrationProgress,
  isModuleMigrated,
  MODULE_MIGRATIONS,
} from '../migration-framework';

describe('MODULE_MIGRATIONS', () => {
  it('has no duplicate module entries', () => {
    const modules = MODULE_MIGRATIONS.map(m => m.module);
    expect(new Set(modules).size).toBe(modules.length);
  });

  it('every entry has valid phase', () => {
    const validPhases = ['identified', 'boundary-added', 'dual-path', 'legacy-removed', 'verified'];
    for (const m of MODULE_MIGRATIONS) {
      expect(validPhases).toContain(m.phase);
    }
  });

  it('every entry has at least one legacy dependency', () => {
    for (const m of MODULE_MIGRATIONS) {
      expect(m.legacyDependencies.length).toBeGreaterThan(0);
    }
  });

  it('every entry has at least one target API', () => {
    for (const m of MODULE_MIGRATIONS) {
      expect(m.targetAPIs.length).toBeGreaterThan(0);
    }
  });
});

describe('DEPRECATED_ACCESSES', () => {
  it('has no duplicate patterns', () => {
    const patterns = DEPRECATED_ACCESSES.map(d => d.pattern);
    expect(new Set(patterns).size).toBe(patterns.length);
  });

  it('every entry has a replacement', () => {
    for (const d of DEPRECATED_ACCESSES) {
      expect(d.replacement.length).toBeGreaterThan(0);
    }
  });
});

describe('getMigrationProgress', () => {
  it('returns counts for all phases', () => {
    const progress = getMigrationProgress();
    expect(typeof progress.identified).toBe('number');
    expect(typeof progress['boundary-added']).toBe('number');
    expect(typeof progress['dual-path']).toBe('number');
    expect(typeof progress['legacy-removed']).toBe('number');
    expect(typeof progress.verified).toBe('number');
  });

  it('total equals MODULE_MIGRATIONS length', () => {
    const progress = getMigrationProgress();
    const total = Object.values(progress).reduce((a, b) => a + b, 0);
    expect(total).toBe(MODULE_MIGRATIONS.length);
  });
});

describe('isModuleMigrated', () => {
  it('returns false for modules in early phases', () => {
    expect(isModuleMigrated('features/notifications')).toBe(false);
  });

  it('returns false for unknown modules', () => {
    expect(isModuleMigrated('nonexistent')).toBe(false);
  });
});
