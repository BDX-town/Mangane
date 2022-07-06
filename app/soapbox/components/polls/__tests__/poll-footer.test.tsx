import userEvent from '@testing-library/user-event';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';

import { __stub } from 'soapbox/api';
import { normalizePoll } from 'soapbox/normalizers/poll';

import { mockStore, render, screen, rootState } from '../../../jest/test-helpers';
import PollFooter from '../poll-footer';

let poll = normalizePoll({
  id: 1,
  options: [{ title: 'Apples', votes_count: 0 }],
  emojis: [],
  expired: false,
  expires_at: '2020-03-24T19:33:06.000Z',
  multiple: true,
  voters_count: 0,
  votes_count: 0,
  own_votes: null,
  voted: false,
});

describe('<PollFooter />', () => {
  describe('with "showResults" enabled', () => {
    it('renders the Refresh button', () => {
      render(<PollFooter poll={poll} showResults selected={{}} />);

      expect(screen.getByTestId('poll-footer')).toHaveTextContent('Refresh');
    });

    it('responds to the Refresh button', async() => {
      __stub((mock) => {
        mock.onGet('/api/v1/polls/1').reply(200, {});
      });

      const user = userEvent.setup();
      const store = mockStore(rootState);
      render(
        <Provider store={store}>
          <IntlProvider locale='en'>
            <PollFooter poll={poll} showResults selected={{}} />
          </IntlProvider>
        </Provider>,
      );

      await user.click(screen.getByTestId('poll-refresh'));
      const actions = store.getActions();
      expect(actions).toEqual([
        { type: 'POLL_FETCH_REQUEST' },
        { type: 'POLLS_IMPORT', polls: [{}] },
        { type: 'POLL_FETCH_SUCCESS', poll: {} },
      ]);
    });

    it('does not render the Vote button', () => {
      render(<PollFooter poll={poll} showResults selected={{}} />);

      expect(screen.queryAllByTestId('button')).toHaveLength(0);
    });

    describe('when the Poll has not expired', () => {
      beforeEach(() => {
        poll = normalizePoll({
          ...poll.toJS(),
          expired: false,
        });
      });

      it('renders time remaining', () => {
        render(<PollFooter poll={poll} showResults selected={{}} />);

        expect(screen.getByTestId('poll-expiration')).toHaveTextContent('Moments remaining');
      });
    });

    describe('when the Poll has expired', () => {
      beforeEach(() => {
        poll = normalizePoll({
          ...poll.toJS(),
          expired: true,
        });
      });

      it('renders closed', () => {
        render(<PollFooter poll={poll} showResults selected={{}} />);

        expect(screen.getByTestId('poll-expiration')).toHaveTextContent('Closed');
      });
    });
  });

  describe('with "showResults" disabled', () => {
    it('does not render the Refresh button', () => {
      render(<PollFooter poll={poll} showResults={false} selected={{}} />);

      expect(screen.getByTestId('poll-footer')).not.toHaveTextContent('Refresh');
    });

    describe('when the Poll is multiple', () => {
      beforeEach(() => {
        poll = normalizePoll({
          ...poll.toJS(),
          multiple: true,
        });
      });

      it('renders the Vote button', () => {
        render(<PollFooter poll={poll} showResults={false} selected={{}} />);

        expect(screen.getByTestId('button')).toHaveTextContent('Vote');
      });
    });

    describe('when the Poll is not multiple', () => {
      beforeEach(() => {
        poll = normalizePoll({
          ...poll.toJS(),
          multiple: false,
        });
      });

      it('does not render the Vote button', () => {
        render(<PollFooter poll={poll} showResults={false} selected={{}} />);

        expect(screen.queryAllByTestId('button')).toHaveLength(0);
      });
    });
  });
});
