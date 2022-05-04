import {
  AccountRecord,
  AttachmentRecord,
  CardRecord,
  ChatRecord,
  ChatMessageRecord,
  EmojiRecord,
  FieldRecord,
  InstanceRecord,
  MentionRecord,
  NotificationRecord,
  PollRecord,
  PollOptionRecord,
  StatusEditRecord,
  StatusRecord,
} from 'soapbox/normalizers';

import type { Record as ImmutableRecord } from 'immutable';

type Attachment = ReturnType<typeof AttachmentRecord>;
type Card = ReturnType<typeof CardRecord>;
type Chat = ReturnType<typeof ChatRecord>;
type ChatMessage = ReturnType<typeof ChatMessageRecord>;
type Emoji = ReturnType<typeof EmojiRecord>;
type Field = ReturnType<typeof FieldRecord>;
type Instance = ReturnType<typeof InstanceRecord>;
type Mention = ReturnType<typeof MentionRecord>;
type Notification = ReturnType<typeof NotificationRecord>;
type Poll = ReturnType<typeof PollRecord>;
type PollOption = ReturnType<typeof PollOptionRecord>;
type StatusEdit = ReturnType<typeof StatusEditRecord>;

interface Account extends ReturnType<typeof AccountRecord> {
  // HACK: we can't do a circular reference in the Record definition itself,
  // so do it here.
  moved: EmbeddedEntity<Account>;
}

interface Status extends ReturnType<typeof StatusRecord> {
  // HACK: same as above
  quote: EmbeddedEntity<Status>;
  reblog: EmbeddedEntity<Status>;
}

// Utility types
type APIEntity = Record<string, any>;
type EmbeddedEntity<T extends object> = null | string | ReturnType<ImmutableRecord.Factory<T>>;

export {
  Account,
  Attachment,
  Card,
  Chat,
  ChatMessage,
  Emoji,
  Field,
  Instance,
  Mention,
  Notification,
  Poll,
  PollOption,
  Status,
  StatusEdit,

  // Utility types
  APIEntity,
  EmbeddedEntity,
};
