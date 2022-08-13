import { AxiosError } from 'axios';

import { isLoggedIn } from 'soapbox/utils/auth';

import api, { getLinks } from '../api';

import { fetchRelationships } from './accounts';
import { importFetchedAccounts } from './importer';

import type { AppDispatch, RootState } from 'soapbox/store';
import type { APIEntity } from 'soapbox/types/entities';

const GROUP_FETCH_REQUEST = 'GROUP_FETCH_REQUEST';
const GROUP_FETCH_SUCCESS = 'GROUP_FETCH_SUCCESS';
const GROUP_FETCH_FAIL    = 'GROUP_FETCH_FAIL';

const GROUP_RELATIONSHIPS_FETCH_REQUEST = 'GROUP_RELATIONSHIPS_FETCH_REQUEST';
const GROUP_RELATIONSHIPS_FETCH_SUCCESS = 'GROUP_RELATIONSHIPS_FETCH_SUCCESS';
const GROUP_RELATIONSHIPS_FETCH_FAIL    = 'GROUP_RELATIONSHIPS_FETCH_FAIL';

const GROUPS_FETCH_REQUEST = 'GROUPS_FETCH_REQUEST';
const GROUPS_FETCH_SUCCESS = 'GROUPS_FETCH_SUCCESS';
const GROUPS_FETCH_FAIL    = 'GROUPS_FETCH_FAIL';

const GROUP_JOIN_REQUEST = 'GROUP_JOIN_REQUEST';
const GROUP_JOIN_SUCCESS = 'GROUP_JOIN_SUCCESS';
const GROUP_JOIN_FAIL    = 'GROUP_JOIN_FAIL';

const GROUP_LEAVE_REQUEST = 'GROUP_LEAVE_REQUEST';
const GROUP_LEAVE_SUCCESS = 'GROUP_LEAVE_SUCCESS';
const GROUP_LEAVE_FAIL    = 'GROUP_LEAVE_FAIL';

const GROUP_MEMBERS_FETCH_REQUEST = 'GROUP_MEMBERS_FETCH_REQUEST';
const GROUP_MEMBERS_FETCH_SUCCESS = 'GROUP_MEMBERS_FETCH_SUCCESS';
const GROUP_MEMBERS_FETCH_FAIL    = 'GROUP_MEMBERS_FETCH_FAIL';

const GROUP_MEMBERS_EXPAND_REQUEST = 'GROUP_MEMBERS_EXPAND_REQUEST';
const GROUP_MEMBERS_EXPAND_SUCCESS = 'GROUP_MEMBERS_EXPAND_SUCCESS';
const GROUP_MEMBERS_EXPAND_FAIL    = 'GROUP_MEMBERS_EXPAND_FAIL';

const GROUP_REMOVED_ACCOUNTS_FETCH_REQUEST = 'GROUP_REMOVED_ACCOUNTS_FETCH_REQUEST';
const GROUP_REMOVED_ACCOUNTS_FETCH_SUCCESS = 'GROUP_REMOVED_ACCOUNTS_FETCH_SUCCESS';
const GROUP_REMOVED_ACCOUNTS_FETCH_FAIL    = 'GROUP_REMOVED_ACCOUNTS_FETCH_FAIL';

const GROUP_REMOVED_ACCOUNTS_EXPAND_REQUEST = 'GROUP_REMOVED_ACCOUNTS_EXPAND_REQUEST';
const GROUP_REMOVED_ACCOUNTS_EXPAND_SUCCESS = 'GROUP_REMOVED_ACCOUNTS_EXPAND_SUCCESS';
const GROUP_REMOVED_ACCOUNTS_EXPAND_FAIL    = 'GROUP_REMOVED_ACCOUNTS_EXPAND_FAIL';

const GROUP_REMOVED_ACCOUNTS_REMOVE_REQUEST = 'GROUP_REMOVED_ACCOUNTS_REMOVE_REQUEST';
const GROUP_REMOVED_ACCOUNTS_REMOVE_SUCCESS = 'GROUP_REMOVED_ACCOUNTS_REMOVE_SUCCESS';
const GROUP_REMOVED_ACCOUNTS_REMOVE_FAIL    = 'GROUP_REMOVED_ACCOUNTS_REMOVE_FAIL';

