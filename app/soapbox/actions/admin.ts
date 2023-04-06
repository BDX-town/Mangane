import { fetchRelationships } from 'soapbox/actions/accounts';
import { importFetchedAccount, importFetchedAccounts, importFetchedStatuses } from 'soapbox/actions/importer';
import { getFeatures } from 'soapbox/utils/features';

import api, { getLinks } from '../api';

import type { AxiosResponse } from 'axios';
import type { AppDispatch, RootState } from 'soapbox/store';
import type { APIEntity } from 'soapbox/types/entities';

const ADMIN_CONFIG_FETCH_REQUEST = 'ADMIN_CONFIG_FETCH_REQUEST';
const ADMIN_CONFIG_FETCH_SUCCESS = 'ADMIN_CONFIG_FETCH_SUCCESS';
const ADMIN_CONFIG_FETCH_FAIL    = 'ADMIN_CONFIG_FETCH_FAIL';

const ADMIN_CONFIG_UPDATE_REQUEST = 'ADMIN_CONFIG_UPDATE_REQUEST';
const ADMIN_CONFIG_UPDATE_SUCCESS = 'ADMIN_CONFIG_UPDATE_SUCCESS';
const ADMIN_CONFIG_UPDATE_FAIL    = 'ADMIN_CONFIG_UPDATE_FAIL';

const ADMIN_REPORTS_FETCH_REQUEST = 'ADMIN_REPORTS_FETCH_REQUEST';
const ADMIN_REPORTS_FETCH_SUCCESS = 'ADMIN_REPORTS_FETCH_SUCCESS';
const ADMIN_REPORTS_FETCH_FAIL    = 'ADMIN_REPORTS_FETCH_FAIL';

const ADMIN_REPORTS_PATCH_REQUEST = 'ADMIN_REPORTS_PATCH_REQUEST';
const ADMIN_REPORTS_PATCH_SUCCESS = 'ADMIN_REPORTS_PATCH_SUCCESS';
const ADMIN_REPORTS_PATCH_FAIL    = 'ADMIN_REPORTS_PATCH_FAIL';

const ADMIN_USERS_FETCH_REQUEST = 'ADMIN_USERS_FETCH_REQUEST';
const ADMIN_USERS_FETCH_SUCCESS = 'ADMIN_USERS_FETCH_SUCCESS';
const ADMIN_USERS_FETCH_FAIL    = 'ADMIN_USERS_FETCH_FAIL';

const ADMIN_USERS_DELETE_REQUEST = 'ADMIN_USERS_DELETE_REQUEST';
const ADMIN_USERS_DELETE_SUCCESS = 'ADMIN_USERS_DELETE_SUCCESS';
const ADMIN_USERS_DELETE_FAIL    = 'ADMIN_USERS_DELETE_FAIL';

const ADMIN_USERS_APPROVE_REQUEST = 'ADMIN_USERS_APPROVE_REQUEST';
const ADMIN_USERS_APPROVE_SUCCESS = 'ADMIN_USERS_APPROVE_SUCCESS';
const ADMIN_USERS_APPROVE_FAIL    = 'ADMIN_USERS_APPROVE_FAIL';

const ADMIN_USERS_DEACTIVATE_REQUEST = 'ADMIN_USERS_DEACTIVATE_REQUEST';
const ADMIN_USERS_DEACTIVATE_SUCCESS = 'ADMIN_USERS_DEACTIVATE_SUCCESS';
const ADMIN_USERS_DEACTIVATE_FAIL    = 'ADMIN_USERS_DEACTIVATE_FAIL';

const ADMIN_STATUS_DELETE_REQUEST = 'ADMIN_STATUS_DELETE_REQUEST';
const ADMIN_STATUS_DELETE_SUCCESS = 'ADMIN_STATUS_DELETE_SUCCESS';
const ADMIN_STATUS_DELETE_FAIL    = 'ADMIN_STATUS_DELETE_FAIL';

const ADMIN_STATUS_TOGGLE_SENSITIVITY_REQUEST = 'ADMIN_STATUS_TOGGLE_SENSITIVITY_REQUEST';
const ADMIN_STATUS_TOGGLE_SENSITIVITY_SUCCESS = 'ADMIN_STATUS_TOGGLE_SENSITIVITY_SUCCESS';
const ADMIN_STATUS_TOGGLE_SENSITIVITY_FAIL    = 'ADMIN_STATUS_TOGGLE_SENSITIVITY_FAIL';

