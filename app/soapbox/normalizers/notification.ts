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

// https://docs.joinmastodon.org/entities/notification/
export const NotificationRecord = ImmutableRecord({
  account: null,
  chat_message: null, // pleroma:chat_mention
  created_at: new Date(),
  emoji: null, // pleroma:emoji_reaction
  id: '',
  status: null,
  target: null, // move
  type: '',
});

export const normalizeNotification = (notification: Record<string, any>) => {
  return NotificationRecord(
    ImmutableMap(fromJS(notification)),
  );
};
