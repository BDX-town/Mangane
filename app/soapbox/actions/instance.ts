import { get } from 'lodash';
import { AnyAction } from 'redux';

import KVStore from 'soapbox/storage/kv_store';
import { AppDispatch, RootState } from 'soapbox/store';
import { getAuthUserUrl } from 'soapbox/utils/auth';
import { parseVersion } from 'soapbox/utils/features';

import api from '../api';

export const INSTANCE_FETCH_REQUEST = 'INSTANCE_FETCH_REQUEST';
export const INSTANCE_FETCH_SUCCESS = 'INSTANCE_FETCH_SUCCESS';
export const INSTANCE_FETCH_FAIL    = 'INSTANCE_FETCH_FAIL';

export const INSTANCE_REMEMBER_REQUEST = 'INSTANCE_REMEMBER_REQUEST';
export const INSTANCE_REMEMBER_SUCCESS = 'INSTANCE_REMEMBER_SUCCESS';
export const INSTANCE_REMEMBER_FAIL    = 'INSTANCE_REMEMBER_FAIL';

export const NODEINFO_FETCH_REQUEST = 'NODEINFO_FETCH_REQUEST';
export const NODEINFO_FETCH_SUCCESS = 'NODEINFO_FETCH_SUCCESS';
export const NODEINFO_FETCH_FAIL    = 'NODEINFO_FETCH_FAIL';

const getMeUrl = (state: RootState) => {
  const me = state.me;
  return state.accounts.getIn([me, 'url']);
};

// Figure out the appropriate instance to fetch depending on the state
export const getHost = (state: RootState) => {
  const accountUrl = getMeUrl(state) || getAuthUserUrl(state);

  try {
    return new URL(accountUrl).host;
  } catch {
    return null;
  }
};

export function rememberInstance(host: string) {
  return (dispatch: AppDispatch, _getState: () => RootState): AnyAction => {
    dispatch({ type: INSTANCE_REMEMBER_REQUEST, host });
    return KVStore.getItemOrError(`instance:${host}`).then((instance: Record<string, any>) => {
      dispatch({ type: INSTANCE_REMEMBER_SUCCESS, host, instance });
      return instance;
    }).catch((error: Error) => {
      dispatch({ type: INSTANCE_REMEMBER_FAIL, host, error, skipAlert: true });
    });
  };
}

// We may need to fetch nodeinfo on Pleroma < 2.1
const needsNodeinfo = (instance: Record<string, any>): boolean => {
  const v = parseVersion(get(instance, 'version'));
  return v.software === 'Pleroma' && !get(instance, ['pleroma', 'metadata']);
};

export function fetchInstance() {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: INSTANCE_FETCH_REQUEST });
    return api(getState).get('/api/v1/instance').then(({ data: instance }: { data: Record<string, any> }) => {
      dispatch({ type: INSTANCE_FETCH_SUCCESS, instance });
      if (needsNodeinfo(instance)) {
        dispatch(fetchNodeinfo()); // Pleroma < 2.1 backwards compatibility
      }
    }).catch(error => {
      console.error(error);
      dispatch({ type: INSTANCE_FETCH_FAIL, error, skipAlert: true });
    });
  };
}

// Tries to remember the instance from browser storage before fetching it
export function loadInstance() {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const host = getHost(getState());

    return dispatch(rememberInstance(host)).finally(() => {
      return dispatch(fetchInstance());
    });
  };
}

export function fetchNodeinfo() {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: NODEINFO_FETCH_REQUEST });
    return api(getState).get('/nodeinfo/2.1.json').then(({ data: nodeinfo }) => {
      return dispatch({ type: NODEINFO_FETCH_SUCCESS, nodeinfo });
    }).catch((error: Error) => {
      return dispatch({ type: NODEINFO_FETCH_FAIL, error, skipAlert: true });
    });
  };
}
