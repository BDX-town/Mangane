import React, { useEffect, useRef } from 'react';
import { defineMessages, useIntl, FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { expandHomeTimeline } from 'soapbox/actions/timelines';
import { Column } from 'soapbox/components/ui';
import Timeline from 'soapbox/features/ui/components/timeline';
import { useAppSelector, useAppDispatch } from 'soapbox/hooks';

const messages = defineMessages({
  title: { id: 'column.home', defaultMessage: 'Home' },
});

const HomeTimeline: React.FC = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const polling = useRef<NodeJS.Timer | null>(null);

  const isPartial = useAppSelector(state => state.timelines.getIn(['home', 'isPartial']) === true);
  const siteTitle = useAppSelector(state => state.instance.title);

  const handleLoadMore = (maxId: string) => {
    dispatch(expandHomeTimeline({ maxId }));
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
    return dispatch(expandHomeTimeline());
  };

  useEffect(() => {
    checkIfReloadNeeded();

    return () => {
      stopPolling();
    };
  }, [isPartial]);

  return (
    <Column label={intl.formatMessage(messages.title)} transparent>
      <Timeline
        scrollKey='home_timeline'
        onLoadMore={handleLoadMore}
        onRefresh={handleRefresh}
        timelineId='home'
        divideType='space'
        emptyMessage={<FormattedMessage id='empty_column.home' defaultMessage='Your home timeline is empty! Visit {public} to get started and meet other users.' values={{ public: <Link to='/timeline/local'><FormattedMessage id='empty_column.home.local_tab' defaultMessage='the {site_title} tab' values={{ site_title: siteTitle }} /></Link> }} />}
      />
    </Column>
  );
};

export default HomeTimeline;
