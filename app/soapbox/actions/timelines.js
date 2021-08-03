import { importFetchedStatus, importFetchedStatuses } from './importer';
import api, { getLinks } from '../api';
import { Map as ImmutableMap, OrderedSet as ImmutableOrderedSet, fromJS } from 'immutable';
import { getSettings } from 'soapbox/actions/settings';
import { shouldFilter } from 'soapbox/utils/timelines';

export const TIMELINE_UPDATE  = 'TIMELINE_UPDATE';
export const TIMELINE_DELETE  = 'TIMELINE_DELETE';
export const TIMELINE_CLEAR   = 'TIMELINE_CLEAR';
export const TIMELINE_UPDATE_QUEUE = 'TIMELINE_UPDATE_QUEUE';
export const TIMELINE_DEQUEUE = 'TIMELINE_DEQUEUE';
export const TIMELINE_SCROLL_TOP = 'TIMELINE_SCROLL_TOP';

export const TIMELINE_EXPAND_REQUEST = 'TIMELINE_EXPAND_REQUEST';
export const TIMELINE_EXPAND_SUCCESS = 'TIMELINE_EXPAND_SUCCESS';
export const TIMELINE_EXPAND_FAIL    = 'TIMELINE_EXPAND_FAIL';

export const TIMELINE_CONNECT    = 'TIMELINE_CONNECT';
export const TIMELINE_DISCONNECT = 'TIMELINE_DISCONNECT';

export const MAX_QUEUED_ITEMS = 40;

export function processTimelineUpdate(timeline, status, accept) {
  return (dispatch, getState) => {
    const columnSettings = getSettings(getState()).get(timeline, ImmutableMap());
    const shouldSkipQueue = shouldFilter(fromJS(status), columnSettings);

    dispatch(importFetchedStatus(status));

    if (shouldSkipQueue) {
      return dispatch(updateTimeline(timeline, status.id, accept));
    } else {
      return dispatch(updateTimelineQueue(timeline, status.id, accept));
    }
  };
}

export function updateTimeline(timeline, statusId, accept) {
  return dispatch => {
    if (typeof accept === 'function' && !accept(status)) {
      return;
    }

    dispatch({
      type: TIMELINE_UPDATE,
      timeline,
      statusId,
    });
  };
}

export function updateTimelineQueue(timeline, statusId, accept) {
  return dispatch => {
    if (typeof accept === 'function' && !accept(status)) {
      return;
    }

    dispatch({
      type: TIMELINE_UPDATE_QUEUE,
      timeline,
      statusId,
    });
  };
}

export function dequeueTimeline(timelineId, expandFunc, optionalExpandArgs) {
  return (dispatch, getState) => {
    const state = getState();
    const queuedCount = state.getIn(['timelines', timelineId, 'totalQueuedItemsCount'], 0);

    if (queuedCount <= 0) return;

    if (queuedCount <= MAX_QUEUED_ITEMS) {
      dispatch({ type: TIMELINE_DEQUEUE, timeline: timelineId });
      return;
    }

    if (typeof expandFunc === 'function') {
      dispatch(clearTimeline(timelineId));
      expandFunc();
    } else {
      if (timelineId === 'home') {
        dispatch(clearTimeline(timelineId));
        dispatch(expandHomeTimeline(optionalExpandArgs));
      } else if (timelineId === 'community') {
        dispatch(clearTimeline(timelineId));
        dispatch(expandCommunityTimeline(optionalExpandArgs));
      }
    }
  };
}

export function deleteFromTimelines(id) {
  return (dispatch, getState) => {
    const accountId  = getState().getIn(['statuses', id, 'account']);
    const references = getState().get('statuses').filter(status => status.get('reblog') === id).map(status => [status.get('id'), status.get('account')]);
    const reblogOf   = getState().getIn(['statuses', id, 'reblog'], null);

    dispatch({
      type: TIMELINE_DELETE,
      id,
      accountId,
      references,
      reblogOf,
    });
  };
}

export function clearTimeline(timeline) {
  return (dispatch) => {
    dispatch({ type: TIMELINE_CLEAR, timeline });
  };
}

const noOp = () => {};

const parseTags = (tags = {}, mode) => {
  return (tags[mode] || []).map((tag) => {
    return tag.value;
  });
};

