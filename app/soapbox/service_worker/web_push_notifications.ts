import IntlMessageFormat from 'intl-messageformat';
import 'intl-pluralrules';
import unescape from 'lodash/unescape';

import locales from './web_push_locales';

import type {
  Account as AccountEntity,
  Notification as NotificationEntity,
  Status as StatusEntity,
} from 'soapbox/types/entities';

/** Limit before we start grouping device notifications into a single notification. */
const MAX_NOTIFICATIONS = 5;
/** Tag for the grouped notification. */
const GROUP_TAG = 'tag';

// https://www.devextent.com/create-service-worker-typescript/
declare const self: ServiceWorkerGlobalScope;

/** Soapbox notification data from push event. */
interface NotificationData {
  access_token?: string,
  count?: number,
  hiddenBody?: string,
  hiddenImage?: string,
  id?: string,
  preferred_locale: string,
  url: string,
}

/** ServiceWorker Notification options with extra fields. */
interface ExtendedNotificationOptions extends NotificationOptions {
  data: NotificationData,
  title: string,
}

/** Partial clone of ServiceWorker Notification with mutability. */
interface ClonedNotification {
  actions?: NotificationAction[],
  body?: string,
  data: NotificationData,
  image?: string,
  tag?: string,
  title: string,
}

/** Status entitiy from the API (kind of). */
// HACK
interface APIStatus extends Omit<StatusEntity, 'media_attachments'> {
  media_attachments: { preview_url: string }[],
}

/** Notification entity from the API (kind of). */
// HACK
interface APINotification extends Omit<NotificationEntity, 'account' | 'status'> {
  account: AccountEntity,
  status?: APIStatus,
}

/** Show the actual push notification on the device. */
const notify = (options: ExtendedNotificationOptions): Promise<void> =>
  self.registration.getNotifications().then(notifications => {
    if (notifications.length >= MAX_NOTIFICATIONS) { // Reached the maximum number of notifications, proceed with grouping
      const group: ClonedNotification = {
        title: formatMessage('notifications.group', options.data.preferred_locale, { count: notifications.length + 1 }),
        body: notifications.map(notification => notification.title).join('\n'),
        tag: GROUP_TAG,
        data: {
          url: (new URL('/notifications', self.location.href)).href,
          count: notifications.length + 1,
          preferred_locale: options.data.preferred_locale,
        },
      };

      notifications.forEach(notification => notification.close());

      return self.registration.showNotification(group.title, group);
    } else if (notifications.length === 1 && notifications[0].tag === GROUP_TAG) { // Already grouped, proceed with appending the notification to the group
      const group = cloneNotification(notifications[0]);
      const count = (group.data.count || 0) + 1;

      group.title = formatMessage('notifications.group', options.data.preferred_locale, { count });
      group.body  = `${options.title}\n${group.body}`;
      group.data  = { ...group.data, count };

      return self.registration.showNotification(group.title, group);
    }

    return self.registration.showNotification(options.title, options);
  });

/** Perform an API request to the backend. */
const fetchFromApi = (path: string, method: string, accessToken: string): Promise<APINotification> => {
  const url = (new URL(path, self.location.href)).href;

  return fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },

    method: method,
    credentials: 'include',
  }).then(res => {
    if (res.ok) {
      return res;
    } else {
      throw new Error(String(res.status));
    }
  }).then(res => res.json());
};

/** Create a mutable object that loosely matches the Notification. */
const cloneNotification = (notification: Notification): ClonedNotification => {
  const clone: any = {};
  let k: string;

  // Object.assign() does not work with notifications
  for (k in notification) {
    clone[k] = (notification as any)[k];
  }

  return clone as ClonedNotification;
};

/** Get translated message for the user's locale. */
const formatMessage = (messageId: string, locale: string, values = {}): string =>
  (new IntlMessageFormat(locales[locale][messageId], locale)).format(values) as string;

/** Strip HTML for display in a native notification. */
const htmlToPlainText = (html: string): string =>
  unescape(html.replace(/<br\s*\/?>/g, '\n').replace(/<\/p><[^>]*>/g, '\n\n').replace(/<[^>]*>/g, ''));

