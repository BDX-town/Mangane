import reducer from '../push_notifications';
import { Map as ImmutableMap } from 'immutable';

describe('push_notifications reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap({
      subscription: null,
      alerts: new ImmutableMap({
        follow: false,
        follow_request: false,
        favourite: false,
        reblog: false,
        mention: false,
        poll: false,
      }),
      isSubscribed: false,
      browserSupport: false,
    }));
  });
});
