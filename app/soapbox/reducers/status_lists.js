import {
  FAVOURITED_STATUSES_FETCH_REQUEST,
  FAVOURITED_STATUSES_FETCH_SUCCESS,
  FAVOURITED_STATUSES_FETCH_FAIL,
  FAVOURITED_STATUSES_EXPAND_REQUEST,
  FAVOURITED_STATUSES_EXPAND_SUCCESS,
  FAVOURITED_STATUSES_EXPAND_FAIL,
  ACCOUNT_FAVOURITED_STATUSES_FETCH_REQUEST,
  ACCOUNT_FAVOURITED_STATUSES_FETCH_SUCCESS,
  ACCOUNT_FAVOURITED_STATUSES_FETCH_FAIL,
  ACCOUNT_FAVOURITED_STATUSES_EXPAND_REQUEST,
  ACCOUNT_FAVOURITED_STATUSES_EXPAND_SUCCESS,
  ACCOUNT_FAVOURITED_STATUSES_EXPAND_FAIL,
} from '../actions/favourites';
import {
  BOOKMARKED_STATUSES_FETCH_REQUEST,
  BOOKMARKED_STATUSES_FETCH_SUCCESS,
  BOOKMARKED_STATUSES_FETCH_FAIL,
  BOOKMARKED_STATUSES_EXPAND_REQUEST,
  BOOKMARKED_STATUSES_EXPAND_SUCCESS,
  BOOKMARKED_STATUSES_EXPAND_FAIL,
} from '../actions/bookmarks';
import {
  PINNED_STATUSES_FETCH_SUCCESS,
} from '../actions/pin_statuses';
import { Map as ImmutableMap, OrderedSet as ImmutableOrderedSet } from 'immutable';
import {
  FAVOURITE_SUCCESS,
  UNFAVOURITE_SUCCESS,
  BOOKMARK_SUCCESS,
  UNBOOKMARK_SUCCESS,
  PIN_SUCCESS,
  UNPIN_SUCCESS,
} from '../actions/interactions';
import {
  SCHEDULED_STATUSES_FETCH_REQUEST,
  SCHEDULED_STATUSES_FETCH_SUCCESS,
  SCHEDULED_STATUSES_FETCH_FAIL,
  SCHEDULED_STATUSES_EXPAND_REQUEST,
  SCHEDULED_STATUSES_EXPAND_SUCCESS,
  SCHEDULED_STATUSES_EXPAND_FAIL,
  SCHEDULED_STATUS_CANCEL_REQUEST,
  SCHEDULED_STATUS_CANCEL_SUCCESS,
} from '../actions/scheduled_statuses';

const initialMap = ImmutableMap({
  next: null,
  loaded: false,
  items: ImmutableOrderedSet(),
});

const initialState = ImmutableMap({
  favourites: initialMap,
  bookmarks: initialMap,
  pins: initialMap,
  scheduled_statuses: initialMap,
});

const getStatusId = status => typeof status === 'string' ? status : status.get('id');

const getStatusIds = (statuses = []) => (
  ImmutableOrderedSet(statuses.map(status => status.id))
);

const setLoading = (state, listType, loading) => state.setIn([listType, 'isLoading'], loading);

const normalizeList = (state, listType, statuses, next) => {
  return state.update(listType, initialMap, listMap => listMap.withMutations(map => {
    map.set('next', next);
    map.set('loaded', true);
    map.set('isLoading', false);
    map.set('items', getStatusIds(statuses));
  }));
};

const appendToList = (state, listType, statuses, next) => {
  const newIds = getStatusIds(statuses);

  return state.update(listType, initialMap, listMap => listMap.withMutations(map => {
    map.set('next', next);
    map.set('isLoading', false);
    map.update('items', ImmutableOrderedSet(), items => items.union(newIds));
  }));
};

const prependOneToList = (state, listType, status) => {
  const statusId = getStatusId(status);
  return state.updateIn([listType, 'items'], ImmutableOrderedSet(), items => {
    return ImmutableOrderedSet([statusId]).union(items);
  });
};

