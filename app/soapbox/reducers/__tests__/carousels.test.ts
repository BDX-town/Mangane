import { AnyAction } from 'redux';

import {
  CAROUSEL_AVATAR_REQUEST,
  CAROUSEL_AVATAR_SUCCESS,
  CAROUSEL_AVATAR_FAIL,
} from 'soapbox/actions/carousels';

import reducer from '../carousels';

describe('carousels reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {} as AnyAction)).toEqual({
      avatars: [],
      error: false,
      isLoading: false,
    });
  });

  describe('CAROUSEL_AVATAR_REQUEST', () => {
    it('sets "isLoading" to "true"', () => {
      const initialState = { isLoading: false, avatars: [] };
      const action = { type: CAROUSEL_AVATAR_REQUEST };
      expect(reducer(initialState, action).isLoading).toEqual(true);
    });
  });

  describe('CAROUSEL_AVATAR_SUCCESS', () => {
    it('sets the next state', () => {
      const initialState = { isLoading: true, avatars: [], error: false };
      const action = { type: CAROUSEL_AVATAR_SUCCESS, payload: [45] };
      const result = reducer(initialState, action);

      expect(result.isLoading).toEqual(false);
      expect(result.avatars).toEqual([45]);
      expect(result.error).toEqual(false);
    });
  });

  describe('CAROUSEL_AVATAR_FAIL', () => {
    it('sets "isLoading" to "true"', () => {
      const initialState = { isLoading: true, avatars: [] };
      const action = { type: CAROUSEL_AVATAR_FAIL };
      const result = reducer(initialState, action);

      expect(result.isLoading).toEqual(false);
      expect(result.error).toEqual(true);
    });
  });
});
