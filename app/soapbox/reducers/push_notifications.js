import { SET_BROWSER_SUPPORT, SET_SUBSCRIPTION, CLEAR_SUBSCRIPTION, SET_ALERTS } from '../actions/push_notifications';
import { Map as ImmutableMap } from 'immutable';

const initialState = ImmutableMap({
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
});

export default function push_subscriptions(state = initialState, action) {
  switch(action.type) {
  case SET_SUBSCRIPTION:
    return state
      .set('subscription', new ImmutableMap({
        id: action.subscription.id,
        endpoint: action.subscription.endpoint,
      }))
      .set('alerts', new ImmutableMap(action.subscription.alerts))
      .set('isSubscribed', true);
  case SET_BROWSER_SUPPORT:
    return state.set('browserSupport', action.value);
  case CLEAR_SUBSCRIPTION:
    return initialState;
  case SET_ALERTS:
    return state.setIn(action.path, action.value);
  default:
    return state;
  }
}
