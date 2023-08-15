import {
  Map as ImmutableMap,
  List as ImmutableList,
  OrderedSet as ImmutableOrderedSet,
  Record as ImmutableRecord,
  fromJS,
} from 'immutable';
import sample from 'lodash/sample';

import {
  ACCOUNT_BLOCK_SUCCESS,
  ACCOUNT_MUTE_SUCCESS,
  ACCOUNT_UNFOLLOW_SUCCESS,
} from '../actions/accounts';
import { GROUP_REMOVE_STATUS_SUCCESS } from '../actions/groups';
import {
  STATUS_CREATE_REQUEST,
  STATUS_CREATE_SUCCESS,
} from '../actions/statuses';
import {
  TIMELINE_UPDATE,
  TIMELINE_DELETE,
  TIMELINE_CLEAR,
  TIMELINE_EXPAND_SUCCESS,
  TIMELINE_EXPAND_REQUEST,
  TIMELINE_EXPAND_FAIL,
  TIMELINE_CONNECT,
  TIMELINE_DISCONNECT,
  TIMELINE_UPDATE_QUEUE,
  TIMELINE_DEQUEUE,
  MAX_QUEUED_ITEMS,
  TIMELINE_SCROLL_TOP,
  TIMELINE_REPLACE,
  TIMELINE_INSERT,
  TIMELINE_CLEAR_FEED_ACCOUNT_ID,
} from '../actions/timelines';

import type { AnyAction } from 'redux';
import type { StatusVisibility } from 'soapbox/normalizers/status';
import type { APIEntity, Status } from 'soapbox/types/entities';

const TRUNCATE_LIMIT = 40;
const TRUNCATE_SIZE = 20;

const TimelineRecord = ImmutableRecord({
  unread: 0,
  online: false,
  top: true,
  isLoading: false,
  hasMore: true,
  items: ImmutableOrderedSet<string>(),
  queuedItems: ImmutableOrderedSet<string>(), //max= MAX_QUEUED_ITEMS
  feedAccountId: null,
  totalQueuedItemsCount: 0, //used for queuedItems overflow for MAX_QUEUED_ITEMS+
  loadingFailed: false,
  isPartial: false,
});

const initialState = ImmutableMap<string, Timeline>();

type State = ImmutableMap<string, Timeline>;
type Timeline = ReturnType<typeof TimelineRecord>;

const getStatusIds = (statuses: ImmutableList<ImmutableMap<string, any>> = ImmutableList()) => (
  statuses.map(status => status.get('id')).toOrderedSet()
);

const mergeStatusIds = (oldIds = ImmutableOrderedSet<string>(), newIds = ImmutableOrderedSet<string>()) => (
  newIds.union(oldIds)
);

const addStatusId = (oldIds = ImmutableOrderedSet<string>(), newId: string) => (
  mergeStatusIds(oldIds, ImmutableOrderedSet([newId]))
);

// Like `take`, but only if the collection's size exceeds truncateLimit
const truncate = (items: ImmutableOrderedSet<string>, truncateLimit: number, newSize: number) => (
  items.size > truncateLimit ? items.take(newSize) : items
);

const truncateIds = (items: ImmutableOrderedSet<string>) => truncate(items, TRUNCATE_LIMIT, TRUNCATE_SIZE);

const setLoading = (state: State, timelineId: string, loading: boolean) => {
  return state.update(timelineId, TimelineRecord(), timeline => timeline.set('isLoading', loading));
};

// Keep track of when a timeline failed to load
const setFailed = (state: State, timelineId: string, failed: boolean) => {
  return state.update(timelineId, TimelineRecord(), timeline => timeline.set('loadingFailed', failed));
};

