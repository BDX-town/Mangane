import React, { useEffect } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';

import { directCompose } from 'soapbox/actions/compose';
import { mountConversations, unmountConversations, expandConversations } from 'soapbox/actions/conversations';
import { connectDirectStream } from 'soapbox/actions/streaming';
import Icon from 'soapbox/components/icon';
import SubNavigation from 'soapbox/components/sub_navigation';
import { Button, CardTitle, Column, Spinner } from 'soapbox/components/ui';
import { useAppDispatch, useAppSelector } from 'soapbox/hooks';

import ConversationsList from './components/conversations_list';
import ConversationsSearch from './components/conversations_search';

const messages = defineMessages({
  title: { id: 'column.direct', defaultMessage: 'Conversations' },
  searchPlaceholder: { id: 'direct.search_placeholder', defaultMessage: 'Send a message to…' },
});

const ConversationsTimeline = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const history = useHistory();

  const isRefreshing = useAppSelector((state) => state.conversations.isLoading && !state.conversations.items.isEmpty());

  useEffect(() => {
    dispatch(mountConversations());
    dispatch(expandConversations());

    const disconnect = dispatch(connectDirectStream());

    return () => {
      dispatch(unmountConversations());
      disconnect();
    };
  }, [dispatch]);

  const handleNewConversation = () => {
    dispatch(directCompose(null));
    history.push('/statuses/compose');
  };

  return (
    <Column label={intl.formatMessage(messages.title)} transparent withHeader={false}>
      <div className='px-4 pt-4 sm:px-0 sm:pt-0'>
        <SubNavigation className='flex justify-between gap-3 align-center'>
          <div className='flex items-center grow min-w-[0px] shrink gap-3'>
            <CardTitle className='grow-0 shrink' title={intl.formatMessage(messages.title)} />
            {isRefreshing && <Spinner size={20} withText={false} />}
          </div>
        </SubNavigation>
        <div className='mb-3 flex align-center justify-end gap-3 flex-wrap'>
          <ConversationsSearch className='grow min-w-[200px]' />
          <Button classNames='flex gap-2 items-center text-nowrap' onClick={handleNewConversation}>
            <Icon
              src={require('@tabler/icons/message-circle.svg')}
            />
            Nouvelle conversation
          </Button>
        </div>
        <div className='flex flex-col gap-3'>
          <ConversationsList />
        </div>
      </div>
    </Column>
  );
};

export default ConversationsTimeline;