const ADMIN_LOG_FETCH_REQUEST = 'ADMIN_LOG_FETCH_REQUEST';
const ADMIN_LOG_FETCH_SUCCESS = 'ADMIN_LOG_FETCH_SUCCESS';
const ADMIN_LOG_FETCH_FAIL    = 'ADMIN_LOG_FETCH_FAIL';

const ADMIN_USERS_TAG_REQUEST = 'ADMIN_USERS_TAG_REQUEST';
const ADMIN_USERS_TAG_SUCCESS = 'ADMIN_USERS_TAG_SUCCESS';
const ADMIN_USERS_TAG_FAIL    = 'ADMIN_USERS_TAG_FAIL';

const ADMIN_USERS_UNTAG_REQUEST = 'ADMIN_USERS_UNTAG_REQUEST';
const ADMIN_USERS_UNTAG_SUCCESS = 'ADMIN_USERS_UNTAG_SUCCESS';
const ADMIN_USERS_UNTAG_FAIL    = 'ADMIN_USERS_UNTAG_FAIL';

const ADMIN_ADD_PERMISSION_GROUP_REQUEST = 'ADMIN_ADD_PERMISSION_GROUP_REQUEST';
const ADMIN_ADD_PERMISSION_GROUP_SUCCESS = 'ADMIN_ADD_PERMISSION_GROUP_SUCCESS';
const ADMIN_ADD_PERMISSION_GROUP_FAIL    = 'ADMIN_ADD_PERMISSION_GROUP_FAIL';

const ADMIN_REMOVE_PERMISSION_GROUP_REQUEST = 'ADMIN_REMOVE_PERMISSION_GROUP_REQUEST';
const ADMIN_REMOVE_PERMISSION_GROUP_SUCCESS = 'ADMIN_REMOVE_PERMISSION_GROUP_SUCCESS';
const ADMIN_REMOVE_PERMISSION_GROUP_FAIL    = 'ADMIN_REMOVE_PERMISSION_GROUP_FAIL';

const ADMIN_USERS_SUGGEST_REQUEST = 'ADMIN_USERS_SUGGEST_REQUEST';
const ADMIN_USERS_SUGGEST_SUCCESS = 'ADMIN_USERS_SUGGEST_SUCCESS';
const ADMIN_USERS_SUGGEST_FAIL    = 'ADMIN_USERS_SUGGEST_FAIL';

const ADMIN_USERS_UNSUGGEST_REQUEST = 'ADMIN_USERS_UNSUGGEST_REQUEST';
const ADMIN_USERS_UNSUGGEST_SUCCESS = 'ADMIN_USERS_UNSUGGEST_SUCCESS';
const ADMIN_USERS_UNSUGGEST_FAIL    = 'ADMIN_USERS_UNSUGGEST_FAIL';

const nicknamesFromIds = (getState: () => RootState, ids: string[]) => ids.map(id => getState().accounts.get(id)!.acct);

const fetchConfig = () =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: ADMIN_CONFIG_FETCH_REQUEST });
    return api(getState)
      .get('/api/v1/pleroma/admin/config')
      .then(({ data }) => {
        dispatch({ type: ADMIN_CONFIG_FETCH_SUCCESS, configs: data.configs, needsReboot: data.need_reboot });
      }).catch(error => {
        dispatch({ type: ADMIN_CONFIG_FETCH_FAIL, error });
      });
  };

const updateConfig = (configs: Record<string, any>[]) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: ADMIN_CONFIG_UPDATE_REQUEST, configs });
    return api(getState)
      .post('/api/v1/pleroma/admin/config', { configs })
      .then(({ data }) => {
        dispatch({ type: ADMIN_CONFIG_UPDATE_SUCCESS, configs: data.configs, needsReboot: data.need_reboot });
      }).catch(error => {
        dispatch({ type: ADMIN_CONFIG_UPDATE_FAIL, error, configs });
      });
  };

