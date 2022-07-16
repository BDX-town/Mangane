import api from 'soapbox/api';
import { getFeatures } from 'soapbox/utils/features';

import { importFetchedStatuses } from './importer';

import type { AxiosError } from 'axios';
import type { AppDispatch, RootState } from 'soapbox/store';
import type { APIEntity } from 'soapbox/types/entities';

export const ANNOUNCEMENTS_FETCH_REQUEST = 'ANNOUNCEMENTS_FETCH_REQUEST';
export const ANNOUNCEMENTS_FETCH_SUCCESS = 'ANNOUNCEMENTS_FETCH_SUCCESS';
export const ANNOUNCEMENTS_FETCH_FAIL    = 'ANNOUNCEMENTS_FETCH_FAIL';
export const ANNOUNCEMENTS_UPDATE        = 'ANNOUNCEMENTS_UPDATE';
export const ANNOUNCEMENTS_DELETE        = 'ANNOUNCEMENTS_DELETE';

export const ANNOUNCEMENTS_DISMISS_REQUEST = 'ANNOUNCEMENTS_DISMISS_REQUEST';
export const ANNOUNCEMENTS_DISMISS_SUCCESS = 'ANNOUNCEMENTS_DISMISS_SUCCESS';
export const ANNOUNCEMENTS_DISMISS_FAIL    = 'ANNOUNCEMENTS_DISMISS_FAIL';

export const ANNOUNCEMENTS_REACTION_ADD_REQUEST = 'ANNOUNCEMENTS_REACTION_ADD_REQUEST';
export const ANNOUNCEMENTS_REACTION_ADD_SUCCESS = 'ANNOUNCEMENTS_REACTION_ADD_SUCCESS';
export const ANNOUNCEMENTS_REACTION_ADD_FAIL    = 'ANNOUNCEMENTS_REACTION_ADD_FAIL';

export const ANNOUNCEMENTS_REACTION_REMOVE_REQUEST = 'ANNOUNCEMENTS_REACTION_REMOVE_REQUEST';
export const ANNOUNCEMENTS_REACTION_REMOVE_SUCCESS = 'ANNOUNCEMENTS_REACTION_REMOVE_SUCCESS';
export const ANNOUNCEMENTS_REACTION_REMOVE_FAIL    = 'ANNOUNCEMENTS_REACTION_REMOVE_FAIL';

export const ANNOUNCEMENTS_REACTION_UPDATE = 'ANNOUNCEMENTS_REACTION_UPDATE';

export const ANNOUNCEMENTS_TOGGLE_SHOW = 'ANNOUNCEMENTS_TOGGLE_SHOW';

const noOp = () => {};

export const fetchAnnouncements = (done = noOp) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const { instance } = getState();
    const features = getFeatures(instance);

    if (!features.announcements) return null;

    dispatch(fetchAnnouncementsRequest());

    return api(getState).get('/api/v1/announcements').then(response => {
      dispatch(fetchAnnouncementsSuccess(response.data));
      dispatch(importFetchedStatuses(response.data.map(({ statuses }: APIEntity) => statuses)));
    }).catch(error => {
      dispatch(fetchAnnouncementsFail(error));
    }).finally(() => {
      done();
    });
  };

export const fetchAnnouncementsRequest = () => ({
  type: ANNOUNCEMENTS_FETCH_REQUEST,
  skipLoading: true,
});

export const fetchAnnouncementsSuccess = (announcements: APIEntity) => ({
  type: ANNOUNCEMENTS_FETCH_SUCCESS,
  announcements,
  skipLoading: true,
});

export const fetchAnnouncementsFail = (error: AxiosError) => ({
  type: ANNOUNCEMENTS_FETCH_FAIL,
  error,
  skipLoading: true,
  skipAlert: true,
});

export const updateAnnouncements = (announcement: APIEntity) => ({
  type: ANNOUNCEMENTS_UPDATE,
  announcement: announcement,
});

