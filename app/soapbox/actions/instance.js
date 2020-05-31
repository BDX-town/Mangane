import api from '../api';
import { get } from 'lodash';
import { parseVersion } from 'soapbox/utils/features';

export const INSTANCE_IMPORT = 'INSTANCE_IMPORT';
export const INSTANCE_FAIL   = 'INSTANCE_FAIL';
export const NODEINFO_IMPORT = 'NODEINFO_IMPORT';
export const NODEINFO_FAIL   = 'NODEINFO_FAIL';

export function fetchInstance() {
  return (dispatch, getState) => {
    api(getState).get('/api/v1/instance').then(response => {
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
    type: INSTANCE_IMPORT,
    instance,
  };
}

export function instanceFail(error) {
  return {
    type: INSTANCE_FAIL,
    error,
    skipAlert: true,
  };
};

export function importNodeinfo(nodeinfo) {
  return {
    type: NODEINFO_IMPORT,
    nodeinfo,
  };
}

export function nodeinfoFail(error) {
  return {
    type: NODEINFO_FAIL,
    error,
    skipAlert: true,
  };
};
