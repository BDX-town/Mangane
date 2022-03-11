import {
  Map as ImmutableMap,
  Record as ImmutableRecord,
} from 'immutable';

// https://docs.joinmastodon.org/entities/notification/
const NotificationRecord = ImmutableRecord({
  account: null,
  chat_message: null, // pleroma:chat_mention
  created_at: new Date(),
  emoji: null, // pleroma:emoji_reaction
  id: '',
  status: null,
  target: null, // move
  type: '',
});

export const normalizeNotification = (notification: ImmutableMap<string, any>) => {
  return NotificationRecord(notification);
};
