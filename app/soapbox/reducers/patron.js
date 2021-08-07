import {
  PATRON_INSTANCE_FETCH_SUCCESS,
  PATRON_ACCOUNT_FETCH_SUCCESS,
} from '../actions/patron';
import { Map as ImmutableMap, fromJS } from 'immutable';

const initialState = ImmutableMap();

const normalizePatronAccount = (state, account) => {
  const normalized = fromJS(account).deleteAll(['url']);
  return state.setIn(['accounts', account.url], normalized);
};

export default function patron(state = initialState, action) {
  switch(action.type) {
  case PATRON_INSTANCE_FETCH_SUCCESS:
    return state.set('instance', fromJS(action.instance));
  case PATRON_ACCOUNT_FETCH_SUCCESS:
    return normalizePatronAccount(state, action.account);
  default:
    return state;
  }
}
