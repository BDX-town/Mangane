import React, { useEffect } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { changeSetting } from 'soapbox/actions/settings';
import { connectPublicStream } from 'soapbox/actions/streaming';
import { expandPublicTimeline } from 'soapbox/actions/timelines';
import PullToRefresh from 'soapbox/components/pull-to-refresh';
import SubNavigation from 'soapbox/components/sub_navigation';
import { Column } from 'soapbox/components/ui';
import Accordion from 'soapbox/features/ui/components/accordion';
import { useAppDispatch, useAppSelector, useSettings } from 'soapbox/hooks';

import PinnedHostsPicker from '../remote_timeline/components/pinned_hosts_picker';
import Timeline from '../ui/components/timeline';

import ColumnSettings from './containers/column_settings_container';

const messages = defineMessages({
  title: { id: 'column.public', defaultMessage: 'Fediverse timeline' },
  dismiss: { id: 'fediverse_tab.explanation_box.dismiss', defaultMessage: 'Don\'t show again' },
});

const CommunityTimeline = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const settings = useSettings();
  const onlyMedia = settings.getIn(['public', 'other', 'onlyMedia']);

  const timelineId = 'public';

  const siteTitle = useAppSelector((state) => state.instance.title);
  const explanationBoxExpanded = settings.get('explanationBox');
  const showExplanationBox = settings.get('showExplanationBox');

  const explanationBoxMenu = () => {
    return [{ text: intl.formatMessage(messages.dismiss), action: dismissExplanationBox }];
  };

  const dismissExplanationBox = () => {
    dispatch(changeSetting(['showExplanationBox'], false));
  };

  const toggleExplanationBox = (setting: boolean) => {
    dispatch(changeSetting(['explanationBox'], setting));
  };

  const handleLoadMore = (maxId: string) => {
    dispatch(expandPublicTimeline({ maxId, onlyMedia }));
  };

  const handleRefresh = () => {
    return dispatch(expandPublicTimeline({ onlyMedia } as any));
  };

  useEffect(() => {
    dispatch(expandPublicTimeline({ onlyMedia } as any));
    const disconnect = dispatch(connectPublicStream({ onlyMedia }));

    return () => {
      disconnect();
    };
  }, [onlyMedia]);

  return (
    <Column label={intl.formatMessage(messages.title)} transparent withHeader={false}>
      <SubNavigation message={intl.formatMessage(messages.title)} settings={ColumnSettings} />
      <PinnedHostsPicker />
      {showExplanationBox && <div className='mb-4'>
        <Accordion
          headline={<FormattedMessage id='fediverse_tab.explanation_box.title' defaultMessage='What is the Fediverse?' />}
          menu={explanationBoxMenu()}
          expanded={explanationBoxExpanded}
          onToggle={toggleExplanationBox}
        >
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
        </Accordion>
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