const GROUP_REMOVED_ACCOUNTS_CREATE_REQUEST = 'GROUP_REMOVED_ACCOUNTS_CREATE_REQUEST';
const GROUP_REMOVED_ACCOUNTS_CREATE_SUCCESS = 'GROUP_REMOVED_ACCOUNTS_CREATE_SUCCESS';
const GROUP_REMOVED_ACCOUNTS_CREATE_FAIL    = 'GROUP_REMOVED_ACCOUNTS_CREATE_FAIL';

const GROUP_REMOVE_STATUS_REQUEST = 'GROUP_REMOVE_STATUS_REQUEST';
const GROUP_REMOVE_STATUS_SUCCESS = 'GROUP_REMOVE_STATUS_SUCCESS';
const GROUP_REMOVE_STATUS_FAIL    = 'GROUP_REMOVE_STATUS_FAIL';

const fetchGroup = (id: string) => (dispatch: AppDispatch, getState: () => RootState) => {
  if (!isLoggedIn(getState)) return;

  dispatch(fetchGroupRelationships([id]));

  if (getState().groups.get(id)) {
    return;
  }

  dispatch(fetchGroupRequest(id));

  api(getState).get(`/api/v1/groups/${id}`)
    .then(({ data }) => dispatch(fetchGroupSuccess(data)))
    .catch(err => dispatch(fetchGroupFail(id, err)));
};

const fetchGroupRequest = (id: string) => ({
  type: GROUP_FETCH_REQUEST,
  id,
});

const fetchGroupSuccess = (group: APIEntity) => ({
  type: GROUP_FETCH_SUCCESS,
  group,
});

const fetchGroupFail = (id: string, error: AxiosError) => ({
  type: GROUP_FETCH_FAIL,
  id,
  error,
});

const fetchGroupRelationships = (groupIds: string[]) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return;

    const loadedRelationships = getState().group_relationships;
    const newGroupIds = groupIds.filter(id => loadedRelationships.get(id, null) === null);

    if (newGroupIds.length === 0) {
      return;
    }

    dispatch(fetchGroupRelationshipsRequest(newGroupIds));

    api(getState).get(`/api/v1/groups/${newGroupIds[0]}/relationships?${newGroupIds.map(id => `id[]=${id}`).join('&')}`).then(response => {
      dispatch(fetchGroupRelationshipsSuccess(response.data));
    }).catch(error => {
      dispatch(fetchGroupRelationshipsFail(error));
    });
  };

const fetchGroupRelationshipsRequest = (ids: string[]) => ({
  type: GROUP_RELATIONSHIPS_FETCH_REQUEST,
  ids,
  skipLoading: true,
});

const fetchGroupRelationshipsSuccess = (relationships: APIEntity[]) => ({
  type: GROUP_RELATIONSHIPS_FETCH_SUCCESS,
  relationships,
  skipLoading: true,
});

const fetchGroupRelationshipsFail = (error: AxiosError) => ({
  type: GROUP_RELATIONSHIPS_FETCH_FAIL,
  error,
  skipLoading: true,
});

const fetchGroups = (tab: string) => (dispatch: AppDispatch, getState: () => RootState) => {
  if (!isLoggedIn(getState)) return;

  dispatch(fetchGroupsRequest());

  api(getState).get('/api/v1/groups?tab=' + tab)
    .then(({ data }) => {
      dispatch(fetchGroupsSuccess(data, tab));
      dispatch(fetchGroupRelationships(data.map((item: APIEntity) => item.id)));
    })
    .catch(err => dispatch(fetchGroupsFail(err)));
};

const fetchGroupsRequest = () => ({
  type: GROUPS_FETCH_REQUEST,
});

const fetchGroupsSuccess = (groups: APIEntity[], tab: string) => ({
  type: GROUPS_FETCH_SUCCESS,
  groups,
  tab,
});

const fetchGroupsFail = (error: AxiosError) => ({
  type: GROUPS_FETCH_FAIL,
  error,
});

