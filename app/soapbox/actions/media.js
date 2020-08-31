import api from '../api';

const noOp = () => {};

export function uploadMedia(data, onUploadProgress = noOp) {
  return function(dispatch, getState) {
    return api(getState).post('/api/v1/media', data, {
      onUploadProgress: onUploadProgress,
    });
  };
}
