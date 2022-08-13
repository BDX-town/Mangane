import debounce from 'lodash/debounce';
import React, { useEffect } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';

import { fetchScheduledStatuses, expandScheduledStatuses } from 'soapbox/actions/scheduled_statuses';
import ScrollableList from 'soapbox/components/scrollable_list';
import { useAppSelector, useAppDispatch } from 'soapbox/hooks';

import Column from '../ui/components/column';

import ScheduledStatus from './components/scheduled_status';

const messages = defineMessages({
  heading: { id: 'column.scheduled_statuses', defaultMessage: 'Scheduled Posts' },
});

const handleLoadMore = debounce((dispatch) => {
  dispatch(expandScheduledStatuses());
}, 300, { leading: true });

const ScheduledStatuses = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const statusIds = useAppSelector((state) => state.status_lists.get('scheduled_statuses')!.items);
  const isLoading = useAppSelector((state) => state.status_lists.get('scheduled_statuses')!.isLoading);
  const hasMore = useAppSelector((state) => !!state.status_lists.get('scheduled_statuses')!.next);

  useEffect(() => {
    dispatch(fetchScheduledStatuses());
  }, []);

  const emptyMessage = <FormattedMessage id='empty_column.scheduled_statuses' defaultMessage="You don't have any scheduled statuses yet. When you add one, it will show up here." />;

  return (
    <Column icon='calendar' label={intl.formatMessage(messages.heading)}>
      <ScrollableList
        scrollKey='scheduled_statuses'
        hasMore={hasMore}
        isLoading={typeof isLoading === 'boolean' ? isLoading : true}
        onLoadMore={() => handleLoadMore(dispatch)}
        emptyMessage={emptyMessage}
      >
        {statusIds.map((id: string) => <ScheduledStatus key={id} statusId={id} />)}
      </ScrollableList>
    </Column>
  );
};

export default ScheduledStatuses;
