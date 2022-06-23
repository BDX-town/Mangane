import { List as ImmutableList, Map as ImmutableMap } from 'immutable';
import React from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { createSelector } from 'reselect';

import { openChat, launchChat, toggleMainWindow } from 'soapbox/actions/chats';
import { getSettings } from 'soapbox/actions/settings';
import AccountSearch from 'soapbox/components/account_search';
import { Counter } from 'soapbox/components/ui';
import AudioToggle from 'soapbox/features/chats/components/audio-toggle';
import { useAppDispatch, useAppSelector, useSettings } from 'soapbox/hooks';
import { RootState } from 'soapbox/store';
import { Chat } from 'soapbox/types/entities';

import ChatList from './chat-list';
import ChatWindow from './chat-window';

const messages = defineMessages({
  searchPlaceholder: { id: 'chats.search_placeholder', defaultMessage: 'Start a chat with…' },
});

const getChatsUnreadCount = (state: RootState) => {
  const chats = state.chats.items;
  return chats.reduce((acc, curr) => acc + Math.min(curr.get('unread', 0), 1), 0);
};

// Filter out invalid chats
const normalizePanes = (chats: Immutable.Map<string, Chat>, panes = ImmutableList<ImmutableMap<string, any>>()) => (
  panes.filter(pane => chats.get(pane.get('chat_id')))
);

const makeNormalizeChatPanes = () => createSelector([
  (state: RootState) => state.chats.items,
  (state: RootState) => getSettings(state).getIn(['chats', 'panes']) as any,
], normalizePanes);

const normalizeChatPanes = makeNormalizeChatPanes();

const ChatPanes = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const history = useHistory();

  const panes = useAppSelector((state) => normalizeChatPanes(state));
  const mainWindowState = useSettings().getIn(['chats', 'mainWindow']);
  const unreadCount = useAppSelector((state) => getChatsUnreadCount(state));

  const handleClickChat = ((chat: Chat) => {
    dispatch(openChat(chat.id));
  });

  const handleSuggestion = (accountId: string) => {
    dispatch(launchChat(accountId, history));
  };

  const handleMainWindowToggle = () => {
    dispatch(toggleMainWindow());
  };

  const open = mainWindowState === 'open';

  const mainWindowPane = (
    <div className={`pane pane--main pane--${mainWindowState}`}>
      <div className='pane__header'>
        {unreadCount > 0 && (
          <div className='mr-2 flex-none'>
            <Counter count={unreadCount} />
          </div>
        )}
        <button className='pane__title' onClick={handleMainWindowToggle}>
          <FormattedMessage id='chat_panels.main_window.title' defaultMessage='Chats' />
        </button>
        <AudioToggle />
      </div>
      <div className='pane__content'>
        {open && (
          <>
            <ChatList
              onClickChat={handleClickChat}
            />
            <AccountSearch
              placeholder={intl.formatMessage(messages.searchPlaceholder)}
              onSelected={handleSuggestion}
              resultsPosition='above'
            />
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className='chat-panes'>
      {mainWindowPane}
      {panes.map((pane, i) => (
        <ChatWindow
          idx={i}
          key={pane.get('chat_id')}
          chatId={pane.get('chat_id')}
          windowState={pane.get('state')}
        />
      ))}
    </div>
  );
};

export default ChatPanes;
