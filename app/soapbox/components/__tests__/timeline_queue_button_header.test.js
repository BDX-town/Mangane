import { fromJS } from 'immutable';
import React from 'react';
import { defineMessages } from 'react-intl';

import { render, screen } from '../../jest/test-helpers';
import TimelineQueueButtonHeader from '../timeline_queue_button_header';

const messages = defineMessages({
  queue: { id: 'status_list.queue_label', defaultMessage: 'Click to see {count} new {count, plural, one {post} other {posts}}' },
});

describe('<TimelineQueueButtonHeader />', () => {
  it('renders correctly', async() => {
    render(
      <TimelineQueueButtonHeader
        key='timeline-queue-button-header'
        onClick={() => {}} // eslint-disable-line react/jsx-no-bind
        timelineId='home'
        message={messages.queue}
      />,
      undefined,
      { timelines: fromJS({ home: { totalQueuedItemsCount: 0 } }) },
    );
    expect(screen.queryAllByRole('link')).toHaveLength(0);

    render(
      <TimelineQueueButtonHeader
        key='timeline-queue-button-header'
        onClick={() => {}} // eslint-disable-line react/jsx-no-bind
        timelineId='home'
        message={messages.queue}
      />,
      undefined,
      { timelines: fromJS({ home: { totalQueuedItemsCount: 1 } }) },
    );
    expect(screen.getByText(/Click to see\s+1\s+new post/, { hidden: true })).toBeInTheDocument();

    render(
      <TimelineQueueButtonHeader
        key='timeline-queue-button-header'
        onClick={() => {}} // eslint-disable-line react/jsx-no-bind
        timelineId='home'
        message={messages.queue}
      />,
      undefined,
      { timelines: fromJS({ home: { totalQueuedItemsCount: 9999999 } }) },
    );
    expect(screen.getByText(/10.*M/, { hidden: true })).toBeInTheDocument();
  });
});
