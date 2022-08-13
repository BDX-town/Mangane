import React from 'react';
import { defineMessages } from 'react-intl';

import { render, screen } from '../../jest/test-helpers';
import ScrollTopButton from '../scroll-top-button';

const messages = defineMessages({
  queue: { id: 'status_list.queue_label', defaultMessage: 'Click to see {count} new {count, plural, one {post} other {posts}}' },
});

describe('<ScrollTopButton />', () => {
  it('renders correctly', async() => {
    render(
      <ScrollTopButton
        key='scroll-top-button'
        onClick={() => {}}
        count={0}
        message={messages.queue}
      />,
    );
    expect(screen.queryAllByRole('link')).toHaveLength(0);

    render(
      <ScrollTopButton
        key='scroll-top-button'
        onClick={() => {}}
        count={1}
        message={messages.queue}
      />,
    );
    expect(screen.getByText('Click to see 1 new post')).toBeInTheDocument();

    render(
      <ScrollTopButton
        key='scroll-top-button'
        onClick={() => {}}
        count={9999999}
        message={messages.queue}
      />,
    );
    expect(screen.getByText('Click to see 9999999 new posts')).toBeInTheDocument();
  });
});
