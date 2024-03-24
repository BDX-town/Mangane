import React, { useEffect } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';

import { connectCommunityStream } from 'soapbox/actions/streaming';
import { expandCommunityTimeline } from 'soapbox/actions/timelines';
import PullToRefresh from 'soapbox/components/pull-to-refresh';
import SubNavigation from 'soapbox/components/sub_navigation';
import { Column } from 'soapbox/components/ui';
import { useAppDispatch, useAppSelector, useSettings } from 'soapbox/hooks';

import Timeline from '../ui/components/timeline';

const messages = defineMessages({
  title: { id: 'column.community', defaultMessage: 'Local timeline' },
});

const CommunityTimeline = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const instance = useAppSelector((state) => state.instance);
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
      <div className='px-4 pt-1 sm:p-0'>
        <SubNavigation message={instance.title} />
      </div>
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
