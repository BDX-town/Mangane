import { Map as ImmutableMap, Record as ImmutableRecord, fromJS } from 'immutable';

import type { ReducerAccount } from 'soapbox/reducers/accounts';
import type { Account, EmbeddedEntity } from 'soapbox/types/entities';

export const ChatRecord = ImmutableRecord({
  account: null as EmbeddedEntity<Account | ReducerAccount>,
  id: '',
  unread: 0,
  last_message: '' as string || null,
  updated_at: new Date(),
});

export const normalizeChat = (chat: Record<string, any>) => {
  return ChatRecord(
    ImmutableMap(fromJS(chat)),
  );
};
