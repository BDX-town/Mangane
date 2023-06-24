import React, { useEffect } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { changeSetting } from 'soapbox/actions/settings';
import { connectPublicStream } from 'soapbox/actions/streaming';
import { expandPublicTimeline, expandBubbleTimeline } from 'soapbox/actions/timelines';
import PullToRefresh from 'soapbox/components/pull-to-refresh';
import { Button, Column, Text } from 'soapbox/components/ui';
import { useAppDispatch, useAppSelector, useSettings, useFeatures, useOwnAccount } from 'soapbox/hooks';

import PinnedHostsPicker from '../remote_timeline/components/pinned_hosts_picker';
import Timeline from '../ui/components/timeline';

const messages = defineMessages({
  title: { id: 'column.public', defaultMessage: 'Explore' },
});

const CommunityTimeline = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const settings = useSettings();
  const account = useOwnAccount();
  const onlyMedia = settings.getIn(['public', 'other', 'onlyMedia']);


  const siteTitle = useAppSelector((state) => state.instance.title);
  const showExplanationBox = settings.get('showExplanationBox');

  const features = useFeatures();
  const bubbleTimeline = account && features.bubbleTimeline && settings.getIn(['public', 'bubble']);

  const timelineId = React.useMemo(() => !bubbleTimeline ? 'public' : 'bubble', [bubbleTimeline]);


  const dismissExplanationBox = React.useCallback(() => {
    dispatch(changeSetting(['showExplanationBox'], false));
  }, [dispatch]);

  const handleLoadMore = React.useCallback((maxId: string) => {
    if(!bubbleTimeline) {
      dispatch(expandPublicTimeline({ maxId, onlyMedia }));
    } else {
      dispatch(expandBubbleTimeline({ maxId, onlyMedia }));
    }
  }, [bubbleTimeline, dispatch, onlyMedia]);

  const handleRefresh = React.useCallback(() => {
    if(!bubbleTimeline) {
      return dispatch(expandPublicTimeline({ onlyMedia } as any));
    } else {
      return dispatch(expandBubbleTimeline({ onlyMedia } as any));
    }
  }, [bubbleTimeline, dispatch, onlyMedia]);

  useEffect(() => {
    if(!bubbleTimeline) {
      dispatch(expandPublicTimeline({ onlyMedia } as any));
      const disconnect = dispatch(connectPublicStream({ onlyMedia }));

      return () => {
        disconnect();
      };
    } else {
      dispatch(expandBubbleTimeline({ onlyMedia } as any));
      // bubble timeline doesnt have streaming for now
    }
  }, [onlyMedia, bubbleTimeline]);

  return (
    <Column label={intl.formatMessage(messages.title)} transparent withHeader={false}>
      <PinnedHostsPicker />
      {showExplanationBox && <div className='mb-4'>
          <Text size="lg" weight="bold" className="mb-2">
            <FormattedMessage id='fediverse_tab.explanation_box.title' defaultMessage='What is the Fediverse?' />
          </Text>
          <FormattedMessage
            id='fediverse_tab.explanation_box.explanation'
            defaultMessage='{site_title} is part of the Fediverse, a social network made up of thousands of independent social media sites (aka "servers"). The posts you see here are from 3rd-party servers. You have the freedom to engage with them, or to block any server you don&apos;t like. Pay attention to the full username after the second @ symbol to know which server a post is from. To see only {site_title} posts, visit {local}.'
            values={{
              site_title: siteTitle,
              local: (
                <Link to='/timeline/local'>
                  <FormattedMessage
                    id='empty_column.home.local_tab'
                    defaultMessage='the {site_title} tab'
                    values={{ site_title: siteTitle }}
                  />
                </Link>
              ),
            }}
          />
          {
            bubbleTimeline && (
              <p className='mt-2'>
                <FormattedMessage id='fediverse_tab.explanation_box.bubble' defaultMessage='This timeline shows you all the statuses published on a selection of other instances curated by your moderators.' />
              </p>
            )
          }
          <div className="text-right">
            <Button theme="link" onClick={dismissExplanationBox}>
              <FormattedMessage id='fediverse_tab.explanation_box.dismiss' defaultMessage="Don\'t show again" />
            </Button>
          </div>
      </div>}
      <PullToRefresh onRefresh={handleRefresh}>
        <Timeline
          scrollKey={`${timelineId}_timeline`}
          timelineId={`${timelineId}${onlyMedia ? ':media' : ''}`}
          onLoadMore={handleLoadMore}
          emptyMessage={<FormattedMessage id='empty_column.public' defaultMessage='There is nothing here! Write something publicly, or manually follow users from other servers to fill it up' />}
          divideType='space'
        />
      </PullToRefresh>
    </Column>
  );
};

export default CommunityTimeline;
