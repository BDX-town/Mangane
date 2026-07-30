/**
 * Phase 7 — Timeline query layer.
 *
 * Implements the timeline read model by adapting from the legacy Redux state.
 * This is the concrete implementation that presentation code gets via hooks.
 *
 * Architecture boundary:
 * - This file MAY import from Redux selectors and the legacy store
 * - Presentation code MUST NOT import from Redux/selectors directly
 * - This file MUST NOT export Immutable.js types
 * - All return types are plain TypeScript (from timeline-read-model.ts)
 *
 * When Phase 5 IndexedDB becomes the primary store for a given data type,
 * this file is where the switch happens — presentation code doesn't change.
 */

import { EMPTY_TIMELINE, toReduxTimelineKey } from './timeline-read-model';

import type {
  AccountView,
  CanonicalTimelineId,
  MediaView,
  PollView,
  StatusView,
  TimelineItem,
  TimelineState,
} from './timeline-read-model';
import type { RootState } from 'soapbox/store';

// ─── Timeline state query ────────────────────────────────────────────────────

/**
 * Read timeline state from the Redux store.
 * Returns a plain-object TimelineState (no Immutable.js leakage).
 */
export function queryTimeline(state: RootState, timelineId: CanonicalTimelineId): TimelineState {
  const key = toReduxTimelineKey(timelineId);
  const timeline = state.timelines.get(key);
  if (!timeline) return EMPTY_TIMELINE;

  const items: TimelineItem[] = [];
  const statusIds = timeline.get('items');
  if (statusIds) {
    statusIds.forEach((id: string) => {
      const status = state.statuses.get(id);
      if (!status) return;
      items.push({
        id,
        isReblog: !!status.reblog,
        originalId: status.reblog || id,
      });
    });
  }

  return {
    items,
    hasMore: timeline.get('hasMore', true),
    isLoading: timeline.get('isLoading', false),
    isOnline: timeline.get('online', false),
    queuedCount: timeline.get('totalQueuedItemsCount', 0),
    hasFailed: timeline.get('loadingFailed', false),
  };
}

// ─── Entity queries ──────────────────────────────────────────────────────────

/**
 * Read a status from the Redux store as a plain view object.
 * Denormalizes relationships (account, reblog) inline.
 */
export function queryStatus(state: RootState, statusId: string): StatusView | null {
  const status = state.statuses.get(statusId);
  if (!status) return null;

  const accountId = status.account;
  const account = typeof accountId === 'string' ? queryAccount(state, accountId) : null;

  let reblog: StatusView | null = null;
  if (status.reblog) {
    reblog = queryStatus(state, status.reblog);
  }

  const mediaAttachments: MediaView[] = [];
  const mediaList = status.media_attachments;
  if (mediaList) {
    const arr = typeof mediaList.toArray === 'function' ? mediaList.toArray() : (mediaList as any);
    for (const m of arr) {
      const get = typeof m.get === 'function' ? (k: string) => m.get(k) : (k: string) => (m as any)[k];
      mediaAttachments.push({
        id: String(get('id') ?? ''),
        type: String(get('type') ?? 'unknown') as MediaView['type'],
        url: String(get('url') ?? ''),
        previewUrl: String(get('preview_url') ?? get('previewUrl') ?? ''),
        description: get('description') ?? null,
        blurhash: get('blurhash') ?? null,
      });
    }
  }

  let poll: PollView | null = null;
  if (status.poll) {
    const pollData: any = state.polls?.get(status.poll);
    if (pollData) {
      const pGet = typeof pollData.get === 'function' ? (k: string) => pollData.get(k) : (k: string) => pollData[k];
      const ownVotesRaw = pGet('own_votes');
      let ownVotes: number[] = [];
      if (ownVotesRaw) {
        ownVotes = typeof ownVotesRaw.toJS === 'function' ? ownVotesRaw.toJS() : Array.from(ownVotesRaw);
      }
      const optionsRaw = pGet('options');
      let optionsArr: any[] = [];
      if (optionsRaw) {
        optionsArr = typeof optionsRaw.toJS === 'function' ? optionsRaw.toJS() : Array.from(optionsRaw);
      }
      poll = {
        id: String(pGet('id')),
        expiresAt: pGet('expires_at') || null,
        expired: Boolean(pGet('expired')),
        multiple: Boolean(pGet('multiple')),
        votesCount: Number(pGet('votes_count') || 0),
        votersCount: pGet('voters_count') ?? null,
        voted: Boolean(pGet('voted')),
        ownVotes,
        options: optionsArr.map((o: any) => ({
          title: String(o.title ?? o.get?.('title') ?? ''),
          votesCount: Number(o.votes_count ?? o.get?.('votes_count') ?? 0),
        })),
      };
    }
  }

  return {
    id: statusId,
    content: String(status.contentHtml || status.content || ''),
    createdAt: String(status.created_at || ''),
    visibility: String(status.visibility || 'public'),
    sensitive: Boolean(status.sensitive),
    spoilerText: String(status.spoiler_text || ''),
    favourited: Boolean(status.favourited),
    reblogged: Boolean(status.reblogged),
    bookmarked: Boolean(status.bookmarked),
    pinned: Boolean(status.pinned),
    repliesCount: Number(status.replies_count || 0),
    reblogsCount: Number(status.reblogs_count || 0),
    favouritesCount: Number(status.favourites_count || 0),
    inReplyToId: status.in_reply_to_id || null,
    account,
    reblog,
    mediaAttachments,
    poll,
    language: status.language || null,
    url: String(status.url || status.uri || ''),
  };
}

/**
 * Read an account from the Redux store as a plain view object.
 */
export function queryAccount(state: RootState, accountId: string): AccountView | null {
  const account = state.accounts.get(accountId);
  if (!account) return null;

  return {
    id: accountId,
    username: String(account.username || ''),
    acct: String(account.acct || ''),
    displayName: String(account.display_name || ''),
    avatar: String(account.avatar || ''),
    url: String(account.url || ''),
    verified: Boolean(account.verified),
    bot: Boolean(account.bot),
  };
}