const fetchMastodonReports = (params: Record<string, any>) =>
  (dispatch: AppDispatch, getState: () => RootState) =>
    api(getState)
      .get('/api/v1/admin/reports', { params })
      .then(({ data: reports }) => {
        reports.forEach((report: APIEntity) => {
          dispatch(importFetchedAccount(report.account?.account));
          dispatch(importFetchedAccount(report.target_account?.account));
          dispatch(importFetchedStatuses(report.statuses));
        });
        dispatch({ type: ADMIN_REPORTS_FETCH_SUCCESS, reports, params });
      }).catch(error => {
        dispatch({ type: ADMIN_REPORTS_FETCH_FAIL, error, params });
      });

const fetchPleromaReports = (params: Record<string, any>) =>
  (dispatch: AppDispatch, getState: () => RootState) =>
    api(getState)
      .get('/api/v1/pleroma/admin/reports', { params })
      .then(({ data: { reports } }) => {
        reports.forEach((report: APIEntity) => {
          dispatch(importFetchedAccount(report.account));
          dispatch(importFetchedAccount(report.actor));
          dispatch(importFetchedStatuses(report.statuses));
        });
        dispatch({ type: ADMIN_REPORTS_FETCH_SUCCESS, reports, params });
      }).catch(error => {
        dispatch({ type: ADMIN_REPORTS_FETCH_FAIL, error, params });
      });

const fetchReports = (params: Record<string, any> = {}) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();

    const instance = state.instance;
    const features = getFeatures(instance);

    dispatch({ type: ADMIN_REPORTS_FETCH_REQUEST, params });

    if (features.mastodonAdmin) {
      return dispatch(fetchMastodonReports(params));
    } else {
      const { resolved } = params;
      let state: string | undefined = undefined;
      if (resolved === false) state = 'open';
      if (resolved) state = 'resolved';

      return dispatch(fetchPleromaReports({
        state,
      }));
    }
  };

const patchMastodonReports = (reports: { id: string, state: string }[]) =>
  (dispatch: AppDispatch, getState: () => RootState) =>
    Promise.all(reports.map(({ id, state }) => api(getState)
      .post(`/api/v1/admin/reports/${id}/${state === 'resolved' ? 'reopen' : 'resolve'}`)
      .then(() => {
        dispatch({ type: ADMIN_REPORTS_PATCH_SUCCESS, reports });
      }).catch(error => {
        dispatch({ type: ADMIN_REPORTS_PATCH_FAIL, error, reports });
      }),
    ));

const patchPleromaReports = (reports: { id: string, state: string }[]) =>
  (dispatch: AppDispatch, getState: () => RootState) =>
    api(getState)
      .patch('/api/v1/pleroma/admin/reports', { reports })
      .then(() => {
        dispatch({ type: ADMIN_REPORTS_PATCH_SUCCESS, reports });
      }).catch(error => {
        dispatch({ type: ADMIN_REPORTS_PATCH_FAIL, error, reports });
      });

const patchReports = (ids: string[], reportState: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();

    const instance = state.instance;
    const features = getFeatures(instance);

    const reports = ids.map(id => ({ id, state: reportState }));

    dispatch({ type: ADMIN_REPORTS_PATCH_REQUEST, reports });

    if (features.mastodonAdmin) {
      return dispatch(patchMastodonReports(reports));
    } else {
      return dispatch(patchPleromaReports(reports));
    }
  };

const closeReports = (ids: string[]) =>
  patchReports(ids, 'closed');

const fetchMastodonUsers = (filters: string[], page: number, query: string | null | undefined, pageSize: number, next?: string | null) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const params: Record<string, any> = {
      username: query,
    };

    if (filters.includes('local')) params.local = true;
    if (filters.includes('active')) params.active = true;
    if (filters.includes('need_approval')) params.pending = true;

    return api(getState)
      .get(next || '/api/v1/admin/accounts', { params })
      .then(({ data: accounts, ...response }) => {
        const next = getLinks(response as AxiosResponse<any, any>).refs.find(link => link.rel === 'next');

        const count = next
          ? page * pageSize + 1
          : (page - 1) * pageSize + accounts.length;

        dispatch(importFetchedAccounts(accounts.map(({ account }: APIEntity) => account)));
        dispatch(fetchRelationships(accounts.map((account: APIEntity) => account.id)));
        dispatch({ type: ADMIN_USERS_FETCH_SUCCESS, users: accounts, count, pageSize, filters, page, next: next?.uri || false });
        return { users: accounts, count, pageSize, next: next?.uri || false };
      }).catch(error =>
        dispatch({ type: ADMIN_USERS_FETCH_FAIL, error, filters, page, pageSize }),
      );
  };

