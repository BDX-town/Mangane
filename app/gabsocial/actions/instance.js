import api from '../api';

export const INSTANCE_IMPORT  = 'INSTANCE_IMPORT';
export const INSTANCE_FAIL    = 'INSTANCE_FAIL';

export function fetchInstance() {
  return (dispatch, getState) => {
    api(getState).get(`/api/v1/instance`).then(response => {
      dispatch(importInstance(response.data));
    }).catch(error => {
      dispatch(instanceFail(error));
    });
  };
}

export function importInstance(instance) {
  return {
    type: INSTANCE_IMPORT,
    instance
  };
}

export function instanceFail(error) {
  return {
    type: INSTANCE_FAIL,
    error,
    skipAlert: true,
  };
};