/** ServiceWorker `push` event callback. */
const handlePush = (event: PushEvent) => {
  const { access_token, notification_id, preferred_locale, title, body, icon } = event.data?.json();

  // Placeholder until more information can be loaded
  event.waitUntil(
    fetchFromApi(`/api/v1/notifications/${notification_id}`, 'get', access_token).then(notification => {
      const options: ExtendedNotificationOptions = {
        title: formatMessage(`notification.${notification.type}`, preferred_locale, { name: notification.account.display_name.length > 0 ? notification.account.display_name : notification.account.username }),
        body:      notification.status && htmlToPlainText(notification.status.content),
        icon:      notification.account.avatar_static,
        timestamp: notification.created_at && Number(new Date(notification.created_at)),
        tag:       notification.id,
        image:     notification.status?.media_attachments[0]?.preview_url,
        data:      { access_token, preferred_locale, id: notification.status ? notification.status.id : notification.account.id, url: notification.status ? `/@${notification.account.acct}/posts/${notification.status.id}` : `/@${notification.account.acct}` },
      };

      if (notification.status?.spoiler_text || notification.status?.sensitive) {
        options.data.hiddenBody  = htmlToPlainText(notification.status?.content);
        options.data.hiddenImage = notification.status?.media_attachments[0]?.preview_url;

        if (notification.status?.spoiler_text) {
          options.body    = notification.status.spoiler_text;
        }

        options.image   = undefined;
        options.actions = [actionExpand(preferred_locale)];
      } else if (notification.type === 'mention') {
        options.actions = [actionReblog(preferred_locale), actionFavourite(preferred_locale)];
      }

      return notify(options);
    }).catch(() => {
      return notify({
        title,
        body,
        icon,
        tag: notification_id,
        timestamp: Number(new Date()),
        data: { access_token, preferred_locale, url: '/notifications' },
      });
    }),
  );
};

/** Native action to open a status on the device. */
const actionExpand = (preferred_locale: string) => ({
  action: 'expand',
  icon: `/${require('../../images/web-push/web-push-icon_expand.png')}`,
  title: formatMessage('status.show_more', preferred_locale),
});

/** Native action to repost status. */
const actionReblog = (preferred_locale: string) => ({
  action: 'reblog',
  icon: `/${require('../../images/web-push/web-push-icon_reblog.png')}`,
  title: formatMessage('status.reblog', preferred_locale),
});

/** Native action to like status. */
const actionFavourite = (preferred_locale: string) => ({
  action: 'favourite',
  icon: `/${require('../../images/web-push/web-push-icon_favourite.png')}`,
  title: formatMessage('status.favourite', preferred_locale),
});

/** Get the active tab if possible, or any open tab. */
const findBestClient = (clients: readonly WindowClient[]): WindowClient => {
  const focusedClient = clients.find(client => client.focused);
  const visibleClient = clients.find(client => client.visibilityState === 'visible');

  return focusedClient || visibleClient || clients[0];
};

/** Update a notification with CW to display the full status.  */
const expandNotification = (notification: Notification) => {
  const newNotification = cloneNotification(notification);

  newNotification.body    = newNotification.data.hiddenBody;
  newNotification.image   = newNotification.data.hiddenImage;
  newNotification.actions = [actionReblog(notification.data.preferred_locale), actionFavourite(notification.data.preferred_locale)];

  return self.registration.showNotification(newNotification.title, newNotification);
};

/** Update the native notification, but delete the action (because it was performed). */
const removeActionFromNotification = (notification: Notification, action: string) => {
  const newNotification = cloneNotification(notification);

  newNotification.actions = newNotification.actions?.filter(item => item.action !== action);

  return self.registration.showNotification(newNotification.title, newNotification);
};

/** Open a URL on the device. */
const openUrl = (url: string) =>
  self.clients.matchAll({ type: 'window' }).then(clientList => {
    if (clientList.length === 0) {
      return self.clients.openWindow(url);
    } else {
      const client = findBestClient(clientList);
      return client.navigate(url).then(client => client?.focus());
    }
  });

/** Callback when a native notification is clicked/touched on the device. */
const handleNotificationClick = (event: NotificationEvent) => {
  const reactToNotificationClick = new Promise((resolve, reject) => {
    if (event.action) {
      if (event.action === 'expand') {
        resolve(expandNotification(event.notification));
      } else if (event.action === 'reblog') {
        const { data } = event.notification;
        resolve(fetchFromApi(`/api/v1/statuses/${data.id}/reblog`, 'post', data.access_token).then(() => removeActionFromNotification(event.notification, 'reblog')));
      } else if (event.action === 'favourite') {
        const { data } = event.notification;
        resolve(fetchFromApi(`/api/v1/statuses/${data.id}/favourite`, 'post', data.access_token).then(() => removeActionFromNotification(event.notification, 'favourite')));
      } else {
        reject(`Unknown action: ${event.action}`);
      }
    } else {
      event.notification.close();
      resolve(openUrl(event.notification.data.url));
    }
  });

  event.waitUntil(reactToNotificationClick);
};

// ServiceWorker event listeners
self.addEventListener('push', handlePush);
self.addEventListener('notificationclick', handleNotificationClick);
