import React, { useEffect, useState } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';

import { connectCommunityStream } from 'soapbox/actions/streaming';
import { expandCommunityTimeline } from 'soapbox/actions/timelines';
import PullToRefresh from 'soapbox/components/pull-to-refresh';
import SubNavigation from 'soapbox/components/sub_navigation';
import TimelineSettings from 'soapbox/components/timeline_settings';
import { Column, IconButton } from 'soapbox/components/ui';
import { useAppDispatch, useAppSelector, useSettings } from 'soapbox/hooks';

import Timeline from '../ui/components/timeline';

const messages = defineMessages({
  title: { id: 'column.community', defaultMessage: 'Local timeline' },
  settings: { id: 'settings.settings', defaultMessage: 'Settings' },
});

const CommunityTimeline = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const instance = useAppSelector((state) => state.instance);
  const timelineId = 'community';

  const [showSettings, setShowSettings] = useState(false);
  const settings = useSettings();
  const onlyMedia = settings.getIn([timelineId, 'other', 'onlyMedia']);
  const excludeReplies = settings.getIn([timelineId, 'shows', 'reply']);



  const handleLoadMore = (maxId: string) => {
    dispatch(expandCommunityTimeline({ maxId, onlyMedia, excludeReplies }));
  };

  const handleRefresh = () => {
    return dispatch(expandCommunityTimeline({ onlyMedia, excludeReplies }));
  };

  useEffect(() => {
    dispatch(expandCommunityTimeline({ onlyMedia, excludeReplies }));
    const disconnect = dispatch(connectCommunityStream({ onlyMedia, excludeReplies }));

    return () => {
      disconnect();
    };
  }, [dispatch, excludeReplies, onlyMedia]);

  return (
    <>
      <Column label={intl.formatMessage(messages.title)} transparent withHeader={false}>
        <div className='px-4 pt-4 sm:p-0 flex justify-between'>
          <SubNavigation message={instance.title} />
          <IconButton
            src={!showSettings ? require('@tabler/icons/chevron-down.svg') : require('@tabler/icons/chevron-up.svg')}
            onClick={() => setShowSettings(!showSettings)}
            title={intl.formatMessage(messages.settings)}
          />
        </div>
        {
          showSettings && <TimelineSettings className='mb-3' timeline={timelineId} onClose={() => setShowSettings(false)} />
        }
        <PullToRefresh onRefresh={handleRefresh}>
          <Timeline
            scrollKey={`${timelineId}_timeline`}
            timelineId={`${timelineId}${onlyMedia ? ':media' : ''}${excludeReplies ? ':exclude_replies' : ''}`}
            onLoadMore={handleLoadMore}
            emptyMessage={<FormattedMessage id='empty_column.community' defaultMessage='The local timeline is empty. Write something publicly to get the ball rolling!' />}
            divideType='space'
          />
        </PullToRefresh>
      </Column>
    </>
  );
};

export default CommunityTimeline;
