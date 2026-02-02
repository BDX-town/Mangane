import React, { useEffect } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';

import { directComposeById } from 'soapbox/actions/compose';
import { mountConversations, unmountConversations, expandConversations } from 'soapbox/actions/conversations';
import { connectDirectStream } from 'soapbox/actions/streaming';
import AccountSearch from 'soapbox/components/account_search';
import SubNavigation from 'soapbox/components/sub_navigation';
import { Column } from 'soapbox/components/ui';
import { useAppDispatch } from 'soapbox/hooks';

import ConversationsList from './components/conversations_list';

const messages = defineMessages({
  title: { id: 'column.direct', defaultMessage: 'Conversations' },
  searchPlaceholder: { id: 'direct.search_placeholder', defaultMessage: 'Send a message to…' },
});

const ConversationsTimeline = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(mountConversations());
    dispatch(expandConversations());

    const disconnect = dispatch(connectDirectStream());

    return () => {
      dispatch(unmountConversations());
      disconnect();
    };
  }, [dispatch]);

  const handleSuggestion = (accountId: string) => {
    dispatch(directComposeById(history, accountId));
  };

  return (
    <Column label={intl.formatMessage(messages.title)} transparent withHeader={false}>
      <div className='px-4 pt-4 pb-8 sm:px-0 sm:pt-0'>
        <SubNavigation message={intl.formatMessage(messages.title)} />
        <div className='flex flex-col gap-3'>
          <AccountSearch
            placeholder={intl.formatMessage(messages.searchPlaceholder)}
            onSelected={handleSuggestion}
          />
          <ConversationsList />
        </div>
      </div>
    </Column>
  );
};

export default ConversationsTimeline;