const joinGroup = (id: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return;

    dispatch(joinGroupRequest(id));

    api(getState).post(`/api/v1/groups/${id}/accounts`).then(response => {
      dispatch(joinGroupSuccess(response.data));
    }).catch(error => {
      dispatch(joinGroupFail(id, error));
    });
  };

const leaveGroup = (id: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return;

    dispatch(leaveGroupRequest(id));

    api(getState).delete(`/api/v1/groups/${id}/accounts`).then(response => {
      dispatch(leaveGroupSuccess(response.data));
    }).catch(error => {
      dispatch(leaveGroupFail(id, error));
    });
  };

const joinGroupRequest = (id: string) => ({
  type: GROUP_JOIN_REQUEST,
  id,
});

const joinGroupSuccess = (relationship: APIEntity) => ({
  type: GROUP_JOIN_SUCCESS,
  relationship,
});

const joinGroupFail = (id: string, error: AxiosError) => ({
  type: GROUP_JOIN_FAIL,
  id,
  error,
});

const leaveGroupRequest = (id: string) => ({
  type: GROUP_LEAVE_REQUEST,
  id,
});

const leaveGroupSuccess = (relationship: APIEntity) => ({
  type: GROUP_LEAVE_SUCCESS,
  relationship,
});

const leaveGroupFail = (id: string, error: AxiosError) => ({
  type: GROUP_LEAVE_FAIL,
  id,
  error,
});

const fetchMembers = (id: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return;

    dispatch(fetchMembersRequest(id));

    api(getState).get(`/api/v1/groups/${id}/accounts`).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');

      dispatch(importFetchedAccounts(response.data));
      dispatch(fetchMembersSuccess(id, response.data, next ? next.uri : null));
      dispatch(fetchRelationships(response.data.map((item: APIEntity) => item.id)));
    }).catch(error => {
      dispatch(fetchMembersFail(id, error));
    });
  };

const fetchMembersRequest = (id: string) => ({
  type: GROUP_MEMBERS_FETCH_REQUEST,
  id,
});

const fetchMembersSuccess = (id: string, accounts: APIEntity[], next: string | null) => ({
  type: GROUP_MEMBERS_FETCH_SUCCESS,
  id,
  accounts,
  next,
});

const fetchMembersFail = (id: string, error: AxiosError) => ({
  type: GROUP_MEMBERS_FETCH_FAIL,
  id,
  error,
});

const expandMembers = (id: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return;

    const url = getState().user_lists.groups.get(id)!.next;

    if (url === null) {
      return;
    }

    dispatch(expandMembersRequest(id));

    api(getState).get(url).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');

      dispatch(importFetchedAccounts(response.data));
      dispatch(expandMembersSuccess(id, response.data, next ? next.uri : null));
      dispatch(fetchRelationships(response.data.map((item: APIEntity) => item.id)));
    }).catch(error => {
      dispatch(expandMembersFail(id, error));
    });
  };

const expandMembersRequest = (id: string) => ({
  type: GROUP_MEMBERS_EXPAND_REQUEST,
  id,
});

const expandMembersSuccess = (id: string, accounts: APIEntity[], next: string | null) => ({
  type: GROUP_MEMBERS_EXPAND_SUCCESS,
  id,
  accounts,
  next,
});

const expandMembersFail = (id: string, error: AxiosError) => ({
  type: GROUP_MEMBERS_EXPAND_FAIL,
  id,
  error,
});

const fetchRemovedAccounts = (id: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return;

    dispatch(fetchRemovedAccountsRequest(id));

    api(getState).get(`/api/v1/groups/${id}/removed_accounts`).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');

      dispatch(importFetchedAccounts(response.data));
      dispatch(fetchRemovedAccountsSuccess(id, response.data, next ? next.uri : null));
      dispatch(fetchRelationships(response.data.map((item: APIEntity) => item.id)));
    }).catch(error => {
      dispatch(fetchRemovedAccountsFail(id, error));
    });
  };

const fetchRemovedAccountsRequest = (id: string) => ({
  type: GROUP_REMOVED_ACCOUNTS_FETCH_REQUEST,
  id,
});

const fetchRemovedAccountsSuccess = (id: string, accounts: APIEntity[], next: string | null) => ({
  type: GROUP_REMOVED_ACCOUNTS_FETCH_SUCCESS,
  id,
  accounts,
  next,
});

