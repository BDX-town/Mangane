import * as React from 'react';

import { updateNotifications } from 'soapbox/actions/notifications';
import { render, screen, rootState, createTestStore } from 'soapbox/jest/test-helpers';

import Notification from '../notification';

/** Prepare the notification for use by the component */
const normalize = (notification: any) => {
  const store = createTestStore(rootState);
  store.dispatch(updateNotifications(notification) as any);
  const state = store.getState();

  return {
    // @ts-ignore
    notification: state.notifications.items.get(notification.id),
    state,
  };
};

describe('<Notification />', () => {
  it('renders a follow notification', async() => {
    const { notification, state } = normalize(require('soapbox/__fixtures__/notification-follow.json'));

    render(<Notification notification={notification} />, undefined, state);

    expect(screen.getByTestId('notification')).toBeInTheDocument();
    expect(screen.getByTestId('account')).toContainHTML('neko@rdrama.cc');
    expect(screen.getByTestId('message')).toHaveTextContent('Nekobit followed you');
  });

  describe('grouped notifications', () => {
    it('renders a grouped follow notification for more than 2', async() => {
      const { notification, state } = normalize({
        ...require('soapbox/__fixtures__/notification-follow.json'),
        total_count: 5,
      });

      render(<Notification notification={notification} />, undefined, state);

      expect(screen.getByTestId('notification')).toBeInTheDocument();
      expect(screen.getByTestId('account')).toContainHTML('neko@rdrama.cc');
      expect(screen.getByTestId('message')).toHaveTextContent('Nekobit + 4 others followed you');
    });

    it('renders a grouped follow notification for 1', async() => {
      const { notification, state } = normalize({
        ...require('soapbox/__fixtures__/notification-follow.json'),
        total_count: 2,
      });

      render(<Notification notification={notification} />, undefined, state);

      expect(screen.getByTestId('notification')).toBeInTheDocument();
      expect(screen.getByTestId('account')).toContainHTML('neko@rdrama.cc');
      expect(screen.getByTestId('message')).toHaveTextContent('Nekobit + 1 other followed you');
    });
  });

  it('renders a favourite notification', async() => {
    const { notification, state } = normalize(require('soapbox/__fixtures__/notification-favourite.json'));

    render(<Notification notification={notification} />, undefined, state);

    expect(screen.getByTestId('notification')).toContainHTML('Hollahollara@spinster.xyz');
    expect(screen.getByTestId('status')).toContainHTML('https://media.gleasonator.com');
  });

  it('renders a follow_request notification', async() => {
    const { notification, state } = normalize(require('soapbox/__fixtures__/notification-follow_request.json'));

    render(<Notification notification={notification} />, undefined, state);

    expect(screen.getByTestId('notification')).toBeInTheDocument();
    expect(screen.getByTestId('account')).toContainHTML('alex@spinster.xyz');
  });

  it('renders a mention notification', async() => {
    const { notification, state } = normalize(require('soapbox/__fixtures__/notification-mention.json'));

    render(<Notification notification={notification} />, undefined, state);

    expect(screen.getByTestId('notification')).toContainHTML('silverpill@mitra.social');
    expect(screen.getByTestId('status')).toContainHTML('ActivityPub spec');
  });

  it('renders a move notification', async() => {
    const { notification, state } = normalize(require('soapbox/__fixtures__/notification-move.json'));

    render(<Notification notification={notification} />, undefined, state);

    expect(screen.getByTestId('notification')).toContainHTML('alex@fedibird.com');
    expect(screen.getByTestId('account')).toContainHTML('benis911');
  });

  it('renders a pleroma:emoji_reaction notification', async() => {
    const { notification, state } = normalize(require('soapbox/__fixtures__/notification-pleroma-emoji_reaction.json'));

    render(<Notification notification={notification} />, undefined, state);

    expect(screen.getByTestId('notification')).toContainHTML('😮');
    expect(screen.getByTestId('status')).toContainHTML('Super Mario 64');
  });

  it('renders a pleroma:chat_mention notification', async() => {
    const { notification, state } = normalize(require('soapbox/__fixtures__/notification-pleroma-chat_mention.json'));

    render(<Notification notification={notification} />, undefined, state);

    expect(screen.getByTestId('notification')).toContainHTML('dave');
  });

  it('renders a poll notification', async() => {
    const { notification, state } = normalize(require('soapbox/__fixtures__/notification-poll.json'));

    render(<Notification notification={notification} />, undefined, state);

    expect(screen.getByTestId('notification')).toBeInTheDocument();
    expect(screen.getByTestId('status')).toContainHTML('what do you guys think?');
  });

  it('renders a reblog notification', async() => {
    const { notification, state } = normalize(require('soapbox/__fixtures__/notification-reblog.json'));

    render(<Notification notification={notification} />, undefined, state);

    expect(screen.getByTestId('notification')).toContainHTML('rob@nicecrew.digital');
    expect(screen.getByTestId('status')).toContainHTML('never downloaded TikTok');
  });
});
