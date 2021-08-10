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
} from '../actions/timelines';
import {
  ACCOUNT_BLOCK_SUCCESS,
  ACCOUNT_MUTE_SUCCESS,
  ACCOUNT_UNFOLLOW_SUCCESS,
} from '../actions/accounts';
import {
  Map as ImmutableMap,
  List as ImmutableList,
  OrderedSet as ImmutableOrderedSet,
  fromJS,
} from 'immutable';
import { GROUP_REMOVE_STATUS_SUCCESS } from '../actions/groups';

const TRUNCATE_LIMIT = 40;
const TRUNCATE_SIZE  = 20;

const initialState = ImmutableMap();

const initialTimeline = ImmutableMap({
  unread: 0,
  online: false,
  top: true,
  isLoading: false,
  hasMore: true,
  items: ImmutableOrderedSet(),
  queuedItems: ImmutableOrderedSet(), //max= MAX_QUEUED_ITEMS
  totalQueuedItemsCount: 0, //used for queuedItems overflow for MAX_QUEUED_ITEMS+
});

const getStatusIds = (statuses = ImmutableList()) => (
  statuses.map(status => status.get('id')).toOrderedSet()
);

const mergeStatusIds = (oldIds = ImmutableOrderedSet(), newIds = ImmutableOrderedSet()) => (
  newIds.union(oldIds)
);

const addStatusId = (oldIds = ImmutableOrderedSet(), newId) => (
  mergeStatusIds(oldIds, ImmutableOrderedSet([newId]))
);

// Like `take`, but only if the collection's size exceeds truncateLimit
const truncate = (items, truncateLimit, newSize) => (
  items.size > truncateLimit ? items.take(newSize) : items
);

const truncateIds = items => truncate(items, TRUNCATE_LIMIT, TRUNCATE_SIZE);

const setLoading = (state, timelineId, loading) => {
  return state.update(timelineId, initialTimeline, timeline => timeline.set('isLoading', loading));
};

const expandNormalizedTimeline = (state, timelineId, statuses, next, isPartial, isLoadingRecent) => {
  const newIds = getStatusIds(statuses);

  return state.update(timelineId, initialTimeline, timeline => timeline.withMutations(timeline => {
    timeline.set('isLoading', false);
    timeline.set('isPartial', isPartial);

    if (!next && !isLoadingRecent) timeline.set('hasMore', false);

    // Pinned timelines can be replaced entirely
    if (timelineId.endsWith(':pinned')) {
      timeline.set('items', newIds);
      return;
    }

    if (!newIds.isEmpty()) {
      timeline.update('items', ImmutableOrderedSet(), oldIds => {
        if (newIds.first() > oldIds.first()) {
          return mergeStatusIds(oldIds, newIds);
        } else {
          return mergeStatusIds(newIds, oldIds);
        }
      });
    }
  }));
};

const updateTimeline = (state, timelineId, statusId) => {
  const top    = state.getIn([timelineId, 'top']);
  const oldIds = state.getIn([timelineId, 'items'], ImmutableOrderedSet());
  const unread = state.getIn([timelineId, 'unread'], 0);

  if (oldIds.includes(statusId)) return state;

  const newIds = addStatusId(oldIds, statusId);

  return state.update(timelineId, initialTimeline, timeline => timeline.withMutations(timeline => {
    if (top) {
      // For performance, truncate items if user is scrolled to the top
      timeline.set('items', truncateIds(newIds));
    } else {
      timeline.set('unread', unread + 1);
      timeline.set('items', newIds);
    }
  }));
};

const updateTimelineQueue = (state, timelineId, statusId) => {
  const queuedIds   = state.getIn([timelineId, 'queuedItems'], ImmutableOrderedSet());
  const listedIds   = state.getIn([timelineId, 'items'], ImmutableOrderedSet());
  const queuedCount = state.getIn([timelineId, 'totalQueuedItemsCount'], 0);

  if (queuedIds.includes(statusId)) return state;
  if (listedIds.includes(statusId)) return state;

  return state.update(timelineId, initialTimeline, timeline => timeline.withMutations(timeline => {
    timeline.set('totalQueuedItemsCount', queuedCount + 1);
    timeline.set('queuedItems', addStatusId(queuedIds, statusId).take(MAX_QUEUED_ITEMS));
  }));
};

