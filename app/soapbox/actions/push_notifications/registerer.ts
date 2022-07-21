import { createPushSubscription, updatePushSubscription } from 'soapbox/actions/push_subscriptions';
import { pushNotificationsSetting } from 'soapbox/settings';
import { getVapidKey } from 'soapbox/utils/auth';
import { decode as decodeBase64 } from 'soapbox/utils/base64';

import { setBrowserSupport, setSubscription, clearSubscription } from './setter';

import type { AppDispatch, RootState } from 'soapbox/store';
import type { Me } from 'soapbox/types/soapbox';

// Taken from https://www.npmjs.com/package/web-push
const urlBase64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  return decodeBase64(base64);
};

const getRegistration = () => {
  if (navigator.serviceWorker) {
    return navigator.serviceWorker.ready;
  } else {
    throw 'Your browser does not support Service Workers.';
  }
};

const getPushSubscription = (registration: ServiceWorkerRegistration) =>
  registration.pushManager.getSubscription()
    .then(subscription => ({ registration, subscription }));

const subscribe = (registration: ServiceWorkerRegistration, getState: () => RootState) =>
  registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(getVapidKey(getState())),
  });

const unsubscribe = ({ registration, subscription }: {
  registration: ServiceWorkerRegistration,
  subscription: PushSubscription | null,
}) =>
  subscription ? subscription.unsubscribe().then(() => registration) : new Promise<ServiceWorkerRegistration>(r => r(registration));

const sendSubscriptionToBackend = (subscription: PushSubscription, me: Me) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const alerts = getState().push_notifications.alerts.toJS();
    const params = { subscription, data: { alerts } };

    if (me) {
      const data = pushNotificationsSetting.get(me);
      if (data) {
        params.data = data;
      }
    }

    return dispatch(createPushSubscription(params) as any);
  };

// Last one checks for payload support: https://web-push-book.gauntface.com/chapter-06/01-non-standards-browsers/#no-payload
// eslint-disable-next-line compat/compat
const supportsPushNotifications = ('serviceWorker' in navigator && 'PushManager' in window && 'getKey' in PushSubscription.prototype);

const register = () =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const me = getState().me;
    const vapidKey = getVapidKey(getState());

    dispatch(setBrowserSupport(supportsPushNotifications));

    if (!supportsPushNotifications) {
      console.warn('Your browser does not support Web Push Notifications.');
      return;
    }

    if (!vapidKey) {
      console.error('The VAPID public key is not set. You will not be able to receive Web Push Notifications.');
      return;
    }

    getRegistration()
      .then(getPushSubscription)
      // @ts-ignore
      .then(({ registration, subscription }: {
        registration: ServiceWorkerRegistration,
        subscription: PushSubscription | null,
      }) => {
        if (subscription !== null) {
          // We have a subscription, check if it is still valid
          const currentServerKey = (new Uint8Array(subscription.options.applicationServerKey!)).toString();
          const subscriptionServerKey = urlBase64ToUint8Array(vapidKey).toString();
          const serverEndpoint = getState().push_notifications.subscription?.endpoint;

          // If the VAPID public key did not change and the endpoint corresponds
          // to the endpoint saved in the backend, the subscription is valid
          if (subscriptionServerKey === currentServerKey && subscription.endpoint === serverEndpoint) {
            return { subscription };
          } else {
            // Something went wrong, try to subscribe again
            return unsubscribe({ registration, subscription }).then((registration: ServiceWorkerRegistration) => {
              return subscribe(registration, getState);
            }).then(
              (subscription: PushSubscription) => dispatch(sendSubscriptionToBackend(subscription, me) as any));
          }
        }

        // No subscription, try to subscribe
        return subscribe(registration, getState)
          .then(subscription => dispatch(sendSubscriptionToBackend(subscription, me) as any));
      })
      .then(({ subscription }: { subscription: PushSubscription | Record<string, any> }) => {
        // If we got a PushSubscription (and not a subscription object from the backend)
        // it means that the backend subscription is valid (and was set during hydration)
        if (!(subscription instanceof PushSubscription)) {
          dispatch(setSubscription(subscription as PushSubscription));
          if (me) {
            pushNotificationsSetting.set(me, { alerts: subscription.alerts });
          }
        }
      })
      .catch(error => {
        if (error.code === 20 && error.name === 'AbortError') {
          console.warn('Your browser supports Web Push Notifications, but does not seem to implement the VAPID protocol.');
        } else if (error.code === 5 && error.name === 'InvalidCharacterError') {
          console.error('The VAPID public key seems to be invalid:', vapidKey);
        }

        // Clear alerts and hide UI settings
        dispatch(clearSubscription());

        if (me) {
          pushNotificationsSetting.remove(me);
        }

        return getRegistration()
          .then(getPushSubscription)
          .then(unsubscribe);
      })
      .catch(console.warn);
  };

const saveSettings = () =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState().push_notifications;
    const alerts = state.alerts;
    const data = { alerts };
    const me = getState().me;

    return dispatch(updatePushSubscription({ data })).then(() => {
      if (me) {
        pushNotificationsSetting.set(me, data);
      }
    }).catch(console.warn);
  };

export {
  register,
  saveSettings,
};