const fetchPleromaUsers = (filters: string[], page: number, query?: string | null, pageSize?: number) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const params: Record<string, any> = { filters: filters.join(), page, page_size: pageSize };
    if (query) params.query = query;

    return api(getState)
      .get('/api/v1/pleroma/admin/users', { params })
      .then(({ data: { users, count, page_size: pageSize } }) => {
        dispatch(fetchRelationships(users.map((user: APIEntity) => user.id)));
        dispatch({ type: ADMIN_USERS_FETCH_SUCCESS, users, count, pageSize, filters, page });
        return { users, count, pageSize };
      }).catch(error =>
        dispatch({ type: ADMIN_USERS_FETCH_FAIL, error, filters, page, pageSize }),
      );
  };

const fetchUsers = (filters: string[] = [], page = 1, query?: string | null, pageSize = 50, next?: string | null) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();

    const instance = state.instance;
    const features = getFeatures(instance);

    dispatch({ type: ADMIN_USERS_FETCH_REQUEST, filters, page, pageSize });

    if (features.mastodonAdmin) {
      return dispatch(fetchMastodonUsers(filters, page, query, pageSize, next));
    } else {
      return dispatch(fetchPleromaUsers(filters, page, query, pageSize));
    }
  };

const deactivateMastodonUsers = (accountIds: string[], reportId?: string) =>
  (dispatch: AppDispatch, getState: () => RootState) =>
    Promise.all(accountIds.map(accountId => {
      api(getState)
        .post(`/api/v1/admin/accounts/${accountId}/action`, {
          type: 'disable',
          report_id: reportId,
        })
        .then(() => {
          dispatch({ type: ADMIN_USERS_DEACTIVATE_SUCCESS, accountIds: [accountId] });
        }).catch(error => {
          dispatch({ type: ADMIN_USERS_DEACTIVATE_FAIL, error, accountIds: [accountId] });
        });
    }));

const deactivatePleromaUsers = (accountIds: string[]) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const nicknames = nicknamesFromIds(getState, accountIds);
    return api(getState)
      .patch('/api/v1/pleroma/admin/users/deactivate', { nicknames })
      .then(({ data: { users } }) => {
        dispatch({ type: ADMIN_USERS_DEACTIVATE_SUCCESS, users, accountIds });
      }).catch(error => {
        dispatch({ type: ADMIN_USERS_DEACTIVATE_FAIL, error, accountIds });
      });
  };

const deactivateUsers = (accountIds: string[], reportId?: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();

    const instance = state.instance;
    const features = getFeatures(instance);

    dispatch({ type: ADMIN_USERS_DEACTIVATE_REQUEST, accountIds });

    if (features.mastodonAdmin) {
      return dispatch(deactivateMastodonUsers(accountIds, reportId));
    } else {
      return dispatch(deactivatePleromaUsers(accountIds));
    }
  };

const deleteUsers = (accountIds: string[]) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const nicknames = nicknamesFromIds(getState, accountIds);
    dispatch({ type: ADMIN_USERS_DELETE_REQUEST, accountIds });
    return api(getState)
      .delete('/api/v1/pleroma/admin/users', { data: { nicknames } })
      .then(({ data: nicknames }) => {
        dispatch({ type: ADMIN_USERS_DELETE_SUCCESS, nicknames, accountIds });
      }).catch(error => {
        dispatch({ type: ADMIN_USERS_DELETE_FAIL, error, accountIds });
      });
  };

const approveMastodonUsers = (accountIds: string[]) =>
  (dispatch: AppDispatch, getState: () => RootState) =>
    Promise.all(accountIds.map(accountId => {
      api(getState)
        .post(`/api/v1/admin/accounts/${accountId}/approve`)
        .then(({ data: user }) => {
          dispatch({ type: ADMIN_USERS_APPROVE_SUCCESS, users: [user], accountIds: [accountId] });
        }).catch(error => {
          dispatch({ type: ADMIN_USERS_APPROVE_FAIL, error, accountIds: [accountId] });
        });
    }));

const approvePleromaUsers = (accountIds: string[]) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const nicknames = nicknamesFromIds(getState, accountIds);
    return api(getState)
      .patch('/api/v1/pleroma/admin/users/approve', { nicknames })
      .then(({ data: { users } }) => {
        dispatch({ type: ADMIN_USERS_APPROVE_SUCCESS, users, accountIds });
      }).catch(error => {
        dispatch({ type: ADMIN_USERS_APPROVE_FAIL, error, accountIds });
      });
  };