const shouldDelete = (timelineId, excludeAccount) => {
  if (!excludeAccount) return true;
  if (timelineId === `account:${excludeAccount}`) return false;
  if (timelineId.startsWith(`account:${excludeAccount}:`)) return false;
  return true;
};

const deleteStatus = (state, statusId, accountId, references, excludeAccount = null) => {
  return state.withMutations(state => {
    state.keySeq().forEach(timelineId => {
      if (shouldDelete(timelineId, excludeAccount)) {
        state.updateIn([timelineId, 'items'], ids => ids.delete(statusId));
        state.updateIn([timelineId, 'queuedItems'], ids => ids.delete(statusId));
      }
    });

    // Remove reblogs of deleted status
    references.forEach(ref => {
      deleteStatus(state, ref[0], ref[1], [], excludeAccount);
    });
  });
};

const clearTimeline = (state, timelineId) => {
  return state.set(timelineId, initialTimeline);
};

const updateTop = (state, timelineId, top) => {
  return state.update(timelineId, initialTimeline, timeline => timeline.withMutations(timeline => {
    if (top) timeline.set('unread', 0);
    timeline.set('top', top);
  }));
};

const isReblogOf = (reblog, status) => reblog.get('reblog') === status.get('id');
const statusToReference = status => [status.get('id'), status.get('account')];

const buildReferencesTo = (statuses, status) => (
  statuses
    .filter(reblog => isReblogOf(reblog, status))
    .map(statusToReference)
);

const filterTimeline = (state, timelineId, relationship, statuses) =>
  state.updateIn([timelineId, 'items'], ImmutableOrderedSet(), ids =>
    ids.filterNot(statusId =>
      statuses.getIn([statusId, 'account']) === relationship.id,
    ));

const filterTimelines = (state, relationship, statuses) => {
  return state.withMutations(state => {
    statuses.forEach(status => {
      if (status.get('account') !== relationship.id) return;
      const references = buildReferencesTo(statuses, status);
      deleteStatus(state, status.get('id'), status.get('account'), references, relationship.id);
    });
  });
};

const removeStatusFromGroup = (state, groupId, statusId) => {
  return state.updateIn([`group:${groupId}`, 'items'], ImmutableOrderedSet(), ids => ids.delete(statusId));
};

const timelineDequeue = (state, timelineId) => {
  const top = state.getIn([timelineId, 'top']);

  return state.update(timelineId, initialTimeline, timeline => timeline.withMutations(timeline => {
    const queuedIds = timeline.get('queuedItems');

    timeline.update('items', ids => {
      const newIds = mergeStatusIds(ids, queuedIds);
      return top ? truncateIds(newIds) : newIds;
    });

    timeline.set('queuedItems', ImmutableOrderedSet());
    timeline.set('totalQueuedItemsCount', 0);
  }));
};

const timelineConnect = (state, timelineId) => {
  return state.update(timelineId, initialTimeline, timeline => timeline.set('online', true));
};

const timelineDisconnect = (state, timelineId) => {
  return state.update(timelineId, initialTimeline, timeline => timeline.withMutations(timeline => {
    timeline.set('online', false);

    const items = timeline.get('items', ImmutableOrderedSet());
    if (items.isEmpty()) return;

    // This is causing problems. Disable for now.
    // https://gitlab.com/soapbox-pub/soapbox-fe/-/issues/716
    // timeline.set('items', addStatusId(items, null));
  }));
};

export default function timelines(state = initialState, action) {
  switch(action.type) {
  case TIMELINE_EXPAND_REQUEST:
    return setLoading(state, action.timeline, true);
  case TIMELINE_EXPAND_FAIL:
    return setLoading(state, action.timeline, false);
  case TIMELINE_EXPAND_SUCCESS:
    return expandNormalizedTimeline(state, action.timeline, fromJS(action.statuses), action.next, action.partial, action.isLoadingRecent);
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
  default:
    return state;
  }
}
