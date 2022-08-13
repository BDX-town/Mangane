/** Notification types known to Soapbox. */
const NOTIFICATION_TYPES = [
  'follow',
  'follow_request',
  'mention',
  'reblog',
  'favourite',
  'poll',
  'status',
  'move',
  'pleroma:chat_mention',
  'pleroma:emoji_reaction',
  'user_approved',
  'update',
] as const;

type NotificationType = typeof NOTIFICATION_TYPES[number];

/** Ensure the Notification is a valid, known type. */
const validType = (type: string): type is NotificationType => NOTIFICATION_TYPES.includes(type as any);

export {
  NOTIFICATION_TYPES,
  NotificationType,
  validType,
};
