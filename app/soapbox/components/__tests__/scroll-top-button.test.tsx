import React from 'react';
import { defineMessages } from 'react-intl';

import { fireEvent, render, screen, waitFor } from '../../jest/test-helpers';
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
        threshold={0}
      />,
    );
    Object.defineProperty(document.documentElement, 'scrollTop', { configurable: true, value: 1 });
    fireEvent.scroll(window);
    await waitFor(() => expect(screen.getByText('Click to see 1 new post')).toBeInTheDocument());

    render(
      <ScrollTopButton
        key='scroll-top-button'
        onClick={() => {}}
        count={9999999}
        message={messages.queue}
        threshold={0}
      />,
    );
    fireEvent.scroll(window);
    await waitFor(() => expect(screen.getByText('Click to see 9999999 new posts')).toBeInTheDocument());
  });
});