const approveUsers = (accountIds: string[]) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();

    const instance = state.instance;
    const features = getFeatures(instance);

    dispatch({ type: ADMIN_USERS_APPROVE_REQUEST, accountIds });

    if (features.mastodonAdmin) {
      return dispatch(approveMastodonUsers(accountIds));
    } else {
      return dispatch(approvePleromaUsers(accountIds));
    }
  };

const deleteStatus = (id: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: ADMIN_STATUS_DELETE_REQUEST, id });
    return api(getState)
      .delete(`/api/v1/pleroma/admin/statuses/${id}`)
      .then(() => {
        dispatch({ type: ADMIN_STATUS_DELETE_SUCCESS, id });
      }).catch(error => {
        dispatch({ type: ADMIN_STATUS_DELETE_FAIL, error, id });
      });
  };

const toggleStatusSensitivity = (id: string, sensitive: boolean) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: ADMIN_STATUS_TOGGLE_SENSITIVITY_REQUEST, id });
    return api(getState)
      .put(`/api/v1/pleroma/admin/statuses/${id}`, { sensitive: !sensitive })
      .then(() => {
        dispatch({ type: ADMIN_STATUS_TOGGLE_SENSITIVITY_SUCCESS, id });
      }).catch(error => {
        dispatch({ type: ADMIN_STATUS_TOGGLE_SENSITIVITY_FAIL, error, id });
      });
  };

const fetchModerationLog = (params?: Record<string, any>) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: ADMIN_LOG_FETCH_REQUEST });
    return api(getState)
      .get('/api/v1/pleroma/admin/moderation_log', { params })
      .then(({ data }) => {
        dispatch({ type: ADMIN_LOG_FETCH_SUCCESS, items: data.items, total: data.total });
        return data;
      }).catch(error => {
        dispatch({ type: ADMIN_LOG_FETCH_FAIL, error });
      });
  };

const tagUsers = (accountIds: string[], tags: string[]) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
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

const untagUsers = (accountIds: string[], tags: string[]) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
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

const verifyUser = (accountId: string) =>
  (dispatch: AppDispatch) =>
    dispatch(tagUsers([accountId], ['verified']));

const unverifyUser = (accountId: string) =>
  (dispatch: AppDispatch) =>
    dispatch(untagUsers([accountId], ['verified']));

const setDonor = (accountId: string) =>
  (dispatch: AppDispatch) =>
    dispatch(tagUsers([accountId], ['donor']));

const removeDonor = (accountId: string) =>
  (dispatch: AppDispatch) =>
    dispatch(untagUsers([accountId], ['donor']));

const addPermission = (accountIds: string[], permissionGroup: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
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

const removePermission = (accountIds: string[], permissionGroup: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
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

const promoteToAdmin = (accountId: string) =>
  (dispatch: AppDispatch) =>
    Promise.all([
      dispatch(addPermission([accountId], 'admin')),
      dispatch(removePermission([accountId], 'moderator')),
    ]);

const promoteToModerator = (accountId: string) =>
  (dispatch: AppDispatch) =>
    Promise.all([
      dispatch(removePermission([accountId], 'admin')),
      dispatch(addPermission([accountId], 'moderator')),
    ]);

const demoteToUser = (accountId: string) =>
  (dispatch: AppDispatch) =>
    Promise.all([
      dispatch(removePermission([accountId], 'admin')),
      dispatch(removePermission([accountId], 'moderator')),
    ]);

const suggestUsers = (accountIds: string[]) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const nicknames = nicknamesFromIds(getState, accountIds);
    dispatch({ type: ADMIN_USERS_SUGGEST_REQUEST, accountIds });
    return api(getState)
      .patch('/api/v1/pleroma/admin/users/suggest', { nicknames })
      .then(({ data: { users } }) => {
        dispatch({ type: ADMIN_USERS_SUGGEST_SUCCESS, users, accountIds });
      }).catch(error => {
        dispatch({ type: ADMIN_USERS_SUGGEST_FAIL, error, accountIds });
      });
  };

const unsuggestUsers = (accountIds: string[]) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const nicknames = nicknamesFromIds(getState, accountIds);
    dispatch({ type: ADMIN_USERS_UNSUGGEST_REQUEST, accountIds });
    return api(getState)
      .patch('/api/v1/pleroma/admin/users/unsuggest', { nicknames })
      .then(({ data: { users } }) => {
        dispatch({ type: ADMIN_USERS_UNSUGGEST_SUCCESS, users, accountIds });
      }).catch(error => {
        dispatch({ type: ADMIN_USERS_UNSUGGEST_FAIL, error, accountIds });
      });
  };