const expandNormalizedTimeline = (state: State, timelineId: string, statuses: ImmutableList<ImmutableMap<string, any>>, next: string | null, isPartial: boolean, isLoadingRecent: boolean, isLoadingMore: boolean) => {
  let newIds = getStatusIds(statuses);
  let unseens = ImmutableOrderedSet<any>();

  return state.withMutations((s) => {
    s.update(timelineId, TimelineRecord(), timeline => timeline.withMutations(timeline => {
      timeline.set('isLoading', false);
      timeline.set('loadingFailed', false);
      timeline.set('isPartial', isPartial);

      if (!next && !isLoadingRecent) timeline.set('hasMore', false);

      // Pinned timelines can be replaced entirely
      if (timelineId.endsWith(':pinned')) {
        timeline.set('items', newIds);
        return;
      }

      if (!newIds.isEmpty()) {
        // we need to sort between queue and actual list to avoid
        // messing with user position in the timeline by inserting inseen statuses
        unseens = ImmutableOrderedSet<any>();
        if (!isLoadingMore
          && timeline.items.count() > 0
          && newIds.first() > timeline.items.first()
        ) {
          unseens = newIds.subtract(timeline.items);
        }

        newIds = newIds.subtract(unseens);
        timeline.update('items', oldIds => {
          if (newIds.first() > oldIds.first()!) {
            return mergeStatusIds(oldIds, newIds);
          } else {
            return mergeStatusIds(newIds, oldIds);
          }
        });
      }
    }));
    unseens.forEach((statusId) => s.set(timelineId, updateTimelineQueue(s, timelineId, statusId).get(timelineId)));
  });
};

const updateTimeline = (state: State, timelineId: string, statusId: string) => {
  const top = state.get(timelineId)?.top;
  const oldIds = state.get(timelineId)?.items || ImmutableOrderedSet<string>();
  const unread = state.get(timelineId)?.unread || 0;

  if (oldIds.includes(statusId)) return state;

  const newIds = addStatusId(oldIds, statusId);

  return state.update(timelineId, TimelineRecord(), timeline => timeline.withMutations(timeline => {
    if (top) {
      // For performance, truncate items if user is scrolled to the top
      timeline.set('items', truncateIds(newIds));
    } else {
      timeline.set('unread', unread + 1);
      timeline.set('items', newIds);
    }
  }));
};

const updateTimelineQueue = (state: State, timelineId: string, statusId: string) => {
  const queuedIds = state.get(timelineId)?.queuedItems || ImmutableOrderedSet<string>();
  const listedIds = state.get(timelineId)?.items || ImmutableOrderedSet<string>();
  const queuedCount = state.get(timelineId)?.totalQueuedItemsCount || 0;

  if (queuedIds.includes(statusId)) return state;
  if (listedIds.includes(statusId)) return state;

  return state.update(timelineId, TimelineRecord(), timeline => timeline.withMutations(timeline => {
    timeline.set('totalQueuedItemsCount', queuedCount + 1);
    timeline.set('queuedItems', addStatusId(queuedIds, statusId).take(MAX_QUEUED_ITEMS));
  }));
};

const shouldDelete = (timelineId: string, excludeAccount?: string) => {
  if (!excludeAccount) return true;
  if (timelineId === `account:${excludeAccount}`) return false;
  if (timelineId.startsWith(`account:${excludeAccount}:`)) return false;
  return true;
};

const deleteStatus = (state: State, statusId: string, accountId: string, references: ImmutableMap<string, [string, string]> | Array<[string, string]>, excludeAccount?: string) => {
  return state.withMutations(state => {
    state.keySeq().forEach(timelineId => {
      if (shouldDelete(timelineId, excludeAccount)) {
        state.updateIn([timelineId, 'items'], ids => (ids as ImmutableOrderedSet<string>).delete(statusId));
        state.updateIn([timelineId, 'queuedItems'], ids => (ids as ImmutableOrderedSet<string>).delete(statusId));
      }
    });

    // Remove reblogs of deleted status
    references.forEach(ref => {
      deleteStatus(state, ref[0], ref[1], [], excludeAccount);
    });
  });
};

const clearTimeline = (state: State, timelineId: string) => {
  return state.set(timelineId, TimelineRecord());
};

const updateTop = (state: State, timelineId: string, top: boolean) => {
  return state.update(timelineId, TimelineRecord(), timeline => timeline.withMutations(timeline => {
    if (top) timeline.set('unread', 0);
    timeline.set('top', top);
  }));
};

