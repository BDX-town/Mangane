import { Map as ImmutableMap } from 'immutable';
import { debounce } from 'lodash';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { createSelector } from 'reselect';

import { expandChats } from 'soapbox/actions/chats';
import ScrollableList from 'soapbox/components/scrollable_list';
import PlaceholderChat from 'soapbox/features/placeholder/components/placeholder_chat';
import { useAppSelector } from 'soapbox/hooks';

import Chat from './chat';

const messages = defineMessages({
  emptyMessage: { id: 'chat_panels.main_window.empty', defaultMessage: 'No chats found. To start a chat, visit a user\'s profile' },
});

const handleLoadMore = debounce((dispatch) => {
  dispatch(expandChats());
}, 300, { leading: true });

const getSortedChatIds = (chats: ImmutableMap<string, any>) => (
  chats
    .toList()
    .sort(chatDateComparator)
    .map(chat => chat.id)
);

const chatDateComparator = (chatA: { updated_at: string }, chatB: { updated_at: string }) => {
  // Sort most recently updated chats at the top
  const a = new Date(chatA.updated_at);
  const b = new Date(chatB.updated_at);

  if (a === b) return 0;
  if (a > b) return -1;
  if (a < b) return 1;
  return 0;
};

const sortedChatIdsSelector = createSelector(
  [getSortedChatIds],
  chats => chats,
);

interface IChatList {
  onClickChat: (chat: any) => void,
  onRefresh: () => void,
}

const ChatList: React.FC<IChatList> = ({ onClickChat, onRefresh }) => {
  const dispatch = useDispatch();
  const intl = useIntl();

  const chatIds = useAppSelector(state => sortedChatIdsSelector(state.chats.get('items')));
  const hasMore = useAppSelector(state => !!state.chats.get('next'));
  const isLoading = useAppSelector(state => state.chats.get('isLoading'));

  return (
    <ScrollableList
      className='chat-list'
      scrollKey='awaiting-approval'
      emptyMessage={intl.formatMessage(messages.emptyMessage)}
      hasMore={hasMore}
      isLoading={isLoading}
      showLoading={isLoading && chatIds.size === 0}
      onLoadMore={() => handleLoadMore(dispatch)}
      onRefresh={onRefresh}
      placeholderComponent={PlaceholderChat}
      placeholderCount={20}
    >
      {chatIds.map((chatId: string) => (
        <div key={chatId} className='chat-list-item'>
          <Chat
            chatId={chatId}
            onClick={onClickChat}
          />
        </div>
      ))}
    </ScrollableList>
  );
};

export default ChatList;
