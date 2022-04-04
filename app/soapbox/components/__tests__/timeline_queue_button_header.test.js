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
        count={0}
        message={messages.queue}
      />,
    );
    expect(screen.queryAllByRole('link')).toHaveLength(0);

    render(
      <TimelineQueueButtonHeader
        key='timeline-queue-button-header'
        onClick={() => {}} // eslint-disable-line react/jsx-no-bind
        count={1}
        message={messages.queue}
      />,
    );
    expect(screen.getByText('Click to see 1 new post', { hidden: true })).toBeInTheDocument();

    render(
      <TimelineQueueButtonHeader
        key='timeline-queue-button-header'
        onClick={() => {}} // eslint-disable-line react/jsx-no-bind
        count={9999999}
        message={messages.queue}
      />,
    );
    expect(screen.getByText('Click to see 9999999 new posts', { hidden: true })).toBeInTheDocument();
  });
});
