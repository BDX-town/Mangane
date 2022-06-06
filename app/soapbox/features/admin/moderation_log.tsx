import React, { useEffect, useState } from 'react';
import { defineMessages, FormattedDate, useIntl } from 'react-intl';

import { fetchModerationLog } from 'soapbox/actions/admin';
import ScrollableList from 'soapbox/components/scrollable_list';
import { useAppDispatch, useAppSelector } from 'soapbox/hooks';

import Column from '../ui/components/column';

const messages = defineMessages({
  heading: { id: 'column.admin.moderation_log', defaultMessage: 'Moderation Log' },
  emptyMessage: { id: 'admin.moderation_log.empty_message', defaultMessage: 'You have not performed any moderation actions yet. When you do, a history will be shown here.' },
});

const ModerationLog = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const items = useAppSelector((state) => {
    return state.admin_log.index.map((i) => state.admin_log.items.get(String(i)));
  });
  const hasMore = useAppSelector((state) => state.admin_log.total - state.admin_log.index.count() > 0);

  const [isLoading, setIsLoading] = useState(true);
  const [lastPage, setLastPage] = useState(0);

  const showLoading = isLoading && items.count() === 0;

  useEffect(() => {
    dispatch(fetchModerationLog())
      .then(() => {
        setIsLoading(false);
        setLastPage(1);
      })
      .catch(() => {});
  }, []);

  const handleLoadMore = () => {
    const page = lastPage + 1;

    setIsLoading(true);
    dispatch(fetchModerationLog({ page }))
      .then(() => {
        setIsLoading(false);
        setLastPage(page);
      }).catch(() => {});
  };

  return (
    <Column icon='balance-scale' label={intl.formatMessage(messages.heading)}>
      <ScrollableList
        isLoading={isLoading}
        showLoading={showLoading}
        scrollKey='moderation-log'
        emptyMessage={intl.formatMessage(messages.emptyMessage)}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
      >
        {items.map((item) => item && (
          <div className='logentry' key={item.id}>
            <div className='logentry__message'>{item.message}</div>
            <div className='logentry__timestamp'>
              <FormattedDate
                value={new Date(item.time * 1000)}
                hour12={false}
                year='numeric'
                month='short'
                day='2-digit'
                hour='2-digit'
                minute='2-digit'
              />
            </div>
          </div>
        ))}
      </ScrollableList>
    </Column>
  );
};

export default ModerationLog;
