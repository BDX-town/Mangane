import { Map as ImmutableMap, Record as ImmutableRecord } from 'immutable';

import {
  Challenge,
  FETCH_CHALLENGES_SUCCESS,
  FETCH_TOKEN_SUCCESS,
  SET_CHALLENGES_COMPLETE,
  SET_LOADING,
  SET_NEXT_CHALLENGE,
} from 'soapbox/actions/verification';

import reducer from '../verification';

describe('verfication reducer', () => {
  it('returns the initial state', () => {
    expect(reducer(undefined, {} as any)).toMatchObject({
      ageMinimum: null,
      currentChallenge: null,
      isLoading: false,
      isComplete: false,
      token: null,
      instance: ImmutableMap(),
    });
  });

  describe('FETCH_CHALLENGES_SUCCESS', () => {
    it('sets the state', () => {
      const state = ImmutableRecord({
        ageMinimum: null,
        currentChallenge: null,
        isLoading: true,
        isComplete: null,
        token: null,
        instance: ImmutableMap<string, any>(),
      })();
      const action = {
        type: FETCH_CHALLENGES_SUCCESS,
        ageMinimum: 13,
        currentChallenge: 'email',
        isComplete: false,
      };
      const expected = {
        ageMinimum: 13,
        currentChallenge: 'email',
        isLoading: false,
        isComplete: false,
        token: null,
        instance: ImmutableMap(),
      };

      expect(reducer(state, action)).toMatchObject(expected);
    });
  });

  describe('FETCH_TOKEN_SUCCESS', () => {
    it('sets the state', () => {
      const state = ImmutableRecord({
        ageMinimum: null,
        currentChallenge: 'email' as Challenge,
        isLoading: true,
        isComplete: false,
        token: null,
        instance: ImmutableMap<string, any>(),
      })();
      const action = { type: FETCH_TOKEN_SUCCESS, value: '123' };
      const expected = {
        ageMinimum: null,
        currentChallenge: 'email',
        isLoading: false,
        isComplete: false,
        token: '123',
        instance: ImmutableMap(),
      };

      expect(reducer(state, action)).toMatchObject(expected);
    });
  });

  describe('SET_CHALLENGES_COMPLETE', () => {
    it('sets the state', () => {
      const state = ImmutableRecord({
        ageMinimum: null,
        currentChallenge: null,
        isLoading: true,
        isComplete: false,
        token: null,
        instance: ImmutableMap<string, any>(),
      })();
      const action = { type: SET_CHALLENGES_COMPLETE };
      const expected = {
        ageMinimum: null,
        currentChallenge: null,
        isLoading: false,
        isComplete: true,
        token: null,
        instance: ImmutableMap(),
      };

      expect(reducer(state, action)).toMatchObject(expected);
    });
  });

  describe('SET_NEXT_CHALLENGE', () => {
    it('sets the state', () => {
      const state = ImmutableRecord({
        ageMinimum: null,
        currentChallenge: null,
        isLoading: true,
        isComplete: false,
        token: null,
        instance: ImmutableMap<string, any>(),
      })();
      const action = {
        type: SET_NEXT_CHALLENGE,
        challenge: 'sms',
      };
      const expected = {
        ageMinimum: null,
        currentChallenge: 'sms',
        isLoading: false,
        isComplete: false,
        token: null,
        instance: ImmutableMap(),
      };

      expect(reducer(state, action)).toMatchObject(expected);
    });
  });

  describe('SET_LOADING with no value', () => {
    it('sets the state', () => {
      const state = ImmutableRecord({
        ageMinimum: null,
        currentChallenge: null,
        isLoading: false,
        isComplete: false,
        token: null,
        instance: ImmutableMap<string, any>(),
      })();
      const action = { type: SET_LOADING };
      const expected = {
        ageMinimum: null,
        currentChallenge: null,
        isLoading: true,
        isComplete: false,
        token: null,
        instance: ImmutableMap(),
      };

      expect(reducer(state, action)).toMatchObject(expected);
    });
  });

  describe('SET_LOADING with a value', () => {
    it('sets the state', () => {
      const state = ImmutableRecord({
        ageMinimum: null,
        currentChallenge: null,
        isLoading: true,
        isComplete: false,
        token: null,
        instance: ImmutableMap<string, any>(),
      })();
      const action = { type: SET_LOADING, value: false };
      const expected = {
        ageMinimum: null,
        currentChallenge: null,
        isLoading: false,
        isComplete: false,
        token: null,
        instance: ImmutableMap(),
      };

      expect(reducer(state, action)).toMatchObject(expected);
    });
  });
});
