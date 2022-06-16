import React from 'react';

import { normalizePoll } from 'soapbox/normalizers/poll';

import { render, screen } from '../../../jest/test-helpers';
import PollFooter from '../poll-footer';


let poll = normalizePoll({
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
