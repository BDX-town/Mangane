/**
 * Phase 7 — State policy tests.
 *
 * Verifies the state inventory is complete, consistent, and correctly
 * classifies all Redux slices.
 */

import {
  STATE_INVENTORY,
  getSlicePolicy,
  getSlicesByAuthority,
  getAccountScopedSlices,
  shouldClearOnAccountSwitch,
} from '../state-policy';

// List of all known Redux slices from reducers/index.ts
const ALL_REDUX_SLICES = [
  'dropdown_menu', 'timelines', 'meta', 'alerts', 'modals',
  'user_lists', 'domain_lists', 'status_lists', 'account_notes',
  'accounts', 'accounts_counters', 'statuses', 'relationships',
  'settings', 'push_notifications', 'mutes', 'reports', 'contexts',
  'compose', 'search', 'notifications', 'custom_emojis', 'lists',
  'listEditor', 'listAdder', 'filters', 'conversations', 'suggestions',
  'polls', 'trends', 'groups', 'group_relationships', 'group_lists',
  'group_editor', 'sidebar', 'patron', 'soapbox', 'instance', 'me',
  'auth', 'admin', 'profile_hover_card', 'status_hover_card', 'backups',
  'admin_log', 'security', 'scheduled_statuses', 'pending_statuses',
  'aliases', 'accounts_meta', 'trending_statuses', 'verification',
  'onboarding', 'rules', 'history', 'announcements', 'tags',
];

describe('STATE_INVENTORY', () => {
  it('covers all known Redux slices', () => {
    const inventoriedSlices = STATE_INVENTORY.map(p => p.slice);
    for (const slice of ALL_REDUX_SLICES) {
      expect(inventoriedSlices).toContain(slice);
    }
  });

  it('has no duplicate entries', () => {
    const slices = STATE_INVENTORY.map(p => p.slice);
    const unique = new Set(slices);
    expect(unique.size).toBe(slices.length);
  });

  it('every entry has a valid authority', () => {
    for (const policy of STATE_INVENTORY) {
      expect(['server', 'durable', 'ephemeral']).toContain(policy.authority);
    }
  });

  it('every entry has a valid targetPersistence', () => {
    for (const policy of STATE_INVENTORY) {
      expect(['indexeddb', 'none', 'session-storage']).toContain(policy.targetPersistence);
    }
  });

  it('every entry has a valid migrationStatus', () => {
    for (const policy of STATE_INVENTORY) {
      expect(['legacy', 'boundary-wrapped', 'migrated']).toContain(policy.migrationStatus);
    }
  });

  it('durable slices (auth, settings, soapbox) are marked persistedToday', () => {
    const durable = getSlicesByAuthority('durable');
    for (const p of durable) {
      expect(p.persistedToday).toBe(true);
    }
  });

  it('account-scoped slices include the critical entities', () => {
    const scoped = getAccountScopedSlices();
    const scopedNames = scoped.map(p => p.slice);
    expect(scopedNames).toContain('accounts');
    expect(scopedNames).toContain('statuses');
    expect(scopedNames).toContain('notifications');
    expect(scopedNames).toContain('relationships');
    expect(scopedNames).toContain('timelines');
  });
});

describe('getSlicePolicy', () => {
  it('returns the policy for a known slice', () => {
    const policy = getSlicePolicy('accounts');
    expect(policy).toBeDefined();
    expect(policy!.authority).toBe('server');
  });

  it('returns undefined for unknown slices', () => {
    expect(getSlicePolicy('nonexistent')).toBeUndefined();
  });
});

describe('shouldClearOnAccountSwitch', () => {
  it('returns true for account-scoped server state', () => {
    expect(shouldClearOnAccountSwitch('accounts')).toBe(true);
    expect(shouldClearOnAccountSwitch('statuses')).toBe(true);
    expect(shouldClearOnAccountSwitch('notifications')).toBe(true);
  });

  it('returns true for account-scoped ephemeral state', () => {
    expect(shouldClearOnAccountSwitch('compose')).toBe(true);
    expect(shouldClearOnAccountSwitch('search')).toBe(true);
  });

  it('returns false for durable state (survives account switch)', () => {
    expect(shouldClearOnAccountSwitch('auth')).toBe(false);
    expect(shouldClearOnAccountSwitch('settings')).toBe(false);
  });

  it('returns false for non-scoped ephemeral state', () => {
    expect(shouldClearOnAccountSwitch('modals')).toBe(false);
    expect(shouldClearOnAccountSwitch('alerts')).toBe(false);
  });

  it('returns false for unknown slices', () => {
    expect(shouldClearOnAccountSwitch('nonexistent')).toBe(false);
  });
});
