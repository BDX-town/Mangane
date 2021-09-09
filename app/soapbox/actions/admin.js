import api from '../api';
import { importFetchedAccount, importFetchedStatuses } from 'soapbox/actions/importer';
import { fetchRelationships } from 'soapbox/actions/accounts';

export const ADMIN_CONFIG_FETCH_REQUEST = 'ADMIN_CONFIG_FETCH_REQUEST';
export const ADMIN_CONFIG_FETCH_SUCCESS = 'ADMIN_CONFIG_FETCH_SUCCESS';
export const ADMIN_CONFIG_FETCH_FAIL    = 'ADMIN_CONFIG_FETCH_FAIL';

export const ADMIN_CONFIG_UPDATE_REQUEST = 'ADMIN_CONFIG_UPDATE_REQUEST';
export const ADMIN_CONFIG_UPDATE_SUCCESS = 'ADMIN_CONFIG_UPDATE_SUCCESS';
export const ADMIN_CONFIG_UPDATE_FAIL    = 'ADMIN_CONFIG_UPDATE_FAIL';

export const ADMIN_REPORTS_FETCH_REQUEST = 'ADMIN_REPORTS_FETCH_REQUEST';
export const ADMIN_REPORTS_FETCH_SUCCESS = 'ADMIN_REPORTS_FETCH_SUCCESS';
export const ADMIN_REPORTS_FETCH_FAIL    = 'ADMIN_REPORTS_FETCH_FAIL';

export const ADMIN_REPORTS_PATCH_REQUEST = 'ADMIN_REPORTS_PATCH_REQUEST';
export const ADMIN_REPORTS_PATCH_SUCCESS = 'ADMIN_REPORTS_PATCH_SUCCESS';
export const ADMIN_REPORTS_PATCH_FAIL    = 'ADMIN_REPORTS_PATCH_FAIL';

export const ADMIN_USERS_FETCH_REQUEST = 'ADMIN_USERS_FETCH_REQUEST';
export const ADMIN_USERS_FETCH_SUCCESS = 'ADMIN_USERS_FETCH_SUCCESS';
export const ADMIN_USERS_FETCH_FAIL    = 'ADMIN_USERS_FETCH_FAIL';

export const ADMIN_USERS_DELETE_REQUEST = 'ADMIN_USERS_DELETE_REQUEST';
export const ADMIN_USERS_DELETE_SUCCESS = 'ADMIN_USERS_DELETE_SUCCESS';
export const ADMIN_USERS_DELETE_FAIL    = 'ADMIN_USERS_DELETE_FAIL';

export const ADMIN_USERS_APPROVE_REQUEST = 'ADMIN_USERS_APPROVE_REQUEST';
export const ADMIN_USERS_APPROVE_SUCCESS = 'ADMIN_USERS_APPROVE_SUCCESS';
export const ADMIN_USERS_APPROVE_FAIL    = 'ADMIN_USERS_APPROVE_FAIL';

export const ADMIN_USERS_DEACTIVATE_REQUEST = 'ADMIN_USERS_DEACTIVATE_REQUEST';
export const ADMIN_USERS_DEACTIVATE_SUCCESS = 'ADMIN_USERS_DEACTIVATE_SUCCESS';
export const ADMIN_USERS_DEACTIVATE_FAIL    = 'ADMIN_USERS_DEACTIVATE_FAIL';

export const ADMIN_STATUS_DELETE_REQUEST = 'ADMIN_STATUS_DELETE_REQUEST';
export const ADMIN_STATUS_DELETE_SUCCESS = 'ADMIN_STATUS_DELETE_SUCCESS';
export const ADMIN_STATUS_DELETE_FAIL    = 'ADMIN_STATUS_DELETE_FAIL';

export const ADMIN_STATUS_TOGGLE_SENSITIVITY_REQUEST = 'ADMIN_STATUS_TOGGLE_SENSITIVITY_REQUEST';
export const ADMIN_STATUS_TOGGLE_SENSITIVITY_SUCCESS = 'ADMIN_STATUS_TOGGLE_SENSITIVITY_SUCCESS';
export const ADMIN_STATUS_TOGGLE_SENSITIVITY_FAIL    = 'ADMIN_STATUS_TOGGLE_SENSITIVITY_FAIL';

