import reducer from '../push_notifications';

describe('push_notifications reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {} as any).toJS()).toEqual({
      subscription: null,
      alerts: {
        follow: true,
        follow_request: true,
        favourite: true,
        reblog: true,
        mention: true,
        poll: true,
      },
      isSubscribed: false,
      browserSupport: false,
    });
  });
});
