import api from '../api';
import { isLoggedIn } from 'soapbox/utils/auth';

export const GROUP_CREATE_REQUEST      = 'GROUP_CREATE_REQUEST';
export const GROUP_CREATE_SUCCESS      = 'GROUP_CREATE_SUCCESS';
export const GROUP_CREATE_FAIL         = 'GROUP_CREATE_FAIL';

export const GROUP_UPDATE_REQUEST      = 'GROUP_UPDATE_REQUEST';
export const GROUP_UPDATE_SUCCESS      = 'GROUP_UPDATE_SUCCESS';
export const GROUP_UPDATE_FAIL         = 'GROUP_UPDATE_FAIL';

export const GROUP_EDITOR_VALUE_CHANGE = 'GROUP_EDITOR_VALUE_CHANGE';
export const GROUP_EDITOR_RESET        = 'GROUP_EDITOR_RESET';
export const GROUP_EDITOR_SETUP        = 'GROUP_EDITOR_SETUP';

export const submit = (routerHistory) => (dispatch, getState) => {
  const groupId = getState().getIn(['group_editor', 'groupId']);
  const title = getState().getIn(['group_editor', 'title']);
  const description = getState().getIn(['group_editor', 'description']);
  const coverImage = getState().getIn(['group_editor', 'coverImage']);

  if (groupId === null) {
    dispatch(create(title, description, coverImage, routerHistory));
  } else {
    dispatch(update(groupId, title, description, coverImage, routerHistory));
  }
};


export const create = (title, description, coverImage, routerHistory) => (dispatch, getState) => {
  if (!isLoggedIn(getState)) return;

  dispatch(createRequest());

  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);

  if (coverImage !== null) {
    formData.append('cover_image', coverImage);
  }

  api(getState).post('/api/v1/groups', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(({ data }) => {
    dispatch(createSuccess(data));
    routerHistory.push(`/groups/${data.id}`);
  }).catch(err => dispatch(createFail(err)));
};


export const createRequest = id => ({
  type: GROUP_CREATE_REQUEST,
  id,
});

export const createSuccess = group => ({
  type: GROUP_CREATE_SUCCESS,
  group,
});

export const createFail = error => ({
  type: GROUP_CREATE_FAIL,
  error,
});

export const update = (groupId, title, description, coverImage, routerHistory) => (dispatch, getState) => {
  if (!isLoggedIn(getState)) return;

  dispatch(updateRequest());

  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);

  if (coverImage !== null) {
    formData.append('cover_image', coverImage);
  }

  api(getState).put(`/api/v1/groups/${groupId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(({ data }) => {
    dispatch(updateSuccess(data));
    routerHistory.push(`/groups/${data.id}`);
  }).catch(err => dispatch(updateFail(err)));
};


export const updateRequest = id => ({
  type: GROUP_UPDATE_REQUEST,
  id,
});

export const updateSuccess = group => ({
  type: GROUP_UPDATE_SUCCESS,
  group,
});

export const updateFail = error => ({
  type: GROUP_UPDATE_FAIL,
  error,
});

export const changeValue = (field, value) => ({
  type: GROUP_EDITOR_VALUE_CHANGE,
  field,
  value,
});

export const reset = () => ({
  type: GROUP_EDITOR_RESET,
});

export const setUp = (group) => ({
  type: GROUP_EDITOR_SETUP,
  group,
});
