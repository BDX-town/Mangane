import api from '../api';
import { get } from 'lodash';
import { parseVersion } from 'soapbox/utils/features';

export const INSTANCE_FETCH_SUCCESS = 'INSTANCE_FETCH_SUCCESS';
export const INSTANCE_FETCH_FAIL    = 'INSTANCE_FETCH_FAIL';
export const NODEINFO_FETCH_SUCCESS = 'NODEINFO_FETCH_SUCCESS';
export const NODEINFO_FETCH_FAIL    = 'NODEINFO_FETCH_FAIL';

export function fetchInstance() {
  return (dispatch, getState) => {
    return api(getState).get('/api/v1/instance').then(response => {
      dispatch(importInstance(response.data));
      const v = parseVersion(get(response.data, 'version'));
      if (v.software === 'Pleroma' && !get(response.data, ['pleroma', 'metadata'])) {
        dispatch(fetchNodeinfo()); // Pleroma < 2.1 backwards compatibility
      }
    }).catch(error => {
      dispatch(instanceFail(error));
    });
  };
}

export function fetchNodeinfo() {
  return (dispatch, getState) => {
    api(getState).get('/nodeinfo/2.1.json').then(response => {
      dispatch(importNodeinfo(response.data));
    }).catch(error => {
      dispatch(nodeinfoFail(error));
    });
  };
}

export function importInstance(instance) {
  return {
    type: INSTANCE_FETCH_SUCCESS,
    instance,
  };
}

export function instanceFail(error) {
  return {
    type: INSTANCE_FETCH_FAIL,
    error,
    skipAlert: true,
  };
}

export function importNodeinfo(nodeinfo) {
  return {
    type: NODEINFO_FETCH_SUCCESS,
    nodeinfo,
  };
}

export function nodeinfoFail(error) {
  return {
    type: NODEINFO_FETCH_FAIL,
    error,
    skipAlert: true,
  };
}
