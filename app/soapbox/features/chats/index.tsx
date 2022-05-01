import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { launchChat } from 'soapbox/actions/chats';
import AccountSearch from 'soapbox/components/account_search';
import AudioToggle from 'soapbox/features/chats/components/audio_toggle';

import { Column } from '../../components/ui';

import ChatList from './components/chat_list';

const messages = defineMessages({
  title: { id: 'column.chats', defaultMessage: 'Chats' },
  searchPlaceholder: { id: 'chats.search_placeholder', defaultMessage: 'Start a chat with…' },
});

const ChatIndex: React.FC = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const history = useHistory();

  const handleSuggestion = (accountId: string) => {
    dispatch(launchChat(accountId, history, true));
  };

  const handleClickChat = (chat: { id: string }) => {
    history.push(`/chats/${chat.id}`);
  };

  return (
    <Column label={intl.formatMessage(messages.title)}>
      <div className='column__switch'>
        <AudioToggle />
      </div>

      <AccountSearch
        placeholder={intl.formatMessage(messages.searchPlaceholder)}
        onSelected={handleSuggestion}
      />

      <ChatList
        onClickChat={handleClickChat}
        useWindowScroll
      />
    </Column>
  );
};

export default ChatIndex;
