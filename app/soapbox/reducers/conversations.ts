import { is, List as ImmutableList, Record as ImmutableRecord } from 'immutable';

import {
  CONVERSATIONS_MOUNT,
  CONVERSATIONS_UNMOUNT,
  CONVERSATIONS_FETCH_REQUEST,
  CONVERSATIONS_FETCH_SUCCESS,
  CONVERSATIONS_FETCH_FAIL,
  CONVERSATIONS_UPDATE,
  CONVERSATIONS_READ,
  CONVERSATIONS_FILTER_SET,
} from '../actions/conversations';
import compareId from '../compare_id';

import type { AnyAction } from 'redux';
import type { APIEntity } from 'soapbox/types/entities';

const ConversationRecord = ImmutableRecord({
  id: '',
  unread: false,
  accounts: ImmutableList<string>(),
  last_status: null as string | null,

});

const ReducerRecord = ImmutableRecord({
  items: ImmutableList<Conversation>(),
  isLoading: false,
  hasMore: true,
  mounted: 0,
  recipients: null as ImmutableList<string> | null,
});

type State = ReturnType<typeof ReducerRecord>;
type Conversation = ReturnType<typeof ConversationRecord>;

const conversationToMap = (item: APIEntity) => ConversationRecord({
  id: item.id,
  unread: item.unread,
  accounts: ImmutableList(item.accounts.map((a: APIEntity) => a.id)),
  last_status: item.last_status ? item.last_status.id : null,
});

const updateConversation = (state: State, item: APIEntity) => state.update('items', list => {
  const index   = list.findIndex(x => x.get('id') === item.id);
  const newItem = conversationToMap(item);

  if (index === -1) {
    return list.unshift(newItem);
  } else {
    return list.set(index, newItem);
  }
});

const expandNormalizedConversations = (state: State, conversations: APIEntity[], next: string | null, isLoadingRecent?: boolean) => {
  let items = ImmutableList(conversations.map(conversationToMap));

  return state.withMutations(mutable => {
    if (!items.isEmpty()) {
      mutable.update('items', previous => {
        let list = previous.map(oldItem => {
          const newItemIndex = items.findIndex(x => x.get('id') === oldItem.get('id'));

          if (newItemIndex === -1) {
            return oldItem;
          }

          const newItem = items.get(newItemIndex);
          items = items.delete(newItemIndex);

          return newItem!;
        });

        list = list.concat(items);

        const sorted = list.sortBy(x => x.get('last_status'), (a, b) => {
          if (a === null || b === null) {
            return -1;
          }

          return compareId(a, b) * -1;
        });

        // Keep the same reference when nothing changed to avoid useless re-renders.
        return is(sorted, previous) ? previous : sorted;
      });
    }

    if (!next && !isLoadingRecent) {
      mutable.set('hasMore', false);
    }

    mutable.set('isLoading', false);
  });
};

export default function conversations(state = ReducerRecord(), action: AnyAction) {
  switch (action.type) {
    case CONVERSATIONS_FETCH_REQUEST:
      return state.set('isLoading', true);
    case CONVERSATIONS_FETCH_FAIL:
      return state.set('isLoading', false);
    case CONVERSATIONS_FETCH_SUCCESS:
      return expandNormalizedConversations(state, action.conversations, action.next, action.isLoadingRecent);
    case CONVERSATIONS_UPDATE:
      return updateConversation(state, action.conversation);
    case CONVERSATIONS_MOUNT:
      return state.update('mounted', count => count + 1);
    case CONVERSATIONS_UNMOUNT:
      return state.update('mounted', count => count - 1);
    case CONVERSATIONS_READ:
      return state.update('items', list => list.map(item => {
        if (item.get('id') === action.id) {
          return item.set('unread', false);
        }

        return item;
      }));
    case CONVERSATIONS_FILTER_SET:
      return state.withMutations(mutable => {
        const recipients = action.recipients.length > 0 ? ImmutableList<string>(action.recipients) : null;

        // Keep the cached items when the filter didn't actually change.
        if (is(recipients, state.recipients)) return;

        mutable.set('recipients', recipients);
        mutable.set('items', ImmutableList());
        mutable.set('hasMore', true);
      });
    default:
      return state;
  }
}
