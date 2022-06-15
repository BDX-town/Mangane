import type { AnyAction } from 'redux';

const SET_BROWSER_SUPPORT = 'PUSH_NOTIFICATIONS_SET_BROWSER_SUPPORT';
const SET_SUBSCRIPTION = 'PUSH_NOTIFICATIONS_SET_SUBSCRIPTION';
const CLEAR_SUBSCRIPTION = 'PUSH_NOTIFICATIONS_CLEAR_SUBSCRIPTION';
const SET_ALERTS = 'PUSH_NOTIFICATIONS_SET_ALERTS';

const setBrowserSupport = (value: boolean) => ({
  type: SET_BROWSER_SUPPORT,
  value,
});

const setSubscription = (subscription: PushSubscription) => ({
  type: SET_SUBSCRIPTION,
  subscription,
});

const clearSubscription = () => ({
  type: CLEAR_SUBSCRIPTION,
});

const setAlerts = (path: Array<string>, value: any) =>
  (dispatch: React.Dispatch<AnyAction>) =>
    dispatch({
      type: SET_ALERTS,
      path,
      value,
    });

export {
  SET_BROWSER_SUPPORT,
  SET_SUBSCRIPTION,
  CLEAR_SUBSCRIPTION,
  SET_ALERTS,
  setBrowserSupport,
  setSubscription,
  clearSubscription,
  setAlerts,
};
