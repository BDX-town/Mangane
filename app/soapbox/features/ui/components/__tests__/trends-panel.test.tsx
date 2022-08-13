import React from 'react';

import { __stub } from 'soapbox/api';

import { queryClient, render, screen, waitFor } from '../../../../jest/test-helpers';
import TrendsPanel from '../trends-panel';

describe('<TrendsPanel />', () => {
  beforeEach(() => {
    queryClient.clear();
  });

  describe('with hashtags', () => {
    beforeEach(() => {
      __stub((mock) => {
        mock.onGet('/api/v1/trends')
          .reply(200, [
            {
              name: 'hashtag 1',
              url: 'https://example.com',
              history: [{
                day: '1652745600',
                uses: '294',
                accounts: '180',
              }],
            },
            { name: 'hashtag 2', url: 'https://example.com' },
          ]);
      });
    });

    it('renders trending hashtags', async() => {
      render(<TrendsPanel limit={1} />);

      await waitFor(() => {
        expect(screen.getByTestId('hashtag')).toHaveTextContent(/hashtag 1/i);
        expect(screen.getByTestId('hashtag')).toHaveTextContent(/180 people talking/i);
        expect(screen.getByTestId('sparklines')).toBeInTheDocument();
      });
    });

    it('renders multiple trends', async() => {
      render(<TrendsPanel limit={3} />);

      await waitFor(() => {
        expect(screen.queryAllByTestId('hashtag')).toHaveLength(2);
      });
    });

    it('respects the limit prop', async() => {
      render(<TrendsPanel limit={1} />);

      await waitFor(() => {
        expect(screen.queryAllByTestId('hashtag')).toHaveLength(1);
      });
    });
  });

  describe('without hashtags', () => {
    beforeEach(() => {
      __stub((mock) => {
        mock.onGet('/api/v1/trends').reply(200, []);
      });
    });

    it('renders empty', async() => {
      render(<TrendsPanel limit={1} />);

      await waitFor(() => {
        expect(screen.queryAllByTestId('hashtag')).toHaveLength(0);
      });
    });
  });
});
