import React, { useEffect } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';

import { directComposeById } from 'soapbox/actions/compose';
import { connectDirectStream } from 'soapbox/actions/streaming';
import { expandDirectTimeline } from 'soapbox/actions/timelines';
import AccountSearch from 'soapbox/components/account_search';
import ColumnHeader from 'soapbox/components/column_header';
import { Column } from 'soapbox/components/ui';
import { useAppDispatch, useAppSelector } from 'soapbox/hooks';

import StatusListContainer from '../ui/containers/status_list_container';

const messages = defineMessages({
  title: { id: 'column.direct', defaultMessage: 'Direct messages' },
  searchPlaceholder: { id: 'direct.search_placeholder', defaultMessage: 'Send a message to…' },
});

const DirectTimeline = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const hasUnread = useAppSelector((state) => state.timelines.getIn(['direct', 'unread']) > 0);

  useEffect(() => {
    dispatch(expandDirectTimeline());
    const disconnect = dispatch(connectDirectStream());

    return (() => {
      disconnect();
    });
  }, []);

  const handleSuggestion = (accountId: string) => {
    dispatch(directComposeById(accountId));
  };

  const handleLoadMore = (maxId: string) => {
    dispatch(expandDirectTimeline({ maxId }));
  };

  return (
    <Column label={intl.formatMessage(messages.title)} transparent>
      <ColumnHeader
        icon='envelope'
        active={hasUnread}
        title={intl.formatMessage(messages.title)}
      />

      <AccountSearch
        placeholder={intl.formatMessage(messages.searchPlaceholder)}
        onSelected={handleSuggestion}
      />

      <StatusListContainer
        scrollKey='direct_timeline'
        timelineId='direct'
        onLoadMore={handleLoadMore}
        emptyMessage={<FormattedMessage id='empty_column.direct' defaultMessage="You don't have any direct messages yet. When you send or receive one, it will show up here." />}
        divideType='space'
      />
    </Column>
  );
};

export default DirectTimeline;
