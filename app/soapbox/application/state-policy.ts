/**
 * Phase 7 — Server-state versus durable-state policy.
 *
 * Defines the canonical authority for each category of application state.
 * This policy determines where state lives, how it's accessed, and when
 * it's evicted.
 *
 * Three state authorities:
 * 1. SERVER: truth lives on the remote server. Local copy is a cache.
 *    Eviction is safe; re-fetch restores it. Examples: accounts, statuses.
 *
 * 2. DURABLE: truth lives locally in IndexedDB (Phase 5 store).
 *    Survives reload, network loss. Examples: drafts, outbox, settings.
 *
 * 3. EPHEMERAL: truth lives only in memory for the current session.
 *    Lost on reload. Examples: compose state, modal stack, hover cards.
 *
 * Rules:
 * - SERVER state must never block the UI on network (use cached copy).
 * - DURABLE state is the single source of truth when present.
 * - EPHEMERAL state should never hold user-created content without backup.
 * - When DURABLE and SERVER conflict, DURABLE wins until reconciled (outbox).
 * - Legacy Redux slices are being migrated; their authority is documented here
 *   to define the target, not the current implementation.
 */

// ─── Authority classification ────────────────────────────────────────────────

export type StateAuthority = 'server' | 'durable' | 'ephemeral';

export interface StateSlicePolicy {
  /** The Redux slice name (matches key in root reducer). */
  readonly slice: string;
  /** Where canonical truth lives. */
  readonly authority: StateAuthority;
  /** Whether this slice persists across page reloads today. */
  readonly persistedToday: boolean;
  /** Target persistence in the migrated architecture. */
  readonly targetPersistence: 'indexeddb' | 'none' | 'session-storage';
  /** Whether this slice is account-scoped (IDOR-relevant). */
  readonly accountScoped: boolean;
  /** Migration status. */
  readonly migrationStatus: 'legacy' | 'boundary-wrapped' | 'migrated';
  /** Brief description. */
  readonly description: string;
}

// ─── Canonical inventory ─────────────────────────────────────────────────────

