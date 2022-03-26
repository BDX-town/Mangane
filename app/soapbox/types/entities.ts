import {
  AccountRecord,
  AttachmentRecord,
  CardRecord,
  EmojiRecord,
  FieldRecord,
  InstanceRecord,
  MentionRecord,
  NotificationRecord,
  PollRecord,
  PollOptionRecord,
  StatusRecord,
} from 'soapbox/normalizers';

import type { Record as ImmutableRecord } from 'immutable';

type Account = ReturnType<typeof AccountRecord>;
type Attachment = ReturnType<typeof AttachmentRecord>;
type Card = ReturnType<typeof CardRecord>;
type Emoji = ReturnType<typeof EmojiRecord>;
type Field = ReturnType<typeof FieldRecord>;
type Instance = ReturnType<typeof InstanceRecord>;
type Mention = ReturnType<typeof MentionRecord>;
type Notification = ReturnType<typeof NotificationRecord>;
type Poll = ReturnType<typeof PollRecord>;
type PollOption = ReturnType<typeof PollOptionRecord>;
type Status = ReturnType<typeof StatusRecord>;

// Utility types
type APIEntity = Record<string, any>;
type EmbeddedEntity<T extends object> = null | string | ReturnType<ImmutableRecord.Factory<T>>;

export {
  Account,
  Attachment,
  Card,
  Emoji,
  Field,
  Instance,
  Mention,
  Notification,
  Poll,
  PollOption,
  Status,

  // Utility types
  APIEntity,
  EmbeddedEntity,
};