const isReblogOf = (reblog: Status, status: Status) => reblog.reblog === status.id;
const statusToReference = (status: Status) => [status.id, status.account];

const buildReferencesTo = (statuses: ImmutableMap<string, Status>, status: Status) => (
  statuses
    .filter(reblog => isReblogOf(reblog, status))
    .map(statusToReference) as ImmutableMap<string, [string, string]>
);

const filterTimeline = (state: State, timelineId: string, relationship: APIEntity, statuses: ImmutableList<ImmutableMap<string, any>>) =>
  state.updateIn([timelineId, 'items'], ImmutableOrderedSet(), (ids) =>
    (ids as ImmutableOrderedSet<string>).filterNot(statusId =>
      statuses.getIn([statusId, 'account']) === relationship.id,
    ));

const filterTimelines = (state: State, relationship: APIEntity, statuses: ImmutableMap<string, Status>) => {
  return state.withMutations(state => {
    statuses.forEach(status => {
      if (status.get('account') !== relationship.id) return;
      const references = buildReferencesTo(statuses, status);
      deleteStatus(state, status.get('id'), status.get('account') as string, references, relationship.id);
    });
  });
};

const removeStatusFromGroup = (state: State, groupId: string, statusId: string) => {
  return state.updateIn([`group:${groupId}`, 'items'], ImmutableOrderedSet(), ids => (ids as ImmutableOrderedSet<string>).delete(statusId));
};

const timelineDequeue = (state: State, timelineId: string) => {
  const top = state.getIn([timelineId, 'top']);

  return state.update(timelineId, TimelineRecord(), timeline => timeline.withMutations((timeline: Timeline) => {
    const queuedIds = timeline.queuedItems;

    timeline.update('items', ids => {
      const newIds = mergeStatusIds(ids, queuedIds);
      return top ? truncateIds(newIds) : newIds;
    });

    timeline.set('queuedItems', ImmutableOrderedSet());
    timeline.set('totalQueuedItemsCount', 0);
  }));
};

const timelineConnect = (state: State, timelineId: string) => {
  return state.update(timelineId, TimelineRecord(), timeline => timeline.set('online', true));
};

const timelineDisconnect = (state: State, timelineId: string) => {
  return state.update(timelineId, TimelineRecord(), timeline => timeline.withMutations(timeline => {
    timeline.set('online', false);

    const items = timeline.get('items', ImmutableOrderedSet());
    if (items.isEmpty()) return;

    // This is causing problems. Disable for now.
    // https://gitlab.com/soapbox-pub/soapbox-fe/-/issues/716
    // timeline.set('items', addStatusId(items, null));
  }));
};

const getTimelinesByVisibility = (visibility: StatusVisibility) => {
  switch (visibility) {
    case 'direct':
      return ['direct'];
    case 'public':
      return ['home', 'community', 'public'];
    default:
      return ['home'];
  }
};

// Given an OrderedSet of IDs, replace oldId with newId maintaining its position
const replaceId = (ids: ImmutableOrderedSet<string>, oldId: string, newId: string) => {
  const list = ImmutableList(ids);
  const index = list.indexOf(oldId);

  if (index > -1) {
    return ImmutableOrderedSet(list.set(index, newId));
  } else {
    return ids;
  }
};

const importPendingStatus = (state: State, params: APIEntity, idempotencyKey: string) => {
  const statusId = `末pending-${idempotencyKey}`;

  return state.withMutations(state => {
    const timelineIds = getTimelinesByVisibility(params.visibility);

    timelineIds.forEach(timelineId => {
      updateTimelineQueue(state, timelineId, statusId);
    });
  });
};

const replacePendingStatus = (state: State, idempotencyKey: string, newId: string) => {
  const oldId = `末pending-${idempotencyKey}`;

  // Loop through timelines and replace the pending status with the real one
  return state.withMutations(state => {
    state.keySeq().forEach(timelineId => {
      state.updateIn([timelineId, 'items'], ids => replaceId((ids as ImmutableOrderedSet<string>), oldId, newId));
      state.updateIn([timelineId, 'queuedItems'], ids => replaceId((ids as ImmutableOrderedSet<string>), oldId, newId));
    });
  });
};