export function expandTimeline(timelineId, path, params = {}, done = noOp) {
  return (dispatch, getState) => {
    const timeline = getState().getIn(['timelines', timelineId], ImmutableMap());
    const isLoadingMore = !!params.max_id;

    if (timeline.get('isLoading')) {
      done();
      return;
    }

    if (!params.max_id && !params.pinned && timeline.get('items', ImmutableOrderedSet()).size > 0) {
      params.since_id = timeline.getIn(['items', 0]);
    }

    const isLoadingRecent = !!params.since_id;

    dispatch(expandTimelineRequest(timelineId, isLoadingMore));

    api(getState).get(path, { params }).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');
      dispatch(importFetchedStatuses(response.data));
      dispatch(expandTimelineSuccess(timelineId, response.data, next ? next.uri : null, response.code === 206, isLoadingRecent, isLoadingMore));
      done();
    }).catch(error => {
      dispatch(expandTimelineFail(timelineId, error, isLoadingMore));
      done();
    });
  };
}

export const expandHomeTimeline            = ({ maxId } = {}, done = noOp) => expandTimeline('home', '/api/v1/timelines/home', { max_id: maxId }, done);

export const expandPublicTimeline          = ({ maxId, onlyMedia } = {}, done = noOp) => expandTimeline(`public${onlyMedia ? ':media' : ''}`, '/api/v1/timelines/public', { max_id: maxId, only_media: !!onlyMedia }, done);

export const expandRemoteTimeline          = (instance, { maxId, onlyMedia } = {}, done = noOp) => expandTimeline(`remote${onlyMedia ? ':media' : ''}:${instance}`, '/api/v1/timelines/public', { local: false, instance: instance, max_id: maxId, only_media: !!onlyMedia }, done);

export const expandCommunityTimeline       = ({ maxId, onlyMedia } = {}, done = noOp) => expandTimeline(`community${onlyMedia ? ':media' : ''}`, '/api/v1/timelines/public', { local: true, max_id: maxId, only_media: !!onlyMedia }, done);

export const expandDirectTimeline          = ({ maxId } = {}, done = noOp) => expandTimeline('direct', '/api/v1/timelines/direct', { max_id: maxId }, done);

export const expandAccountTimeline         = (accountId, { maxId, withReplies } = {}) => expandTimeline(`account:${accountId}${withReplies ? ':with_replies' : ''}`, `/api/v1/accounts/${accountId}/statuses`, { exclude_replies: !withReplies, max_id: maxId, with_muted: true });

export const expandAccountFeaturedTimeline = accountId => expandTimeline(`account:${accountId}:pinned`, `/api/v1/accounts/${accountId}/statuses`, { pinned: true, with_muted: true });

export const expandAccountMediaTimeline    = (accountId, { maxId } = {}) => expandTimeline(`account:${accountId}:media`, `/api/v1/accounts/${accountId}/statuses`, { max_id: maxId, only_media: true, limit: 40, with_muted: true });

export const expandListTimeline            = (id, { maxId } = {}, done = noOp) => expandTimeline(`list:${id}`, `/api/v1/timelines/list/${id}`, { max_id: maxId }, done);

export const expandGroupTimeline           = (id, { maxId } = {}, done = noOp) => expandTimeline(`group:${id}`, `/api/v1/timelines/group/${id}`, { max_id: maxId }, done);

export const expandHashtagTimeline         = (hashtag, { maxId, tags } = {}, done = noOp) => {
  return expandTimeline(`hashtag:${hashtag}`, `/api/v1/timelines/tag/${hashtag}`, {
    max_id: maxId,
    any:    parseTags(tags, 'any'),
    all:    parseTags(tags, 'all'),
    none:   parseTags(tags, 'none'),
  }, done);
};

export function expandTimelineRequest(timeline, isLoadingMore) {
  return {
    type: TIMELINE_EXPAND_REQUEST,
    timeline,
    skipLoading: !isLoadingMore,
  };
}

export function expandTimelineSuccess(timeline, statuses, next, partial, isLoadingRecent, isLoadingMore) {
  return {
    type: TIMELINE_EXPAND_SUCCESS,
    timeline,
    statuses,
    next,
    partial,
    isLoadingRecent,
    skipLoading: !isLoadingMore,
  };
}

export function expandTimelineFail(timeline, error, isLoadingMore) {
  return {
    type: TIMELINE_EXPAND_FAIL,
    timeline,
    error,
    skipLoading: !isLoadingMore,
  };
}

export function connectTimeline(timeline) {
  return {
    type: TIMELINE_CONNECT,
    timeline,
  };
}

export function disconnectTimeline(timeline) {
  return {
    type: TIMELINE_DISCONNECT,
    timeline,
  };
}

export function scrollTopTimeline(timeline, top) {
  return {
    type: TIMELINE_SCROLL_TOP,
    timeline,
    top,
  };
}
