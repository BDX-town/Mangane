import { Map as ImmutableMap } from 'immutable';

import reducer from '../push_notifications';

describe('push_notifications reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap({
      subscription: null,
      alerts: new ImmutableMap({
        follow: true,
        follow_request: true,
        favourite: true,
        reblog: true,
        mention: true,
        poll: true,
      }),
      isSubscribed: false,
      browserSupport: false,
    }));
  });
});