export const ADMIN_LOG_FETCH_REQUEST = 'ADMIN_LOG_FETCH_REQUEST';
export const ADMIN_LOG_FETCH_SUCCESS = 'ADMIN_LOG_FETCH_SUCCESS';
export const ADMIN_LOG_FETCH_FAIL    = 'ADMIN_LOG_FETCH_FAIL';

export const ADMIN_USERS_TAG_REQUEST = 'ADMIN_USERS_TAG_REQUEST';
export const ADMIN_USERS_TAG_SUCCESS = 'ADMIN_USERS_TAG_SUCCESS';
export const ADMIN_USERS_TAG_FAIL    = 'ADMIN_USERS_TAG_FAIL';

export const ADMIN_USERS_UNTAG_REQUEST = 'ADMIN_USERS_UNTAG_REQUEST';
export const ADMIN_USERS_UNTAG_SUCCESS = 'ADMIN_USERS_UNTAG_SUCCESS';
export const ADMIN_USERS_UNTAG_FAIL    = 'ADMIN_USERS_UNTAG_FAIL';

export const ADMIN_ADD_PERMISSION_GROUP_REQUEST = 'ADMIN_ADD_PERMISSION_GROUP_REQUEST';
export const ADMIN_ADD_PERMISSION_GROUP_SUCCESS = 'ADMIN_ADD_PERMISSION_GROUP_SUCCESS';
export const ADMIN_ADD_PERMISSION_GROUP_FAIL    = 'ADMIN_ADD_PERMISSION_GROUP_FAIL';

export const ADMIN_REMOVE_PERMISSION_GROUP_REQUEST = 'ADMIN_REMOVE_PERMISSION_GROUP_REQUEST';
export const ADMIN_REMOVE_PERMISSION_GROUP_SUCCESS = 'ADMIN_REMOVE_PERMISSION_GROUP_SUCCESS';
export const ADMIN_REMOVE_PERMISSION_GROUP_FAIL    = 'ADMIN_REMOVE_PERMISSION_GROUP_FAIL';

const nicknamesFromIds = (getState, ids) => ids.map(id => getState().getIn(['accounts', id, 'acct']));

export function fetchConfig() {
  return (dispatch, getState) => {
    dispatch({ type: ADMIN_CONFIG_FETCH_REQUEST });
    return api(getState)
      .get('/api/pleroma/admin/config')
      .then(({ data }) => {
        dispatch({ type: ADMIN_CONFIG_FETCH_SUCCESS, configs: data.configs, needsReboot: data.need_reboot });
      }).catch(error => {
        dispatch({ type: ADMIN_CONFIG_FETCH_FAIL, error });
      });
  };
}

export function updateConfig(configs) {
  return (dispatch, getState) => {
    dispatch({ type: ADMIN_CONFIG_UPDATE_REQUEST, configs });
    return api(getState)
      .post('/api/pleroma/admin/config', { configs })
      .then(({ data }) => {
        dispatch({ type: ADMIN_CONFIG_UPDATE_SUCCESS, configs: data.configs, needsReboot: data.need_reboot });
      }).catch(error => {
        dispatch({ type: ADMIN_CONFIG_UPDATE_FAIL, error, configs });
      });
  };
}

export function fetchReports(params) {
  return (dispatch, getState) => {
    dispatch({ type: ADMIN_REPORTS_FETCH_REQUEST, params });
    return api(getState)
      .get('/api/pleroma/admin/reports', { params })
      .then(({ data: { reports } }) => {
        reports.forEach(report => {
          dispatch(importFetchedAccount(report.account));
          dispatch(importFetchedAccount(report.actor));
          dispatch(importFetchedStatuses(report.statuses));
        });
        dispatch({ type: ADMIN_REPORTS_FETCH_SUCCESS, reports, params });
      }).catch(error => {
        dispatch({ type: ADMIN_REPORTS_FETCH_FAIL, error, params });
      });
  };
}

