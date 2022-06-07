import { List as ImmutableList } from 'immutable';
import React from 'react';

import { render, screen } from '../../../../jest/test-helpers';
import TrendsPanel from '../trends-panel';

describe('<TrendsPanel />', () => {
  it('renders trending hashtags', () => {
    const store = {
      trends: {
        items: ImmutableList([{
          name: 'hashtag 1',
          history: ImmutableList([{
            day: '1652745600',
            uses: '294',
            accounts: '180',
          }]),
        }]),
      },
    };

    render(<TrendsPanel limit={1} />, null, store);
    expect(screen.getByTestId('hashtag')).toHaveTextContent(/hashtag 1/i);
    expect(screen.getByTestId('hashtag')).toHaveTextContent(/180 people talking/i);
    expect(screen.getByTestId('sparklines')).toBeInTheDocument();
  });

  it('renders multiple trends', () => {
    const store = {
      trends: {
        items: ImmutableList([
          {
            name: 'hashtag 1',
            history: ImmutableList([{ accounts: [] }]),
          },
          {
            name: 'hashtag 2',
            history: ImmutableList([{ accounts: [] }]),
          },
        ]),
      },
    };

    render(<TrendsPanel limit={3} />, null, store);
    expect(screen.queryAllByTestId('hashtag')).toHaveLength(2);
  });

  it('respects the limit prop', () => {
    const store = {
      trends: {
        items: ImmutableList([
          {
            name: 'hashtag 1',
            history: ImmutableList([{ accounts: [] }]),
          },
          {
            name: 'hashtag 2',
            history: ImmutableList([{ accounts: [] }]),
          },
        ]),
      },
    };

    render(<TrendsPanel limit={1} />, null, store);
    expect(screen.queryAllByTestId('hashtag')).toHaveLength(1);
  });

  it('renders empty', () => {
    const store = {
      trends: {
        items: ImmutableList([]),
      },
    };

    render(<TrendsPanel limit={1} />, null, store);
    expect(screen.queryAllByTestId('hashtag')).toHaveLength(0);
  });
});