const fetchRemovedAccountsFail = (id: string, error: AxiosError) => ({
  type: GROUP_REMOVED_ACCOUNTS_FETCH_FAIL,
  id,
  error,
});

const expandRemovedAccounts = (id: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return;

    const url = getState().user_lists.groups_removed_accounts.get(id)!.next;

    if (url === null) {
      return;
    }

    dispatch(expandRemovedAccountsRequest(id));

    api(getState).get(url).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');

      dispatch(importFetchedAccounts(response.data));
      dispatch(expandRemovedAccountsSuccess(id, response.data, next ? next.uri : null));
      dispatch(fetchRelationships(response.data.map((item: APIEntity) => item.id)));
    }).catch(error => {
      dispatch(expandRemovedAccountsFail(id, error));
    });
  };

const expandRemovedAccountsRequest = (id: string) => ({
  type: GROUP_REMOVED_ACCOUNTS_EXPAND_REQUEST,
  id,
});

const expandRemovedAccountsSuccess = (id: string, accounts: APIEntity[], next: string | null) => ({
  type: GROUP_REMOVED_ACCOUNTS_EXPAND_SUCCESS,
  id,
  accounts,
  next,
});

const expandRemovedAccountsFail = (id: string, error: AxiosError) => ({
  type: GROUP_REMOVED_ACCOUNTS_EXPAND_FAIL,
  id,
  error,
});

const removeRemovedAccount = (groupId: string, id: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return;

    dispatch(removeRemovedAccountRequest(groupId, id));

    api(getState).delete(`/api/v1/groups/${groupId}/removed_accounts?account_id=${id}`).then(response => {
      dispatch(removeRemovedAccountSuccess(groupId, id));
    }).catch(error => {
      dispatch(removeRemovedAccountFail(groupId, id, error));
    });
  };

const removeRemovedAccountRequest = (groupId: string, id: string) => ({
  type: GROUP_REMOVED_ACCOUNTS_REMOVE_REQUEST,
  groupId,
  id,
});

const removeRemovedAccountSuccess = (groupId: string, id: string) => ({
  type: GROUP_REMOVED_ACCOUNTS_REMOVE_SUCCESS,
  groupId,
  id,
});

const removeRemovedAccountFail = (groupId: string, id: string, error: AxiosError) => ({
  type: GROUP_REMOVED_ACCOUNTS_REMOVE_FAIL,
  groupId,
  id,
  error,
});

const createRemovedAccount = (groupId: string, id: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return;

    dispatch(createRemovedAccountRequest(groupId, id));

    api(getState).post(`/api/v1/groups/${groupId}/removed_accounts?account_id=${id}`).then(response => {
      dispatch(createRemovedAccountSuccess(groupId, id));
    }).catch(error => {
      dispatch(createRemovedAccountFail(groupId, id, error));
    });
  };

const createRemovedAccountRequest = (groupId: string, id: string) => ({
  type: GROUP_REMOVED_ACCOUNTS_CREATE_REQUEST,
  groupId,
  id,
});

const createRemovedAccountSuccess = (groupId: string, id: string) => ({
  type: GROUP_REMOVED_ACCOUNTS_CREATE_SUCCESS,
  groupId,
  id,
});

const createRemovedAccountFail = (groupId: string, id: string, error: AxiosError) => ({
  type: GROUP_REMOVED_ACCOUNTS_CREATE_FAIL,
  groupId,
  id,
  error,
});

const groupRemoveStatus = (groupId: string, id: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    if (!isLoggedIn(getState)) return;

    dispatch(groupRemoveStatusRequest(groupId, id));

    api(getState).delete(`/api/v1/groups/${groupId}/statuses/${id}`).then(response => {
      dispatch(groupRemoveStatusSuccess(groupId, id));
    }).catch(error => {
      dispatch(groupRemoveStatusFail(groupId, id, error));
    });
  };

const groupRemoveStatusRequest = (groupId: string, id: string) => ({
  type: GROUP_REMOVE_STATUS_REQUEST,
  groupId,
  id,
});

const groupRemoveStatusSuccess = (groupId: string, id: string) => ({
  type: GROUP_REMOVE_STATUS_SUCCESS,
  groupId,
  id,
});