export const dismissAnnouncement = (announcementId: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(dismissAnnouncementRequest(announcementId));

    return api(getState).post(`/api/v1/announcements/${announcementId}/dismiss`).then(() => {
      dispatch(dismissAnnouncementSuccess(announcementId));
    }).catch(error => {
      dispatch(dismissAnnouncementFail(announcementId, error));
    });
  };

export const dismissAnnouncementRequest = (announcementId: string) => ({
  type: ANNOUNCEMENTS_DISMISS_REQUEST,
  id: announcementId,
});

export const dismissAnnouncementSuccess = (announcementId: string) => ({
  type: ANNOUNCEMENTS_DISMISS_SUCCESS,
  id: announcementId,
});

export const dismissAnnouncementFail = (announcementId: string, error: AxiosError) => ({
  type: ANNOUNCEMENTS_DISMISS_FAIL,
  id: announcementId,
  error,
});

export const addReaction = (announcementId: string, name: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const announcement = getState().announcements.items.find(x => x.get('id') === announcementId);

    let alreadyAdded = false;

    if (announcement) {
      const reaction = announcement.reactions.find(x => x.name === name);

      if (reaction && reaction.me) {
        alreadyAdded = true;
      }
    }

    if (!alreadyAdded) {
      dispatch(addReactionRequest(announcementId, name, alreadyAdded));
    }

    return api(getState).put(`/api/v1/announcements/${announcementId}/reactions/${name}`).then(() => {
      dispatch(addReactionSuccess(announcementId, name, alreadyAdded));
    }).catch(err => {
      if (!alreadyAdded) {
        dispatch(addReactionFail(announcementId, name, err));
      }
    });
  };

export const addReactionRequest = (announcementId: string, name: string, alreadyAdded?: boolean) => ({
  type: ANNOUNCEMENTS_REACTION_ADD_REQUEST,
  id: announcementId,
  name,
  skipLoading: true,
});

export const addReactionSuccess = (announcementId: string, name: string, alreadyAdded?: boolean) => ({
  type: ANNOUNCEMENTS_REACTION_ADD_SUCCESS,
  id: announcementId,
  name,
  skipLoading: true,
});

export const addReactionFail = (announcementId: string, name: string, error: AxiosError) => ({
  type: ANNOUNCEMENTS_REACTION_ADD_FAIL,
  id: announcementId,
  name,
  error,
  skipLoading: true,
});

export const removeReaction = (announcementId: string, name: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(removeReactionRequest(announcementId, name));

    return api(getState).delete(`/api/v1/announcements/${announcementId}/reactions/${name}`).then(() => {
      dispatch(removeReactionSuccess(announcementId, name));
    }).catch(err => {
      dispatch(removeReactionFail(announcementId, name, err));
    });
  };

export const removeReactionRequest = (announcementId: string, name: string) => ({
  type: ANNOUNCEMENTS_REACTION_REMOVE_REQUEST,
  id: announcementId,
  name,
  skipLoading: true,
});

export const removeReactionSuccess = (announcementId: string, name: string) => ({
  type: ANNOUNCEMENTS_REACTION_REMOVE_SUCCESS,
  id: announcementId,
  name,
  skipLoading: true,
});

export const removeReactionFail = (announcementId: string, name: string, error: AxiosError) => ({
  type: ANNOUNCEMENTS_REACTION_REMOVE_FAIL,
  id: announcementId,
  name,
  error,
  skipLoading: true,
});

export const updateReaction = (reaction: APIEntity) => ({
  type: ANNOUNCEMENTS_REACTION_UPDATE,
  reaction,
});

export const toggleShowAnnouncements = () => ({
  type: ANNOUNCEMENTS_TOGGLE_SHOW,
});

export const deleteAnnouncement = (id: string) => ({
  type: ANNOUNCEMENTS_DELETE,
  id,
});