const removeOneFromList = (state, listType, status) => {
  const statusId = getStatusId(status);
  return state.updateIn([listType, 'items'], ImmutableOrderedSet(), items => items.delete(statusId));
};

export default function statusLists(state = initialState, action) {
  switch(action.type) {
  case FAVOURITED_STATUSES_FETCH_REQUEST:
  case FAVOURITED_STATUSES_EXPAND_REQUEST:
    return setLoading(state, 'favourites', true);
  case FAVOURITED_STATUSES_FETCH_FAIL:
  case FAVOURITED_STATUSES_EXPAND_FAIL:
    return setLoading(state, 'favourites', false);
  case FAVOURITED_STATUSES_FETCH_SUCCESS:
    return normalizeList(state, 'favourites', action.statuses, action.next);
  case FAVOURITED_STATUSES_EXPAND_SUCCESS:
    return appendToList(state, 'favourites', action.statuses, action.next);
  case ACCOUNT_FAVOURITED_STATUSES_FETCH_REQUEST:
  case ACCOUNT_FAVOURITED_STATUSES_EXPAND_REQUEST:
    return setLoading(state, `favourites:${action.accountId}`, true);
  case ACCOUNT_FAVOURITED_STATUSES_FETCH_FAIL:
  case ACCOUNT_FAVOURITED_STATUSES_EXPAND_FAIL:
    return setLoading(state, `favourites:${action.accountId}`, false);
  case ACCOUNT_FAVOURITED_STATUSES_FETCH_SUCCESS:
    return normalizeList(state, `favourites:${action.accountId}`, action.statuses, action.next);
  case ACCOUNT_FAVOURITED_STATUSES_EXPAND_SUCCESS:
    return appendToList(state, `favourites:${action.accountId}`, action.statuses, action.next);
  case BOOKMARKED_STATUSES_FETCH_REQUEST:
  case BOOKMARKED_STATUSES_EXPAND_REQUEST:
    return setLoading(state, 'bookmarks', true);
  case BOOKMARKED_STATUSES_FETCH_FAIL:
  case BOOKMARKED_STATUSES_EXPAND_FAIL:
    return setLoading(state, 'bookmarks', false);
  case BOOKMARKED_STATUSES_FETCH_SUCCESS:
    return normalizeList(state, 'bookmarks', action.statuses, action.next);
  case BOOKMARKED_STATUSES_EXPAND_SUCCESS:
    return appendToList(state, 'bookmarks', action.statuses, action.next);
  case FAVOURITE_SUCCESS:
    return prependOneToList(state, 'favourites', action.status);
  case UNFAVOURITE_SUCCESS:
    return removeOneFromList(state, 'favourites', action.status);
  case BOOKMARK_SUCCESS:
    return prependOneToList(state, 'bookmarks', action.status);
  case UNBOOKMARK_SUCCESS:
    return removeOneFromList(state, 'bookmarks', action.status);
  case PINNED_STATUSES_FETCH_SUCCESS:
    return normalizeList(state, 'pins', action.statuses, action.next);
  case PIN_SUCCESS:
    return prependOneToList(state, 'pins', action.status);
  case UNPIN_SUCCESS:
    return removeOneFromList(state, 'pins', action.status);
  case SCHEDULED_STATUSES_FETCH_REQUEST:
  case SCHEDULED_STATUSES_EXPAND_REQUEST:
    return setLoading(state, 'scheduled_statuses', true);
  case SCHEDULED_STATUSES_FETCH_FAIL:
  case SCHEDULED_STATUSES_EXPAND_FAIL:
    return setLoading(state, 'scheduled_statuses', false);
  case SCHEDULED_STATUSES_FETCH_SUCCESS:
    return normalizeList(state, 'scheduled_statuses', action.statuses, action.next);
  case SCHEDULED_STATUSES_EXPAND_SUCCESS:
    return appendToList(state, 'scheduled_statuses', action.statuses, action.next);
  case SCHEDULED_STATUS_CANCEL_REQUEST:
  case SCHEDULED_STATUS_CANCEL_SUCCESS:
    return removeOneFromList(state, 'scheduled_statuses', action.id || action.status.get('id'));
  default:
    return state;
  }
}
