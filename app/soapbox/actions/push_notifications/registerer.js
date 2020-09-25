import api from '../../api';
import { decode as decodeBase64 } from '../../utils/base64';
import { pushNotificationsSetting } from '../../settings';
import { setBrowserSupport, setSubscription, clearSubscription } from './setter';

// Taken from https://www.npmjs.com/package/web-push
const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  return decodeBase64(base64);
};

const getApplicationServerKey = getState => {
  const key = getState().getIn(['auth', 'app', 'vapid_key']);
  if (!key) console.error('Could not get vapid key. Push notifications will not work.');
  return key;
};

const getRegistration = () => navigator.serviceWorker.ready;

const getPushSubscription = (registration) =>
  registration.pushManager.getSubscription()
    .then(subscription => ({ registration, subscription }));

const subscribe = (registration, getState) =>
  registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(getApplicationServerKey(getState)),
  });

const unsubscribe = ({ registration, subscription }) =>
  subscription ? subscription.unsubscribe().then(() => registration) : registration;

const subscriptionToParams = subscription => {
  const sub = subscription.toJSON();
  return {
    endpoint: sub.endpoint,
    keys: sub.keys,
  };
};

const sendSubscriptionToBackend = (subscription, getState) => {
  const params = {
    subscription: subscriptionToParams(subscription),
    data: {
      // TODO: Make configurable
      alerts: {
        follow: true,
        favourite: true,
        reblog: true,
        mention: true,
        poll: true,
        'pleroma:chat_mention': true,
      },
    },
  };

  return api(getState).post('/api/v1/push/subscription', params)
    .then(response => response.data);
};

// Last one checks for payload support: https://web-push-book.gauntface.com/chapter-06/01-non-standards-browsers/#no-payload
const supportsPushNotifications = ('serviceWorker' in navigator && 'PushManager' in window && 'getKey' in PushSubscription.prototype);


// Check that the VAPID public key did not change
const vapidKeyMatches = (subscription, getState) => {
  const currentServerKey = (new Uint8Array(subscription.options.applicationServerKey)).toString();
  const subscriptionServerKey = urlBase64ToUint8Array(getApplicationServerKey(getState)).toString();
  return currentServerKey === subscriptionServerKey;
};

export function register() {
  return (dispatch, getState) => {
    const me = getState().get('me');
    dispatch(setBrowserSupport(supportsPushNotifications));

    if (supportsPushNotifications) {
      if (!getApplicationServerKey(getState)) {
        console.error('The VAPID public key is not set. You will not be able to receive Web Push Notifications.');
        return;
      }

      getRegistration()
        .then(getPushSubscription)
        .then(({ registration, subscription }) => {
          if (subscription !== null) {
            // We have a subscription, check if it is still valid
            // TODO: Also compare `subscription.endpoint`
            if (vapidKeyMatches(subscription, getState)) {
              return subscription;
            } else {
              // Something went wrong, try to subscribe again
              return unsubscribe({ registration, subscription }).then(registration => {
                return subscribe(registration, getState);
              }).then(
                subscription => sendSubscriptionToBackend(subscription, getState));
            }
          }

          // No subscription, try to subscribe
          return subscribe(registration, getState).then(
            subscription => sendSubscriptionToBackend(subscription, getState));
        })
        .then(subscription => {
          // If we got a PushSubscription (and not a subscription object from the backend)
          // it means that the backend subscription is valid (and was set during hydration)
          if (!(subscription instanceof PushSubscription)) {
            dispatch(setSubscription(subscription));
            if (me) {
              pushNotificationsSetting.set(me, { alerts: subscription.alerts });
            }
          }
        })
        .catch(error => {
          if (error.code === 20 && error.name === 'AbortError') {
            console.warn('Your browser supports Web Push Notifications, but does not seem to implement the VAPID protocol.');
          } else if (error.code === 5 && error.name === 'InvalidCharacterError') {
            console.error('The VAPID public key seems to be invalid:', getApplicationServerKey(getState));
          } else {
            console.error(error);
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
    } else {
      console.warn('Your browser does not support Web Push Notifications.');
    }
  };
}

export function saveSettings() {
  return (_, getState) => {
    const state = getState().get('push_notifications');
    const alerts = state.get('alerts');
    const data = { alerts };
    const me = getState().get('me');

    api(getState).put('/api/v1/push/subscription', {
      data,
    }).then(() => {
      if (me) {
        pushNotificationsSetting.set(me, data);
      }
    }).catch(console.warn);
  };
}
