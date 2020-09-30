import {
  AUTH_LOGGED_OUT,
  logOut,
} from '../auth';
import { ALERT_SHOW } from '../alerts';
import { Map as ImmutableMap } from 'immutable';
import { mockStore } from 'soapbox/test_helpers';

describe('logOut()', () => {
  it('creates expected actions', () => {
    const expectedActions = [
      { type: AUTH_LOGGED_OUT },
      { type: ALERT_SHOW, message: 'Logged out.', severity: 'success' },
    ];
    const store = mockStore(ImmutableMap());

    store.dispatch(logOut());
    return expect(store.getActions()).toEqual(expectedActions);
  });
});