const importStatus = (state: State, status: APIEntity, idempotencyKey: string) => {
  return state.withMutations(state => {
    replacePendingStatus(state, idempotencyKey, status.id);

    const timelineIds = getTimelinesByVisibility(status.visibility);

    timelineIds.forEach(timelineId => {
      updateTimeline(state, timelineId, status.id);
    });
  });
};

const handleExpandFail = (state: State, timelineId: string) => {
  return state.withMutations(state => {
    setLoading(state, timelineId, false);
    setFailed(state, timelineId, true);
  });
};

export default function timelines(state: State = initialState, action: AnyAction) {
  switch (action.type) {
    case STATUS_CREATE_REQUEST:
      if (action.params.scheduled_at) return state;
      return importPendingStatus(state, action.params, action.idempotencyKey);
    case STATUS_CREATE_SUCCESS:
      if (action.status.scheduled_at) return state;
      return importStatus(state, action.status, action.idempotencyKey);
    case TIMELINE_EXPAND_REQUEST:
      return setLoading(state, action.timeline, true);
    case TIMELINE_EXPAND_FAIL:
      return handleExpandFail(state, action.timeline);
    case TIMELINE_EXPAND_SUCCESS:
      return expandNormalizedTimeline(state, action.timeline, fromJS(action.statuses) as ImmutableList<ImmutableMap<string, any>>, action.next, action.partial, action.isLoadingRecent, action.isLoadingMore);
    case TIMELINE_UPDATE:
      return updateTimeline(state, action.timeline, action.statusId);
    case TIMELINE_UPDATE_QUEUE:
      return updateTimelineQueue(state, action.timeline, action.statusId);
    case TIMELINE_DEQUEUE:
      return timelineDequeue(state, action.timeline);
    case TIMELINE_DELETE:
      return deleteStatus(state, action.id, action.accountId, action.references, action.reblogOf);
    case TIMELINE_CLEAR:
      return clearTimeline(state, action.timeline);
    case ACCOUNT_BLOCK_SUCCESS:
    case ACCOUNT_MUTE_SUCCESS:
      return filterTimelines(state, action.relationship, action.statuses);
    case ACCOUNT_UNFOLLOW_SUCCESS:
      return filterTimeline(state, 'home', action.relationship, action.statuses);
    case TIMELINE_SCROLL_TOP:
      return updateTop(state, action.timeline, action.top);
    case TIMELINE_CONNECT:
      return timelineConnect(state, action.timeline);
    case TIMELINE_DISCONNECT:
      return timelineDisconnect(state, action.timeline);
    case GROUP_REMOVE_STATUS_SUCCESS:
      return removeStatusFromGroup(state, action.groupId, action.id);
    case TIMELINE_REPLACE:
      return state
        .update('home', TimelineRecord(), timeline => timeline.withMutations(timeline => {
          timeline.set('items', ImmutableOrderedSet([]));
        }))
        .update('home', TimelineRecord(), timeline => timeline.set('feedAccountId', action.accountId));
    case TIMELINE_INSERT:
      return state.update(action.timeline, TimelineRecord(), timeline => timeline.withMutations(timeline => {
        timeline.update('items', oldIds => {

          let oldIdsArray = oldIds.toArray();
          const existingSuggestionId = oldIdsArray.find(key => key.includes('末suggestions'));

          if (existingSuggestionId) {
            oldIdsArray = oldIdsArray.slice(1);
          }
          const positionInTimeline = sample([5, 6, 7, 8, 9]) as number;
          oldIdsArray.splice(positionInTimeline, 0, `末suggestions-${oldIds.last()}`);
          return ImmutableOrderedSet(oldIdsArray);
        });
      }));
    case TIMELINE_CLEAR_FEED_ACCOUNT_ID:
      return state.update('home', TimelineRecord(), timeline => timeline.set('feedAccountId', null));
    default:
      return state;
  }
}
