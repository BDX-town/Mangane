import {
  List as ImmutableList,
  Map as ImmutableMap,
  Record as ImmutableRecord,
  fromJS,
} from 'immutable';

import type { Attachment, Card, Emoji } from 'soapbox/types/entities';

export const ChatMessageRecord = ImmutableRecord({
  account_id: '',
  attachment: null as Attachment | null,
  card: null as Card | null,
  chat_id: '',
  content: '',
  created_at: new Date(),
  emojis: ImmutableList<Emoji>(),
  id: '',
  unread: false,

  deleting: false,
  pending: false,
});

export const normalizeChatMessage = (chatMessage: Record<string, any>) => {
  return ChatMessageRecord(
    ImmutableMap(fromJS(chatMessage)),
  );
};