const groupRemoveStatusFail = (groupId: string, id: string, error: AxiosError) => ({
  type: GROUP_REMOVE_STATUS_FAIL,
  groupId,
  id,
  error,
});

export {
  GROUP_FETCH_REQUEST,
  GROUP_FETCH_SUCCESS,
  GROUP_FETCH_FAIL,
  GROUP_RELATIONSHIPS_FETCH_REQUEST,
  GROUP_RELATIONSHIPS_FETCH_SUCCESS,
  GROUP_RELATIONSHIPS_FETCH_FAIL,
  GROUPS_FETCH_REQUEST,
  GROUPS_FETCH_SUCCESS,
  GROUPS_FETCH_FAIL,
  GROUP_JOIN_REQUEST,
  GROUP_JOIN_SUCCESS,
  GROUP_JOIN_FAIL,
  GROUP_LEAVE_REQUEST,
  GROUP_LEAVE_SUCCESS,
  GROUP_LEAVE_FAIL,
  GROUP_MEMBERS_FETCH_REQUEST,
  GROUP_MEMBERS_FETCH_SUCCESS,
  GROUP_MEMBERS_FETCH_FAIL,
  GROUP_MEMBERS_EXPAND_REQUEST,
  GROUP_MEMBERS_EXPAND_SUCCESS,
  GROUP_MEMBERS_EXPAND_FAIL,
  GROUP_REMOVED_ACCOUNTS_FETCH_REQUEST,
  GROUP_REMOVED_ACCOUNTS_FETCH_SUCCESS,
  GROUP_REMOVED_ACCOUNTS_FETCH_FAIL,
  GROUP_REMOVED_ACCOUNTS_EXPAND_REQUEST,
  GROUP_REMOVED_ACCOUNTS_EXPAND_SUCCESS,
  GROUP_REMOVED_ACCOUNTS_EXPAND_FAIL,
  GROUP_REMOVED_ACCOUNTS_REMOVE_REQUEST,
  GROUP_REMOVED_ACCOUNTS_REMOVE_SUCCESS,
  GROUP_REMOVED_ACCOUNTS_REMOVE_FAIL,
  GROUP_REMOVED_ACCOUNTS_CREATE_REQUEST,
  GROUP_REMOVED_ACCOUNTS_CREATE_SUCCESS,
  GROUP_REMOVED_ACCOUNTS_CREATE_FAIL,
  GROUP_REMOVE_STATUS_REQUEST,
  GROUP_REMOVE_STATUS_SUCCESS,
  GROUP_REMOVE_STATUS_FAIL,
  fetchGroup,
  fetchGroupRequest,
  fetchGroupSuccess,
  fetchGroupFail,
  fetchGroupRelationships,
  fetchGroupRelationshipsRequest,
  fetchGroupRelationshipsSuccess,
  fetchGroupRelationshipsFail,
  fetchGroups,
  fetchGroupsRequest,
  fetchGroupsSuccess,
  fetchGroupsFail,
  joinGroup,
  leaveGroup,
  joinGroupRequest,
  joinGroupSuccess,
  joinGroupFail,
  leaveGroupRequest,
  leaveGroupSuccess,
  leaveGroupFail,
  fetchMembers,
  fetchMembersRequest,
  fetchMembersSuccess,
  fetchMembersFail,
  expandMembers,
  expandMembersRequest,
  expandMembersSuccess,
  expandMembersFail,
  fetchRemovedAccounts,
  fetchRemovedAccountsRequest,
  fetchRemovedAccountsSuccess,
  fetchRemovedAccountsFail,
  expandRemovedAccounts,
  expandRemovedAccountsRequest,
  expandRemovedAccountsSuccess,
  expandRemovedAccountsFail,
  removeRemovedAccount,
  removeRemovedAccountRequest,
  removeRemovedAccountSuccess,
  removeRemovedAccountFail,
  createRemovedAccount,
  createRemovedAccountRequest,
  createRemovedAccountSuccess,
  createRemovedAccountFail,
  groupRemoveStatus,
  groupRemoveStatusRequest,
  groupRemoveStatusSuccess,
  groupRemoveStatusFail,
};
