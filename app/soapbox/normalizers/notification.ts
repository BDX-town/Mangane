/**
 * Notification normalizer:
 * Converts API notifications into our internal format.
 * @see {@link https://docs.joinmastodon.org/entities/notification/}
 */
import {
  Map as ImmutableMap,
  Record as ImmutableRecord,
  fromJS,
} from 'immutable';

import type { Account, Status, EmbeddedEntity } from 'soapbox/types/entities';

export type NotificationType =
  'follow'
  | 'follow_request'
  | 'mention'
  | 'reblog'
  | 'favourite'
  | 'poll'
  | 'status'
  | 'move'
  | 'pleroma:chat_mention'
  | 'pleroma:emoji_reaction';

// https://docs.joinmastodon.org/entities/notification/
export const NotificationRecord = ImmutableRecord({
  account: null as EmbeddedEntity<Account>,
  chat_message: null as ImmutableMap<string, any> | string | null, // pleroma:chat_mention
  created_at: new Date(),
  emoji: null as string | null, // pleroma:emoji_reaction
  id: '',
  status: null as EmbeddedEntity<Status>,
  target: null as EmbeddedEntity<Account>, // move
  type: '' as NotificationType | '',
});

export const normalizeNotification = (notification: Record<string, any>) => {
  return NotificationRecord(
    ImmutableMap(fromJS(notification)),
  );
};
