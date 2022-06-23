import {
  Map as ImmutableMap,
  OrderedSet as ImmutableOrderedSet,
  Record as ImmutableRecord,
} from 'immutable';

import {
  BOOKMARKED_STATUSES_FETCH_REQUEST,
  BOOKMARKED_STATUSES_FETCH_SUCCESS,
  BOOKMARKED_STATUSES_FETCH_FAIL,
  BOOKMARKED_STATUSES_EXPAND_REQUEST,
  BOOKMARKED_STATUSES_EXPAND_SUCCESS,
  BOOKMARKED_STATUSES_EXPAND_FAIL,
} from '../actions/bookmarks';
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
  FAVOURITE_SUCCESS,
  UNFAVOURITE_SUCCESS,
  BOOKMARK_SUCCESS,
  UNBOOKMARK_SUCCESS,
  PIN_SUCCESS,
  UNPIN_SUCCESS,
} from '../actions/interactions';
import {
  PINNED_STATUSES_FETCH_SUCCESS,
} from '../actions/pin_statuses';
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

import type { AnyAction } from 'redux';
import type { Status as StatusEntity } from 'soapbox/types/entities';

const StatusListRecord = ImmutableRecord({
  next: null as string | null,
  loaded: false,
  isLoading: null as boolean | null,
  items: ImmutableOrderedSet<string>(),
});

type State = ImmutableMap<string, StatusList>;
type StatusList = ReturnType<typeof StatusListRecord>;
type Status = string | StatusEntity;
type Statuses = Array<string | StatusEntity>;

const initialState: State = ImmutableMap({
  favourites: StatusListRecord(),
  bookmarks: StatusListRecord(),
  pins: StatusListRecord(),
  scheduled_statuses: StatusListRecord(),
});

const getStatusId = (status: string | StatusEntity) => typeof status === 'string' ? status : status.id;

const getStatusIds = (statuses: Statuses = []) => (
  ImmutableOrderedSet(statuses.map(getStatusId))
);

const setLoading = (state: State, listType: string, loading: boolean) => state.setIn([listType, 'isLoading'], loading);

const normalizeList = (state: State, listType: string, statuses: Statuses, next: string | null) => {
  return state.update(listType, StatusListRecord(), listMap => listMap.withMutations(map => {
    map.set('next', next);
    map.set('loaded', true);
    map.set('isLoading', false);
    map.set('items', getStatusIds(statuses));
  }));
};

const appendToList = (state: State, listType: string, statuses: Statuses, next: string | null) => {
  const newIds = getStatusIds(statuses);

  return state.update(listType, StatusListRecord(), listMap => listMap.withMutations(map => {
    map.set('next', next);
    map.set('isLoading', false);
    map.update('items', items => items.union(newIds));
  }));
};

const prependOneToList = (state: State, listType: string, status: Status) => {
  const statusId = getStatusId(status);
  return state.updateIn([listType, 'items'], ImmutableOrderedSet(), items => {
    return ImmutableOrderedSet([statusId]).union(items as ImmutableOrderedSet<string>);
  });
};

const removeOneFromList = (state: State, listType: string, status: Status) => {
  const statusId = getStatusId(status);
  return state.updateIn([listType, 'items'], ImmutableOrderedSet(), items => (items as ImmutableOrderedSet<string>).delete(statusId));
};

export default function statusLists(state = initialState, action: AnyAction) {
  switch (action.type) {
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
      return removeOneFromList(state, 'scheduled_statuses', action.id || action.status.id);
    default:
      return state;
  }
}
