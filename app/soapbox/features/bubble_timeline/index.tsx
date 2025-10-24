import React, { useEffect, useState } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { changeSetting } from 'soapbox/actions/settings';
import { expandBubbleTimeline } from 'soapbox/actions/timelines';
import PullToRefresh from 'soapbox/components/pull-to-refresh';
import SubNavigation from 'soapbox/components/sub_navigation';
import TimelineSettings from 'soapbox/components/timeline_settings';
import { Button, Column, IconButton, Text } from 'soapbox/components/ui';
import { useAppDispatch, useAppSelector, useSettings } from 'soapbox/hooks';

import Timeline from '../ui/components/timeline';

const messages = defineMessages({
  title: { id: 'tabs_bar.bubble', defaultMessage: 'Featured' },
  settings: { id: 'settings.settings', defaultMessage: 'Settings' },
});

const BubbleTimeline = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const [showSettings, setShowSettings] = useState(false);
  const settings = useSettings();
  const onlyMedia = settings.getIn(['bubble', 'other', 'onlyMedia']);
  const excludeReplies = settings.getIn(['bubble', 'shows', 'reply']);

  const siteTitle = useAppSelector((state) => state.instance.title);
  const showExplanationBox = settings.get('showExplanationBox');

  const dismissExplanationBox = React.useCallback(() => {
    dispatch(changeSetting(['showExplanationBox'], false));
  }, [dispatch]);

  const handleLoadMore = React.useCallback((maxId: string) => {
    dispatch(expandBubbleTimeline({ maxId, onlyMedia, excludeReplies }));
  }, [dispatch, excludeReplies, onlyMedia]);

  const handleRefresh = React.useCallback(() => {
    return dispatch(expandBubbleTimeline({ onlyMedia, excludeReplies } as any));
  }, [dispatch, excludeReplies, onlyMedia]);

  useEffect(() => {
    dispatch(expandBubbleTimeline({ onlyMedia, excludeReplies } as any));
    // bubble timeline doesnt have streaming for now
  }, [dispatch, excludeReplies, onlyMedia]);

  return (
    <>
      <Column label={intl.formatMessage(messages.title)} transparent withHeader={false}>
        <div className='px-4 py-4 flex justify-between items-center'>
          <SubNavigation className='mb-0' message={intl.formatMessage(messages.title)} />
          <IconButton
            src={!showSettings ? require('@tabler/icons/chevron-down.svg') : require('@tabler/icons/chevron-up.svg')}
            onClick={() => setShowSettings(!showSettings)}
            title={intl.formatMessage(messages.settings)}
          />
        </div>
        {
          showSettings && <TimelineSettings className='mb-3' timeline='bubble' onClose={() => setShowSettings(false)} />
        }
        {showExplanationBox && <div className='mb-4'>
          <Text size='lg' weight='bold' className='mb-2'>
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
          <p className='mt-2'>
            <FormattedMessage id='fediverse_tab.explanation_box.bubble' defaultMessage='This timeline shows you all the statuses published on a selection of other instances curated by your moderators.' />
          </p>
          <div className='text-right'>
            <Button theme='link' onClick={dismissExplanationBox}>
              <FormattedMessage id='fediverse_tab.explanation_box.dismiss' defaultMessage="Don\'t show again" />
            </Button>
          </div>
        </div>}
        <PullToRefresh onRefresh={handleRefresh}>
          <Timeline
            scrollKey={'bubble_timeline'}
            timelineId={`bubble${onlyMedia ? ':media' : ''}${excludeReplies ? ':exclude_replies' : ''}`}
            onLoadMore={handleLoadMore}
            emptyMessage={<FormattedMessage id='empty_column.public' defaultMessage='There is nothing here! Write something publicly, or manually follow users from other servers to fill it up' />}
            divideType='space'
          />
        </PullToRefresh>
      </Column>
    </>
  );
};

export default BubbleTimeline;
