import React, { useEffect, useRef } from 'react';
import { defineMessages, useIntl, FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { expandHomeTimeline } from 'soapbox/actions/timelines';
import PullToRefresh from 'soapbox/components/pull-to-refresh';
import { Column, Stack, Text } from 'soapbox/components/ui';
import Timeline from 'soapbox/features/ui/components/timeline';
import { useAppSelector, useAppDispatch, useFeatures } from 'soapbox/hooks';

const messages = defineMessages({
  title: { id: 'column.home', defaultMessage: 'Home' },
});

const HomeTimeline: React.FC = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const features = useFeatures();

  const polling = useRef<NodeJS.Timer | null>(null);

  const isPartial = useAppSelector(state => state.timelines.get('home')?.isPartial === true);
  const currentAccountId = useAppSelector(state => state.timelines.get('home')?.feedAccountId);
  const siteTitle = useAppSelector(state => state.instance.title);

  const handleLoadMore = (maxId: string) => {
    dispatch(expandHomeTimeline({ maxId, accountId: currentAccountId }));
  };

  // Mastodon generates the feed in Redis, and can return a partial timeline
  // (HTTP 206) for new users. Poll until we get a full page of results.
  const checkIfReloadNeeded = () => {
    if (isPartial) {
      polling.current = setInterval(() => {
        dispatch(expandHomeTimeline());
      }, 3000);
    } else {
      stopPolling();
    }
  };

  const stopPolling = () => {
    if (polling.current) {
      clearInterval(polling.current);
      polling.current = null;
    }
  };

  const handleRefresh = () => {
    return dispatch(expandHomeTimeline({ maxId: null, accountId: currentAccountId }));
  };

  useEffect(() => {
    checkIfReloadNeeded();

    return () => {
      stopPolling();
    };
  }, [isPartial]);

  return (
    <Column label={intl.formatMessage(messages.title)} transparent>
      <PullToRefresh onRefresh={handleRefresh}>
        <Timeline
          scrollKey='home_timeline'
          onLoadMore={handleLoadMore}
          timelineId='home'
          divideType='space'
          emptyMessage={
            <Stack space={1}>
              <Text size='xl' weight='medium' align='center'>
                <FormattedMessage
                  id='empty_column.home.title'
                  defaultMessage="You're not following anyone yet"
                />
              </Text>

              <Text theme='muted' align='center'>
                <FormattedMessage
                  id='empty_column.home.subtitle'
                  defaultMessage='{siteTitle} gets more interesting once you follow other users.'
                  values={{ siteTitle }}
                />
              </Text>

              {features.federating && (
                <Text theme='muted' align='center'>
                  <FormattedMessage
                    id='empty_column.home'
                    defaultMessage='Or you can visit {public} to get started and meet other users.'
                    values={{
                      public: (
                        <Link to='/timeline/local' className='text-primary-600 dark:text-primary-400 hover:underline'>
                          <FormattedMessage id='empty_column.home.local_tab' defaultMessage='the {site_title} tab' values={{ site_title: siteTitle }} />
                        </Link>
                      ),
                    }}
                  />
                </Text>
              )}
            </Stack>
          }
        />
      </PullToRefresh>
    </Column>
  );
};

export default HomeTimeline;
