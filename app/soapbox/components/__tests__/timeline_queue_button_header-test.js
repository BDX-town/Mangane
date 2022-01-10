import React from 'react';
import { defineMessages } from 'react-intl';

import { createComponent } from 'soapbox/test_helpers';

import TimelineQueueButtonHeader from '../timeline_queue_button_header';

const messages = defineMessages({
  queue: { id: 'status_list.queue_label', defaultMessage: 'Click to see {count} new {count, plural, one {post} other {posts}}' },
});

describe('<TimelineQueueButtonHeader />', () => {
  it('renders correctly', () => {
    expect(createComponent(
      <TimelineQueueButtonHeader
        key='timeline-queue-button-header'
        onClick={() => {}} // eslint-disable-line react/jsx-no-bind
        count={0}
        message={messages.queue}
      />,
    ).toJSON()).toMatchSnapshot();

    expect(createComponent(
      <TimelineQueueButtonHeader
        key='timeline-queue-button-header'
        onClick={() => {}} // eslint-disable-line react/jsx-no-bind
        count={1}
        message={messages.queue}
      />,
    ).toJSON()).toMatchSnapshot();

    expect(createComponent(
      <TimelineQueueButtonHeader
        key='timeline-queue-button-header'
        onClick={() => {}} // eslint-disable-line react/jsx-no-bind
        count={9999999}
        message={messages.queue}
      />,
    ).toJSON()).toMatchSnapshot();
  });
});