function patchReports(ids, state) {
  const reports = ids.map(id => ({ id, state }));
  return (dispatch, getState) => {
    dispatch({ type: ADMIN_REPORTS_PATCH_REQUEST, reports });
    return api(getState)
      .patch('/api/pleroma/admin/reports', { reports })
      .then(() => {
        dispatch({ type: ADMIN_REPORTS_PATCH_SUCCESS, reports });
      }).catch(error => {
        dispatch({ type: ADMIN_REPORTS_PATCH_FAIL, error, reports });
      });
  };
}
export function closeReports(ids) {
  return patchReports(ids, 'closed');
}

export function fetchUsers(filters = [], page = 1, query, pageSize = 50) {
  return (dispatch, getState) => {
    const params = { filters: filters.join(), page, page_size: pageSize };
    if (query) params.query = query;

    dispatch({ type: ADMIN_USERS_FETCH_REQUEST, filters, page, pageSize });
    return api(getState)
      .get('/api/pleroma/admin/users', { params })
      .then(({ data: { users, count, page_size: pageSize } }) => {
        dispatch(fetchRelationships(users.map(user => user.id)));
        dispatch({ type: ADMIN_USERS_FETCH_SUCCESS, users, count, pageSize, filters, page });
        return { users, count, pageSize };
      }).catch(error => {
        dispatch({ type: ADMIN_USERS_FETCH_FAIL, error, filters, page, pageSize });
      });
  };
}

export function deactivateUsers(accountIds) {
  return (dispatch, getState) => {
    const nicknames = nicknamesFromIds(getState, accountIds);
    dispatch({ type: ADMIN_USERS_DEACTIVATE_REQUEST, accountIds });
    return api(getState)
      .patch('/api/pleroma/admin/users/deactivate', { nicknames })
      .then(({ data: { users } }) => {
        dispatch({ type: ADMIN_USERS_DEACTIVATE_SUCCESS, users, accountIds });
      }).catch(error => {
        dispatch({ type: ADMIN_USERS_DEACTIVATE_FAIL, error, accountIds });
      });
  };
}

export function deleteUsers(accountIds) {
  return (dispatch, getState) => {
    const nicknames = nicknamesFromIds(getState, accountIds);
    dispatch({ type: ADMIN_USERS_DELETE_REQUEST, accountIds });
    return api(getState)
      .delete('/api/pleroma/admin/users', { data: { nicknames } })
      .then(({ data: nicknames }) => {
        dispatch({ type: ADMIN_USERS_DELETE_SUCCESS, nicknames, accountIds });
      }).catch(error => {
        dispatch({ type: ADMIN_USERS_DELETE_FAIL, error, accountIds });
      });
  };
}

export function approveUsers(accountIds) {
  return (dispatch, getState) => {
    const nicknames = nicknamesFromIds(getState, accountIds);
    dispatch({ type: ADMIN_USERS_APPROVE_REQUEST, accountIds });
    return api(getState)
      .patch('/api/pleroma/admin/users/approve', { nicknames })
      .then(({ data: { users } }) => {
        dispatch({ type: ADMIN_USERS_APPROVE_SUCCESS, users, accountIds });
      }).catch(error => {
        dispatch({ type: ADMIN_USERS_APPROVE_FAIL, error, accountIds });
      });
  };
}

export function deleteStatus(id) {
  return (dispatch, getState) => {
    dispatch({ type: ADMIN_STATUS_DELETE_REQUEST, id });
    return api(getState)
      .delete(`/api/pleroma/admin/statuses/${id}`)
      .then(() => {
        dispatch({ type: ADMIN_STATUS_DELETE_SUCCESS, id });
      }).catch(error => {
        dispatch({ type: ADMIN_STATUS_DELETE_FAIL, error, id });
      });
  };
}

export function toggleStatusSensitivity(id, sensitive) {
  return (dispatch, getState) => {
    dispatch({ type: ADMIN_STATUS_TOGGLE_SENSITIVITY_REQUEST, id });
    return api(getState)
      .put(`/api/pleroma/admin/statuses/${id}`, { sensitive: !sensitive })
      .then(() => {
        dispatch({ type: ADMIN_STATUS_TOGGLE_SENSITIVITY_SUCCESS, id });
      }).catch(error => {
        dispatch({ type: ADMIN_STATUS_TOGGLE_SENSITIVITY_FAIL, error, id });
      });
  };
}

