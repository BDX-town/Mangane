import userEvent from '@testing-library/user-event';
import { Map as ImmutableMap } from 'immutable';
import React from 'react';

import { __stub } from 'soapbox/api';

import { render, screen, waitFor } from '../../../jest/test-helpers';
import FeedCarousel from '../feed-carousel';

jest.mock('../../../hooks/useDimensions', () => ({
  useDimensions: () => [{ scrollWidth: 190 }, null, { width: 100 }],
}));

(window as any).ResizeObserver = class ResizeObserver {

  observe() { }
  disconnect() { }

};

describe('<FeedCarousel />', () => {
  let store: any;

  describe('with "feedUserFiltering" disabled', () => {
    beforeEach(() => {
      store = {
        instance: {
          version: '2.7.2 (compatible; Pleroma 2.4.52-1337-g4779199e.gleasonator+soapbox)',
          pleroma: ImmutableMap({
            metadata: ImmutableMap({
              features: [],
            }),
          }),
        },
      };
    });

    it('should render nothing', () => {
      render(<FeedCarousel />, undefined, store);

      expect(screen.queryAllByTestId('feed-carousel')).toHaveLength(0);
    });
  });

  describe('with "feedUserFiltering" enabled', () => {
    beforeEach(() => {
      store = {
        instance: {
          version: '3.4.1 (compatible; TruthSocial 1.0.0)',
          pleroma: ImmutableMap({
            metadata: ImmutableMap({
              features: [],
            }),
          }),
        },
      };
    });

    describe('with avatars', () => {
      beforeEach(() => {
        __stub((mock) => {
          mock.onGet('/api/v1/truth/carousels/avatars')
            .reply(200, [
              { account_id: '1', acct: 'a', account_avatar: 'https://example.com/some.jpg' },
              { account_id: '2', acct: 'b', account_avatar: 'https://example.com/some.jpg' },
              { account_id: '3', acct: 'c', account_avatar: 'https://example.com/some.jpg' },
              { account_id: '4', acct: 'd', account_avatar: 'https://example.com/some.jpg' },
            ]);
        });
      });

      it('should render the Carousel', async() => {
        render(<FeedCarousel />, undefined, store);

        await waitFor(() => {
          expect(screen.queryAllByTestId('feed-carousel')).toHaveLength(1);
        });
      });
    });

    describe('with 0 avatars', () => {
      beforeEach(() => {
        __stub((mock) => mock.onGet('/api/v1/truth/carousels/avatars').reply(200, []));
      });

      it('renders nothing', async() => {
        render(<FeedCarousel />, undefined, store);

        await waitFor(() => {
          expect(screen.queryAllByTestId('feed-carousel')).toHaveLength(0);
        });
      });
    });

    describe('with a failed request to the API', () => {
      beforeEach(() => {
        __stub((mock) => mock.onGet('/api/v1/truth/carousels/avatars').networkError());
      });

      it('renders the error message', async() => {
        render(<FeedCarousel />, undefined, store);

        await waitFor(() => {
          expect(screen.getByTestId('feed-carousel-error')).toBeInTheDocument();
        });
      });
    });

    describe('with multiple pages of avatars', () => {
      beforeEach(() => {
        __stub((mock) => {
          mock.onGet('/api/v1/truth/carousels/avatars')
            .reply(200, [
              { account_id: '1', acct: 'a', account_avatar: 'https://example.com/some.jpg' },
              { account_id: '2', acct: 'b', account_avatar: 'https://example.com/some.jpg' },
              { account_id: '3', acct: 'c', account_avatar: 'https://example.com/some.jpg' },
              { account_id: '4', acct: 'd', account_avatar: 'https://example.com/some.jpg' },
            ]);
        });

        Element.prototype.getBoundingClientRect = jest.fn(() => {
          return {
            width: 200,
            height: 120,
            x: 0,
            y: 0,
            toJSON: () => null,
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
          };
        });
      });

      it('should render the correct prev/next buttons', async() => {
        const user = userEvent.setup();
        render(<FeedCarousel />, undefined, store);

        await waitFor(() => {
          expect(screen.getByTestId('next-page')).toBeInTheDocument();
          expect(screen.queryAllByTestId('prev-page')).toHaveLength(0);
        });

        await user.click(screen.getByTestId('next-page'));

        await waitFor(() => {
          expect(screen.getByTestId('prev-page')).toBeInTheDocument();
          expect(screen.queryAllByTestId('next-page')).toHaveLength(0);
        });
      });
    });
  });
});