export {
  ADMIN_CONFIG_FETCH_REQUEST,
  ADMIN_CONFIG_FETCH_SUCCESS,
  ADMIN_CONFIG_FETCH_FAIL,
  ADMIN_CONFIG_UPDATE_REQUEST,
  ADMIN_CONFIG_UPDATE_SUCCESS,
  ADMIN_CONFIG_UPDATE_FAIL,
  ADMIN_REPORTS_FETCH_REQUEST,
  ADMIN_REPORTS_FETCH_SUCCESS,
  ADMIN_REPORTS_FETCH_FAIL,
  ADMIN_REPORTS_PATCH_REQUEST,
  ADMIN_REPORTS_PATCH_SUCCESS,
  ADMIN_REPORTS_PATCH_FAIL,
  ADMIN_USERS_FETCH_REQUEST,
  ADMIN_USERS_FETCH_SUCCESS,
  ADMIN_USERS_FETCH_FAIL,
  ADMIN_USERS_DELETE_REQUEST,
  ADMIN_USERS_DELETE_SUCCESS,
  ADMIN_USERS_DELETE_FAIL,
  ADMIN_USERS_APPROVE_REQUEST,
  ADMIN_USERS_APPROVE_SUCCESS,
  ADMIN_USERS_APPROVE_FAIL,
  ADMIN_USERS_DEACTIVATE_REQUEST,
  ADMIN_USERS_DEACTIVATE_SUCCESS,
  ADMIN_USERS_DEACTIVATE_FAIL,
  ADMIN_STATUS_DELETE_REQUEST,
  ADMIN_STATUS_DELETE_SUCCESS,
  ADMIN_STATUS_DELETE_FAIL,
  ADMIN_STATUS_TOGGLE_SENSITIVITY_REQUEST,
  ADMIN_STATUS_TOGGLE_SENSITIVITY_SUCCESS,
  ADMIN_STATUS_TOGGLE_SENSITIVITY_FAIL,
  ADMIN_LOG_FETCH_REQUEST,
  ADMIN_LOG_FETCH_SUCCESS,
  ADMIN_LOG_FETCH_FAIL,
  ADMIN_USERS_TAG_REQUEST,
  ADMIN_USERS_TAG_SUCCESS,
  ADMIN_USERS_TAG_FAIL,
  ADMIN_USERS_UNTAG_REQUEST,
  ADMIN_USERS_UNTAG_SUCCESS,
  ADMIN_USERS_UNTAG_FAIL,
  ADMIN_ADD_PERMISSION_GROUP_REQUEST,
  ADMIN_ADD_PERMISSION_GROUP_SUCCESS,
  ADMIN_ADD_PERMISSION_GROUP_FAIL,
  ADMIN_REMOVE_PERMISSION_GROUP_REQUEST,
  ADMIN_REMOVE_PERMISSION_GROUP_SUCCESS,
  ADMIN_REMOVE_PERMISSION_GROUP_FAIL,
  ADMIN_USERS_SUGGEST_REQUEST,
  ADMIN_USERS_SUGGEST_SUCCESS,
  ADMIN_USERS_SUGGEST_FAIL,
  ADMIN_USERS_UNSUGGEST_REQUEST,
  ADMIN_USERS_UNSUGGEST_SUCCESS,
  ADMIN_USERS_UNSUGGEST_FAIL,
  fetchConfig,
  updateConfig,
  fetchReports,
  closeReports,
  fetchUsers,
  deactivateUsers,
  deleteUsers,
  approveUsers,
  deleteStatus,
  toggleStatusSensitivity,
  fetchModerationLog,
  tagUsers,
  untagUsers,
  verifyUser,
  unverifyUser,
  setDonor,
  removeDonor,
  addPermission,
  removePermission,
  promoteToAdmin,
  promoteToModerator,
  demoteToUser,
  suggestUsers,
  unsuggestUsers,
};