export function fetchModerationLog(params) {
  return (dispatch, getState) => {
    dispatch({ type: ADMIN_LOG_FETCH_REQUEST });
    return api(getState)
      .get('/api/pleroma/admin/moderation_log', { params })
      .then(({ data }) => {
        dispatch({ type: ADMIN_LOG_FETCH_SUCCESS, items: data.items, total: data.total });
        return data;
      }).catch(error => {
        dispatch({ type: ADMIN_LOG_FETCH_FAIL, error });
      });
  };
}

export function tagUsers(accountIds, tags) {
  return (dispatch, getState) => {
    const nicknames = nicknamesFromIds(getState, accountIds);
    dispatch({ type: ADMIN_USERS_TAG_REQUEST, accountIds, tags });
    return api(getState)
      .put('/api/v1/pleroma/admin/users/tag', { nicknames, tags })
      .then(() => {
        dispatch({ type: ADMIN_USERS_TAG_SUCCESS, accountIds, tags });
      }).catch(error => {
        dispatch({ type: ADMIN_USERS_TAG_FAIL, error, accountIds, tags });
      });
  };
}

export function untagUsers(accountIds, tags) {
  return (dispatch, getState) => {
    const nicknames = nicknamesFromIds(getState, accountIds);
    dispatch({ type: ADMIN_USERS_UNTAG_REQUEST, accountIds, tags });
    return api(getState)
      .delete('/api/v1/pleroma/admin/users/tag', { data: { nicknames, tags } })
      .then(() => {
        dispatch({ type: ADMIN_USERS_UNTAG_SUCCESS, accountIds, tags });
      }).catch(error => {
        dispatch({ type: ADMIN_USERS_UNTAG_FAIL, error, accountIds, tags });
      });
  };
}

export function verifyUser(accountId) {
  return (dispatch, getState) => {
    return dispatch(tagUsers([accountId], ['verified']));
  };
}

export function unverifyUser(accountId) {
  return (dispatch, getState) => {
    return dispatch(untagUsers([accountId], ['verified']));
  };
}

export function addPermission(accountIds, permissionGroup) {
  return (dispatch, getState) => {
    const nicknames = nicknamesFromIds(getState, accountIds);
    dispatch({ type: ADMIN_ADD_PERMISSION_GROUP_REQUEST, accountIds, permissionGroup });
    return api(getState)
      .post(`/api/v1/pleroma/admin/users/permission_group/${permissionGroup}`, { nicknames })
      .then(({ data }) => {
        dispatch({ type: ADMIN_ADD_PERMISSION_GROUP_SUCCESS, accountIds, permissionGroup, data });
      }).catch(error => {
        dispatch({ type: ADMIN_ADD_PERMISSION_GROUP_FAIL, error, accountIds, permissionGroup });
      });
  };
}

export function removePermission(accountIds, permissionGroup) {
  return (dispatch, getState) => {
    const nicknames = nicknamesFromIds(getState, accountIds);
    dispatch({ type: ADMIN_REMOVE_PERMISSION_GROUP_REQUEST, accountIds, permissionGroup });
    return api(getState)
      .delete(`/api/v1/pleroma/admin/users/permission_group/${permissionGroup}`, { data: { nicknames } })
      .then(({ data }) => {
        dispatch({ type: ADMIN_REMOVE_PERMISSION_GROUP_SUCCESS, accountIds, permissionGroup, data });
      }).catch(error => {
        dispatch({ type: ADMIN_REMOVE_PERMISSION_GROUP_FAIL, error, accountIds, permissionGroup });
      });
  };
}

export function promoteToAdmin(accountId) {
  return (dispatch, getState) => {
    return Promise.all([
      dispatch(addPermission([accountId], 'admin')),
      dispatch(removePermission([accountId], 'moderator')),
    ]);
  };
}

export function promoteToModerator(accountId) {
  return (dispatch, getState) => {
    return Promise.all([
      dispatch(removePermission([accountId], 'admin')),
      dispatch(addPermission([accountId], 'moderator')),
    ]);
  };
}

export function demoteToUser(accountId) {
  return (dispatch, getState) => {
    return Promise.all([
      dispatch(removePermission([accountId], 'admin')),
      dispatch(removePermission([accountId], 'moderator')),
    ]);
  };
}
