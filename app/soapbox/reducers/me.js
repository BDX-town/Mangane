import {
  AUTH_LOGGED_OUT,
  AUTH_ACCOUNT_REMEMBER_SUCCESS,
  VERIFY_CREDENTIALS_SUCCESS,
} from '../actions/auth';
import {
  ME_FETCH_SUCCESS,
  ME_FETCH_FAIL,
  ME_FETCH_SKIP,
  ME_PATCH_SUCCESS,
} from '../actions/me';

const initialState = null;

const handleForbidden = (state, error) => {
  if (error.response && [401, 403].includes(error.response.status)) {
    return false;
  } else {
    return state;
  }
};

export default function me(state = initialState, action) {
  switch(action.type) {
  case ME_FETCH_SUCCESS:
  case ME_PATCH_SUCCESS:
    return action.me.id;
  case VERIFY_CREDENTIALS_SUCCESS:
  case AUTH_ACCOUNT_REMEMBER_SUCCESS:
    return state || action.account.id;
  case ME_FETCH_SKIP:
  case AUTH_LOGGED_OUT:
    return false;
  case ME_FETCH_FAIL:
    return handleForbidden(state, action.error);
  default:
    return state;
  }
}
