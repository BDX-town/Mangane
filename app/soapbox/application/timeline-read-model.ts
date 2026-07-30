/**
 * Phase 7 — Feed-neutral timeline read model.
 *
 * Provides a stable, transport-agnostic interface for reading timeline data.
 * Presentation code imports from this module instead of directly accessing
 * Redux selectors, Dexie queries, or API responses.
 *
 * This is the application boundary that Phase 8+ presentation code will
 * consume. It hides:
 * - Whether data comes from Redux (legacy) or IndexedDB (Phase 5)
 * - Whether data was fetched via REST, WebSocket, or local cache
 * - Immutable.js internals (ImmutableOrderedSet, ImmutableMap)
 * - Entity normalization details (status.account = ID vs object)
 *
 * The read model returns plain TypeScript objects/arrays only.
 * No Immutable.js types leak through this boundary.
 *
 * Security:
 * - Account scope validation on all queries
 * - No credential/token data flows through this layer
 * - Content is read-only; mutations go through the outbox
 */

// ─── Read model types (plain TS, no Immutable.js) ────────────────────────────

export interface TimelineItem {
  /** Status ID */
  readonly id: string;
  /** Whether this is a reblog (boosted status) */
  readonly isReblog: boolean;
  /** Original status ID if reblog, same as id otherwise */
  readonly originalId: string;
}

export interface TimelineState {
  /** Ordered list of timeline items (newest first) */
  readonly items: ReadonlyArray<TimelineItem>;
  /** Whether more items can be loaded (pagination) */
  readonly hasMore: boolean;
  /** Whether a fetch is currently in progress */
  readonly isLoading: boolean;
  /** Whether the timeline is connected to streaming */
  readonly isOnline: boolean;
  /** Number of queued items not yet displayed */
  readonly queuedCount: number;
  /** Whether the initial load has failed */
  readonly hasFailed: boolean;
}

export interface StatusView {
  readonly id: string;
  readonly content: string;
  readonly createdAt: string;
  readonly visibility: string;
  readonly sensitive: boolean;
  readonly spoilerText: string;
  readonly favourited: boolean;
  readonly reblogged: boolean;
  readonly bookmarked: boolean;
  readonly pinned: boolean;
  readonly repliesCount: number;
  readonly reblogsCount: number;
  readonly favouritesCount: number;
  readonly inReplyToId: string | null;
  readonly account: AccountView | null;
  readonly reblog: StatusView | null;
  readonly mediaAttachments: ReadonlyArray<MediaView>;
  readonly poll: PollView | null;
  readonly language: string | null;
  readonly url: string;
}

export interface AccountView {
  readonly id: string;
  readonly username: string;
  readonly acct: string;
  readonly displayName: string;
  readonly avatar: string;
  readonly url: string;
  readonly verified: boolean;
  readonly bot: boolean;
}

export interface MediaView {
  readonly id: string;
  readonly type: 'image' | 'video' | 'gifv' | 'audio' | 'unknown';
  readonly url: string;
  readonly previewUrl: string;
  readonly description: string | null;
  readonly blurhash: string | null;
}

export interface PollView {
  readonly id: string;
  readonly expiresAt: string | null;
  readonly expired: boolean;
  readonly multiple: boolean;
  readonly votesCount: number;
  readonly votersCount: number | null;
  readonly voted: boolean;
  readonly ownVotes: ReadonlyArray<number>;
  readonly options: ReadonlyArray<PollOptionView>;
}

export interface PollOptionView {
  readonly title: string;
  readonly votesCount: number;
}

// ─── Empty state constants ───────────────────────────────────────────────────

export const EMPTY_TIMELINE: TimelineState = Object.freeze({
  items: Object.freeze([]),
  hasMore: true,
  isLoading: false,
  isOnline: false,
  queuedCount: 0,
  hasFailed: false,
});

// ─── Timeline identifiers ────────────────────────────────────────────────────

/**
 * Canonical timeline identifiers used throughout the application.
 * This decouples presentation from the Redux slice key format.
 */
export type CanonicalTimelineId =
  | 'home'
  | 'public'
  | 'public:local'
  | 'notifications'
  | `list:${string}`
  | `hashtag:${string}`
  | `account:${string}`
  | `account:${string}:media`
  | `account:${string}:with_replies`;

/**
 * Convert a canonical timeline ID to the Redux key.
 * This is the ONLY place that knows the Redux key format.
 */
export function toReduxTimelineKey(id: CanonicalTimelineId): string {
  // Currently 1:1 mapping, but this indirection allows future changes
  return id;
}
