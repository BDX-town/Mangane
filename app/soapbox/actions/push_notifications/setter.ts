import type { AnyAction } from 'redux';

export const SET_BROWSER_SUPPORT = 'PUSH_NOTIFICATIONS_SET_BROWSER_SUPPORT';
export const SET_SUBSCRIPTION = 'PUSH_NOTIFICATIONS_SET_SUBSCRIPTION';
export const CLEAR_SUBSCRIPTION = 'PUSH_NOTIFICATIONS_CLEAR_SUBSCRIPTION';
export const SET_ALERTS = 'PUSH_NOTIFICATIONS_SET_ALERTS';

export const setBrowserSupport = (value: boolean) => ({
  type: SET_BROWSER_SUPPORT,
  value,
});

export const setSubscription = (subscription: PushSubscription) => ({
  type: SET_SUBSCRIPTION,
  subscription,
});

export const clearSubscription = () => ({
  type: CLEAR_SUBSCRIPTION,
});

export const setAlerts = (path: Array<string>, value: any) =>
  (dispatch: React.Dispatch<AnyAction>) =>
    dispatch({
      type: SET_ALERTS,
      path,
      value,
    });
