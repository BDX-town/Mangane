import { getFeatures } from 'soapbox/utils/features';

import api from '../api';

import type { AppDispatch, RootState } from 'soapbox/store';

const noOp = (e: any) => {};

const fetchMedia = (mediaId: string) =>
  (dispatch: any, getState: () => RootState) => {
    return api(getState).get(`/api/v1/media/${mediaId}`);
  };

const updateMedia = (mediaId: string, params: Record<string, any>) =>
  (dispatch: any, getState: () => RootState) => {
    return api(getState).put(`/api/v1/media/${mediaId}`, params);
  };

const uploadMediaV1 = (data: FormData, onUploadProgress = noOp) =>
  (dispatch: any, getState: () => RootState) =>
    api(getState).post('/api/v1/media', data, {
      onUploadProgress: onUploadProgress,
    });

const uploadMediaV2 = (data: FormData, onUploadProgress = noOp) =>
  (dispatch: any, getState: () => RootState) =>
    api(getState).post('/api/v2/media', data, {
      onUploadProgress: onUploadProgress,
    });

const uploadMedia = (data: FormData, onUploadProgress = noOp) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const instance = state.instance;
    const features = getFeatures(instance);

    if (features.mediaV2) {
      return dispatch(uploadMediaV2(data, onUploadProgress));
    } else {
      return dispatch(uploadMediaV1(data, onUploadProgress));
    }
  };

export {
  fetchMedia,
  updateMedia,
  uploadMediaV1,
  uploadMediaV2,
  uploadMedia,
};
