import { isLoggedIn } from 'soapbox/utils/auth';
import { getFeatures } from 'soapbox/utils/features';

import api, { getNextLink } from '../api';

import type { AppDispatch, RootState } from 'soapbox/store';

const TAG_FETCH_REQUEST = 'TAG_FETCH_REQUEST';
const TAG_FETCH_SUCCESS = 'TAG_FETCH_SUCCESS';
const TAG_FETCH_FAIL = 'TAG_FETCH_FAIL';

const TAG_FOLLOW_REQUEST = 'TAG_FOLLOW_REQUEST';
const TAG_FOLLOW_SUCCESS = 'TAG_FOLLOW_SUCCESS';
const TAG_FOLLOW_FAIL = 'TAG_FOLLOW_FAIL';

const TAG_UNFOLLOW_REQUEST = 'TAG_UNFOLLOW_REQUEST';
const TAG_UNFOLLOW_SUCCESS = 'TAG_UNFOLLOW_SUCCESS';
const TAG_UNFOLLOW_FAIL = 'TAG_UNFOLLOW_FAIL';

const fetchTags = () => async(dispatch: AppDispatch, getState: () => RootState) => {
  if (!isLoggedIn(getState)) return;

  const state = getState();
  const instance = state.instance;
  const features = getFeatures(instance);

  if (!features.followTags) return;

  dispatch({ type: TAG_FETCH_REQUEST, skipLoading: true });

  try {
    let next = null;
    let tags = [];
    do {
      const response = await api(getState).get(next || '/api/v1/followed_tags');
      tags = [...tags, ...response.data];
      next = getNextLink(response);
    } while (next);
    dispatch({
      type: TAG_FETCH_SUCCESS,
      tags,
      skipLoading: true,
    });
  } catch (err) {
    dispatch({
      type: TAG_FETCH_FAIL,
      err,
      skipLoading: true,
      skipAlert: true,
    });
  }
};

const followTag = (tagId: string) => async(dispatch: AppDispatch, getState: () => RootState) => {
  if (!isLoggedIn(getState)) return;

  const state = getState();
  const features = getFeatures(state.instance);

  if (!features.followTags) return;

  dispatch({ type: TAG_FOLLOW_REQUEST });

  try {
    const { data } = await api(getState).post(`/api/v1/tags/${tagId}/follow`);
    dispatch({
      type: TAG_FOLLOW_SUCCESS,
      tag: data,
    });

  } catch (err) {
    dispatch({
      type: TAG_FOLLOW_FAIL,
      err,
    });
  }
};

const unfollowTag = (tagId: string) => async(dispatch: AppDispatch, getState: () => RootState) => {
  if (!isLoggedIn(getState)) return;

  const state = getState();
  const features = getFeatures(state.instance);

  if (!features.followTags) return;

  dispatch({ type: TAG_UNFOLLOW_REQUEST });

  try {
    const { data } = await api(getState).post(`/api/v1/tags/${tagId}/unfollow`);
    dispatch({
      type: TAG_UNFOLLOW_SUCCESS,
      tag: data,
    });

  } catch (err) {
    dispatch({
      type: TAG_UNFOLLOW_FAIL,
      err,
    });
  }
};

export {
  fetchTags,
  TAG_FETCH_FAIL,
  TAG_FETCH_REQUEST,
  TAG_FETCH_SUCCESS,

  followTag,
  TAG_FOLLOW_FAIL,
  TAG_FOLLOW_REQUEST,
  TAG_FOLLOW_SUCCESS,

  unfollowTag,
  TAG_UNFOLLOW_FAIL,
  TAG_UNFOLLOW_REQUEST,
  TAG_UNFOLLOW_SUCCESS,
};