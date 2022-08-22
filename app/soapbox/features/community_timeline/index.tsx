import React, { useEffect } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';

import { connectCommunityStream } from 'soapbox/actions/streaming';
import { expandCommunityTimeline } from 'soapbox/actions/timelines';
import PullToRefresh from 'soapbox/components/pull-to-refresh';
import { Column } from 'soapbox/components/ui';
import { useAppDispatch, useSettings } from 'soapbox/hooks';

import Timeline from '../ui/components/timeline';

import ColumnSettings from './containers/column_settings_container';

const messages = defineMessages({
  title: { id: 'column.community', defaultMessage: 'Local timeline' },
});

const CommunityTimeline = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const settings = useSettings();
  const onlyMedia = settings.getIn(['community', 'other', 'onlyMedia']);

  const timelineId = 'community';

  const handleLoadMore = (maxId: string) => {
    dispatch(expandCommunityTimeline({ maxId, onlyMedia }));
  };

  const handleRefresh = () => {
    return dispatch(expandCommunityTimeline({ onlyMedia } as any));
  };

  useEffect(() => {
    dispatch(expandCommunityTimeline({ onlyMedia } as any));
    const disconnect = dispatch(connectCommunityStream({ onlyMedia } as any));

    return () => {
      disconnect();
    };
  }, [onlyMedia]);

  return (
    <Column label={intl.formatMessage(messages.title)} transparent withHeader={false}>
      <PullToRefresh onRefresh={handleRefresh}>
        <Timeline
          scrollKey={`${timelineId}_timeline`}
          timelineId={`${timelineId}${onlyMedia ? ':media' : ''}`}
          onLoadMore={handleLoadMore}
          emptyMessage={<FormattedMessage id='empty_column.community' defaultMessage='The local timeline is empty. Write something publicly to get the ball rolling!' />}
          divideType='space'
        />
      </PullToRefresh>
    </Column>
  );
};

export default CommunityTimeline;
