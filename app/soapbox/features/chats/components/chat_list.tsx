import { Map as ImmutableMap } from 'immutable';
import React, { useCallback } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { Virtuoso } from 'react-virtuoso';
import { createSelector } from 'reselect';

import { fetchChats, expandChats } from 'soapbox/actions/chats';
import PullToRefresh from 'soapbox/components/pull-to-refresh';
import { Text } from 'soapbox/components/ui';
import PlaceholderChat from 'soapbox/features/placeholder/components/placeholder_chat';
import { useAppSelector } from 'soapbox/hooks';

import Chat from './chat';

const messages = defineMessages({
  emptyMessage: { id: 'chat_panels.main_window.empty', defaultMessage: 'No chats found. To start a chat, visit a user\'s profile' },
});

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
  useWindowScroll?: boolean,
}

const ChatList: React.FC<IChatList> = ({ onClickChat, useWindowScroll = false }) => {
  const dispatch = useDispatch();
  const intl = useIntl();

  const chatIds = useAppSelector(state => sortedChatIdsSelector(state.chats.get('items')));
  const hasMore = useAppSelector(state => !!state.chats.get('next'));
  const isLoading = useAppSelector(state => state.chats.get('isLoading'));

  const handleLoadMore = useCallback(() => {
    if (hasMore && !isLoading) {
      dispatch(expandChats());
    }
  }, [dispatch, hasMore, isLoading]);

  const handleRefresh = () => {
    return dispatch(fetchChats()) as any;
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <Virtuoso
        className='chat-list'
        useWindowScroll={useWindowScroll}
        data={chatIds.toArray()}
        endReached={handleLoadMore}
        itemContent={(_index, chatId) => (
          <Chat chatId={chatId} onClick={onClickChat} />
        )}
        components={{
          ScrollSeekPlaceholder: () => <PlaceholderChat />,
          Footer: () => hasMore ? <PlaceholderChat /> : null,
          EmptyPlaceholder: () => {
            if (isLoading) {
              return <PlaceholderChat />;
            } else {
              return <Text>{intl.formatMessage(messages.emptyMessage)}</Text>;
            }
          },
        }}
      />
    </PullToRefresh>
  );
};

export default ChatList;