export const STATE_INVENTORY: ReadonlyArray<StateSlicePolicy> = Object.freeze([
  // ── Server-authoritative (entity caches) ───────────────────────────────
  { slice: 'accounts', authority: 'server', persistedToday: false, targetPersistence: 'indexeddb', accountScoped: true, migrationStatus: 'legacy', description: 'Account entity cache (ImmutableMap<id, record>).' },
  { slice: 'accounts_counters', authority: 'server', persistedToday: false, targetPersistence: 'indexeddb', accountScoped: true, migrationStatus: 'legacy', description: 'Follower/following/status counts.' },
  { slice: 'accounts_meta', authority: 'server', persistedToday: false, targetPersistence: 'indexeddb', accountScoped: true, migrationStatus: 'legacy', description: 'Additional account metadata (Pleroma/Akkoma fields).' },
  { slice: 'statuses', authority: 'server', persistedToday: false, targetPersistence: 'indexeddb', accountScoped: true, migrationStatus: 'legacy', description: 'Status entity cache (minified, relations as IDs).' },
  { slice: 'relationships', authority: 'server', persistedToday: false, targetPersistence: 'indexeddb', accountScoped: true, migrationStatus: 'legacy', description: 'Follow/block/mute relationship state.' },
  { slice: 'notifications', authority: 'server', persistedToday: false, targetPersistence: 'indexeddb', accountScoped: true, migrationStatus: 'legacy', description: 'Notification list and metadata.' },
  { slice: 'conversations', authority: 'server', persistedToday: false, targetPersistence: 'indexeddb', accountScoped: true, migrationStatus: 'legacy', description: 'Direct message conversations.' },
  { slice: 'polls', authority: 'server', persistedToday: false, targetPersistence: 'none', accountScoped: true, migrationStatus: 'legacy', description: 'Poll data keyed by poll ID.' },
  { slice: 'custom_emojis', authority: 'server', persistedToday: false, targetPersistence: 'indexeddb', accountScoped: false, migrationStatus: 'legacy', description: 'Instance custom emoji list.' },
  { slice: 'filters', authority: 'server', persistedToday: false, targetPersistence: 'indexeddb', accountScoped: true, migrationStatus: 'legacy', description: 'Content filter rules.' },
  { slice: 'lists', authority: 'server', persistedToday: false, targetPersistence: 'indexeddb', accountScoped: true, migrationStatus: 'legacy', description: 'User-created lists.' },
  { slice: 'instance', authority: 'server', persistedToday: false, targetPersistence: 'indexeddb', accountScoped: false, migrationStatus: 'legacy', description: 'Instance metadata and capabilities.' },
  { slice: 'rules', authority: 'server', persistedToday: false, targetPersistence: 'none', accountScoped: false, migrationStatus: 'legacy', description: 'Instance rules.' },
  { slice: 'announcements', authority: 'server', persistedToday: false, targetPersistence: 'none', accountScoped: false, migrationStatus: 'legacy', description: 'Instance announcements.' },
  { slice: 'trends', authority: 'server', persistedToday: false, targetPersistence: 'none', accountScoped: false, migrationStatus: 'legacy', description: 'Trending hashtags/links.' },
  { slice: 'trending_statuses', authority: 'server', persistedToday: false, targetPersistence: 'none', accountScoped: false, migrationStatus: 'legacy', description: 'Trending statuses.' },
  { slice: 'suggestions', authority: 'server', persistedToday: false, targetPersistence: 'none', accountScoped: true, migrationStatus: 'legacy', description: 'Follow suggestions.' },
  { slice: 'tags', authority: 'server', persistedToday: false, targetPersistence: 'none', accountScoped: true, migrationStatus: 'legacy', description: 'Followed hashtags.' },
  { slice: 'contexts', authority: 'server', persistedToday: false, targetPersistence: 'none', accountScoped: false, migrationStatus: 'legacy', description: 'Thread ancestor/descendant relationships.' },
  { slice: 'history', authority: 'server', persistedToday: false, targetPersistence: 'none', accountScoped: false, migrationStatus: 'legacy', description: 'Status edit history.' },

  // ── Server-authoritative (collection views) ────────────────────────────
  { slice: 'timelines', authority: 'server', persistedToday: false, targetPersistence: 'indexeddb', accountScoped: true, migrationStatus: 'legacy', description: 'Timeline membership (ordered status ID sets).' },
  { slice: 'status_lists', authority: 'server', persistedToday: false, targetPersistence: 'none', accountScoped: true, migrationStatus: 'legacy', description: 'Favourites, bookmarks, pins lists.' },
  { slice: 'user_lists', authority: 'server', persistedToday: false, targetPersistence: 'none', accountScoped: true, migrationStatus: 'legacy', description: 'Followers/following/blocks/mutes lists.' },
  { slice: 'domain_lists', authority: 'server', persistedToday: false, targetPersistence: 'none', accountScoped: true, migrationStatus: 'legacy', description: 'Domain block list.' },

  // ── Server-authoritative (admin) ───────────────────────────────────────
  { slice: 'admin', authority: 'server', persistedToday: false, targetPersistence: 'none', accountScoped: true, migrationStatus: 'legacy', description: 'Admin panel state (users, reports, configs).' },
  { slice: 'admin_log', authority: 'server', persistedToday: false, targetPersistence: 'none', accountScoped: true, migrationStatus: 'legacy', description: 'Admin moderation log.' },

  // ── Server-authoritative (groups) ──────────────────────────────────────
  { slice: 'groups', authority: 'server', persistedToday: false, targetPersistence: 'none', accountScoped: true, migrationStatus: 'legacy', description: 'Group entities.' },
  { slice: 'group_relationships', authority: 'server', persistedToday: false, targetPersistence: 'none', accountScoped: true, migrationStatus: 'legacy', description: 'Group membership state.' },
  { slice: 'group_lists', authority: 'server', persistedToday: false, targetPersistence: 'none', accountScoped: true, migrationStatus: 'legacy', description: 'Group member/removed lists.' },

  // ── Durable (local-first, survives reload) ─────────────────────────────
  { slice: 'auth', authority: 'durable', persistedToday: true, targetPersistence: 'indexeddb', accountScoped: false, migrationStatus: 'legacy', description: 'Auth tokens and multi-account state. Persisted to localStorage.' },
  { slice: 'settings', authority: 'durable', persistedToday: true, targetPersistence: 'indexeddb', accountScoped: true, migrationStatus: 'legacy', description: 'User preferences. Persisted to localStorage + server.' },
  { slice: 'soapbox', authority: 'durable', persistedToday: true, targetPersistence: 'indexeddb', accountScoped: false, migrationStatus: 'legacy', description: 'Instance frontend configuration.' },

  // ── Ephemeral (session-only, lost on reload) ───────────────────────────
  { slice: 'compose', authority: 'ephemeral', persistedToday: false, targetPersistence: 'none', accountScoped: true, migrationStatus: 'legacy', description: 'Active compose form state.' },
  { slice: 'search', authority: 'ephemeral', persistedToday: false, targetPersistence: 'none', accountScoped: true, migrationStatus: 'legacy', description: 'Current search query and results.' },
  { slice: 'modals', authority: 'ephemeral', persistedToday: false, targetPersistence: 'none', accountScoped: false, migrationStatus: 'legacy', description: 'Modal stack.' },
  { slice: 'alerts', authority: 'ephemeral', persistedToday: false, targetPersistence: 'none', accountScoped: false, migrationStatus: 'legacy', description: 'Toast notification queue.' },
  { slice: 'dropdown_menu', authority: 'ephemeral', persistedToday: false, targetPersistence: 'none', accountScoped: false, migrationStatus: 'legacy', description: 'Currently open dropdown.' },
  { slice: 'sidebar', authority: 'ephemeral', persistedToday: false, targetPersistence: 'none', accountScoped: false, migrationStatus: 'legacy', description: 'Sidebar open/close state.' },
  { slice: 'profile_hover_card', authority: 'ephemeral', persistedToday: false, targetPersistence: 'none', accountScoped: false, migrationStatus: 'legacy', description: 'Hover card visibility and target.' },
  { slice: 'status_hover_card', authority: 'ephemeral', persistedToday: false, targetPersistence: 'none', accountScoped: false, migrationStatus: 'legacy', description: 'Status hover card state.' },
  { slice: 'onboarding', authority: 'ephemeral', persistedToday: false, targetPersistence: 'none', accountScoped: true, migrationStatus: 'legacy', description: 'Onboarding wizard progress.' },
  { slice: 'meta', authority: 'ephemeral', persistedToday: false, targetPersistence: 'none', accountScoped: false, migrationStatus: 'legacy', description: 'App meta state (loading, locale).' },
  { slice: 'me', authority: 'ephemeral', persistedToday: false, targetPersistence: 'none', accountScoped: false, migrationStatus: 'legacy', description: 'Current user account ID reference.' },

  // ── Ephemeral (transient UI state) ─────────────────────────────────────
  { slice: 'reports', authority: 'ephemeral', persistedToday: false, targetPersistence: 'none', accountScoped: true, migrationStatus: 'legacy', description: 'Report form state.' },
  { slice: 'mutes', authority: 'ephemeral', persistedToday: false, targetPersistence: 'none', accountScoped: true, migrationStatus: 'legacy', description: 'Mute form duration state.' },
  { slice: 'listEditor', authority: 'ephemeral', persistedToday: false, targetPersistence: 'none', accountScoped: true, migrationStatus: 'legacy', description: 'List editor form state.' },
  { slice: 'listAdder', authority: 'ephemeral', persistedToday: false, targetPersistence: 'none', accountScoped: true, migrationStatus: 'legacy', description: 'List adder modal state.' },
  { slice: 'group_editor', authority: 'ephemeral', persistedToday: false, targetPersistence: 'none', accountScoped: true, migrationStatus: 'legacy', description: 'Group editor form state.' },
  { slice: 'account_notes', authority: 'ephemeral', persistedToday: false, targetPersistence: 'none', accountScoped: true, migrationStatus: 'legacy', description: 'Personal notes on accounts.' },
  { slice: 'pending_statuses', authority: 'ephemeral', persistedToday: false, targetPersistence: 'none', accountScoped: true, migrationStatus: 'legacy', description: 'Optimistic pending status state.' },
  { slice: 'scheduled_statuses', authority: 'ephemeral', persistedToday: false, targetPersistence: 'none', accountScoped: true, migrationStatus: 'legacy', description: 'Scheduled posts.' },
  { slice: 'push_notifications', authority: 'ephemeral', persistedToday: false, targetPersistence: 'none', accountScoped: false, migrationStatus: 'legacy', description: 'Push notification subscription state.' },
  { slice: 'backups', authority: 'ephemeral', persistedToday: false, targetPersistence: 'none', accountScoped: true, migrationStatus: 'legacy', description: 'Account backup state.' },
  { slice: 'security', authority: 'ephemeral', persistedToday: false, targetPersistence: 'none', accountScoped: true, migrationStatus: 'legacy', description: 'MFA/security settings state.' },
  { slice: 'aliases', authority: 'ephemeral', persistedToday: false, targetPersistence: 'none', accountScoped: true, migrationStatus: 'legacy', description: 'Account alias state.' },
  { slice: 'verification', authority: 'ephemeral', persistedToday: false, targetPersistence: 'none', accountScoped: true, migrationStatus: 'legacy', description: 'Account verification state.' },
  { slice: 'patron', authority: 'ephemeral', persistedToday: false, targetPersistence: 'none', accountScoped: false, migrationStatus: 'legacy', description: 'Patron/funding state.' },
]) as ReadonlyArray<StateSlicePolicy>;

// ─── Policy queries ──────────────────────────────────────────────────────────

/** Get the policy for a specific slice. */
export function getSlicePolicy(slice: string): StateSlicePolicy | undefined {
  return STATE_INVENTORY.find(p => p.slice === slice);
}

/** Get all slices with a given authority. */
export function getSlicesByAuthority(authority: StateAuthority): ReadonlyArray<StateSlicePolicy> {
  return STATE_INVENTORY.filter(p => p.authority === authority);
}

/** Get all account-scoped slices (IDOR-relevant). */
export function getAccountScopedSlices(): ReadonlyArray<StateSlicePolicy> {
  return STATE_INVENTORY.filter(p => p.accountScoped);
}

/** Check if a slice should be cleared on account switch. */
export function shouldClearOnAccountSwitch(slice: string): boolean {
  const policy = getSlicePolicy(slice);
  if (!policy) return false;
  return policy.accountScoped && policy.authority !== 'durable';
}
