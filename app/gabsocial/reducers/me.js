import { ME_FETCH_SUCCESS, ME_FETCH_FAIL, ME_FETCH_SKIP } from '../actions/me';
import { AUTH_LOGGED_OUT } from '../actions/auth';

const initialState = null;

export default function me(state = initialState, action) {
  switch(action.type) {
  case ME_FETCH_SUCCESS:
    return action.me.id;
  case ME_FETCH_FAIL:
    return false;
  case ME_FETCH_SKIP:
    return false;
  case AUTH_LOGGED_OUT:
    return false;
  default:
    return state;
  }
};
