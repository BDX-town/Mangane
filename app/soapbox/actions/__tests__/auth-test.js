import {
  AUTH_LOGGED_OUT,
  logOut,
} from '../auth';
import { ALERT_SHOW } from '../alerts';
import { Map as ImmutableMap } from 'immutable';
import { mockStore } from 'soapbox/test_setup';

describe('logOut()', () => {
  it('creates expected actions', () => {
    const expectedActions = [
      { type: AUTH_LOGGED_OUT },
      { type: ALERT_SHOW, title: 'Successfully logged out.', message: '' },
    ];
    const store = mockStore(ImmutableMap());

    store.dispatch(logOut());
    return expect(store.getActions()).toEqual(expectedActions);
  });
});
