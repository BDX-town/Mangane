import { Map as ImmutableMap } from 'immutable';

import { SET_LOADING } from 'soapbox/actions/verification';

import { FETCH_CHALLENGES_SUCCESS, FETCH_TOKEN_SUCCESS, SET_CHALLENGES_COMPLETE, SET_NEXT_CHALLENGE } from '../../actions/verification';
import reducer from '../verification';

describe('verfication reducer', () => {
  it('returns the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap({
      ageMinimum: null,
      currentChallenge: null,
      isLoading: false,
      isComplete: false,
      token: null,
      instance: ImmutableMap(),
    }));
  });

  describe('FETCH_CHALLENGES_SUCCESS', () => {
    it('sets the state', () => {
      const state = ImmutableMap({
        untouched: 'hello',
        ageMinimum: null,
        currentChallenge: null,
        isLoading: true,
        isComplete: null,
      });
      const action = {
        type: FETCH_CHALLENGES_SUCCESS,
        ageMinimum: 13,
        currentChallenge: 'email',
        isComplete: false,
      };
      const expected = ImmutableMap({
        untouched: 'hello',
        ageMinimum: 13,
        currentChallenge: 'email',
        isLoading: false,
        isComplete: false,
      });

      expect(reducer(state, action)).toEqual(expected);
    });
  });

  describe('FETCH_TOKEN_SUCCESS', () => {
    it('sets the state', () => {
      const state = ImmutableMap({
        isLoading: true,
        token: null,
      });
      const action = { type: FETCH_TOKEN_SUCCESS, value: '123' };
      const expected = ImmutableMap({
        isLoading: false,
        token: '123',
      });

      expect(reducer(state, action)).toEqual(expected);
    });
  });

  describe('SET_CHALLENGES_COMPLETE', () => {
    it('sets the state', () => {
      const state = ImmutableMap({
        isLoading: true,
        isComplete: false,
      });
      const action = { type: SET_CHALLENGES_COMPLETE };
      const expected = ImmutableMap({
        isLoading: false,
        isComplete: true,
      });

      expect(reducer(state, action)).toEqual(expected);
    });
  });

  describe('SET_NEXT_CHALLENGE', () => {
    it('sets the state', () => {
      const state = ImmutableMap({
        currentChallenge: null,
        isLoading: true,
      });
      const action = {
        type: SET_NEXT_CHALLENGE,
        challenge: 'sms',
      };
      const expected = ImmutableMap({
        currentChallenge: 'sms',
        isLoading: false,
      });

      expect(reducer(state, action)).toEqual(expected);
    });
  });

  describe('SET_LOADING with no value', () => {
    it('sets the state', () => {
      const state = ImmutableMap({ isLoading: false });
      const action = { type: SET_LOADING };
      const expected = ImmutableMap({ isLoading: true });

      expect(reducer(state, action)).toEqual(expected);
    });
  });

  describe('SET_LOADING with a value', () => {
    it('sets the state', () => {
      const state = ImmutableMap({ isLoading: true });
      const action = { type: SET_LOADING, value: false };
      const expected = ImmutableMap({ isLoading: false });

      expect(reducer(state, action)).toEqual(expected);
    });
  });
});
