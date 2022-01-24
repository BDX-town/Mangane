import { get } from 'lodash';

import KVStore from 'soapbox/storage/kv_store';
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

const getMeUrl = state => {
  const me = state.get('me');
  return state.getIn(['accounts', me, 'url']);
};

// Figure out the appropriate instance to fetch depending on the state
export const getHost = state => {
  const accountUrl = getMeUrl(state) || getAuthUserUrl(state);

  try {
    return new URL(accountUrl).host;
  } catch {
    return null;
  }
};

export function rememberInstance(host) {
  return (dispatch, getState) => {
    dispatch({ type: INSTANCE_REMEMBER_REQUEST, host });
    return KVStore.getItemOrError(`instance:${host}`).then(instance => {
      dispatch({ type: INSTANCE_REMEMBER_SUCCESS, host, instance });
      return instance;
    }).catch(error => {
      dispatch({ type: INSTANCE_REMEMBER_FAIL, host, error, skipAlert: true });
    });
  };
}

// We may need to fetch nodeinfo on Pleroma < 2.1
const needsNodeinfo = instance => {
  const v = parseVersion(get(instance, 'version'));
  return v.software === 'Pleroma' && !get(instance, ['pleroma', 'metadata']);
};

export function fetchInstance() {
  return (dispatch, getState) => {
    dispatch({ type: INSTANCE_FETCH_REQUEST });
    return api(getState).get('/api/v1/instance').then(({ data: instance }) => {
      dispatch({ type: INSTANCE_FETCH_SUCCESS, instance });
      if (needsNodeinfo(instance)) {
        dispatch(fetchNodeinfo()); // Pleroma < 2.1 backwards compatibility
      }
    }).catch(error => {
      dispatch({ type: INSTANCE_FETCH_FAIL, error, skipAlert: true });
    });
  };
}

// Tries to remember the instance from browser storage before fetching it
export function loadInstance() {
  return (dispatch, getState) => {
    const host = getHost(getState());

    return dispatch(rememberInstance(host)).finally(() => {
      return dispatch(fetchInstance());
    });
  };
}

export function fetchNodeinfo() {
  return (dispatch, getState) => {
    dispatch({ type: NODEINFO_FETCH_REQUEST });
    api(getState).get('/nodeinfo/2.1.json').then(({ data: nodeinfo }) => {
      dispatch({ type: NODEINFO_FETCH_SUCCESS, nodeinfo });
    }).catch(error => {
      dispatch({ type: NODEINFO_FETCH_FAIL, error, skipAlert: true });
    });
  };
}
