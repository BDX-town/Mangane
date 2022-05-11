import { Map as ImmutableMap, fromJS } from 'immutable';

import {
  PEPE_FETCH_INSTANCE_SUCCESS,
  FETCH_CHALLENGES_SUCCESS,
  FETCH_TOKEN_SUCCESS,
  SET_CHALLENGES_COMPLETE,
  SET_LOADING,
  SET_NEXT_CHALLENGE,
} from '../actions/verification';

const initialState = ImmutableMap({
  ageMinimum: null,
  currentChallenge: null,
  isLoading: false,
  isComplete: false,
  token: null,
  instance: ImmutableMap(),
});

export default function verification(state = initialState, action) {
  switch (action.type) {
    case PEPE_FETCH_INSTANCE_SUCCESS:
      return state.set('instance', fromJS(action.instance));
    case FETCH_CHALLENGES_SUCCESS:
      return state
        .set('ageMinimum', action.ageMinimum)
        .set('currentChallenge', action.currentChallenge)
        .set('isLoading', false)
        .set('isComplete', action.isComplete);
    case FETCH_TOKEN_SUCCESS:
      return state
        .set('isLoading', false)
        .set('token', action.value);
    case SET_CHALLENGES_COMPLETE:
      return state
        .set('isLoading', false)
        .set('isComplete', true);
    case SET_NEXT_CHALLENGE:
      return state
        .set('currentChallenge', action.challenge)
        .set('isLoading', false);
    case SET_LOADING:
      return state.set('isLoading', typeof action.value === 'boolean' ? action.value : true);
    default:
      return state;
  }
}
