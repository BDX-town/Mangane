import { Map as ImmutableMap, fromJS } from 'immutable';
import React from 'react';

import { render, screen } from '../../../../jest/test-helpers';
import TrendsPanel from '../trends-panel';

describe('<TrendsPanel />', () => {
  it('renders trending hashtags', () => {
    const store = {
      trends: ImmutableMap({
        items: fromJS([{
          name: 'hashtag 1',
          history: [{ accounts: [] }],
        }]),
      }),
    };

    render(<TrendsPanel limit={1} />, null, store);
    expect(screen.getByTestId('hashtag')).toHaveTextContent(/hashtag 1/i);
  });

  it('renders multiple trends', () => {
    const store = {
      trends: ImmutableMap({
        items: fromJS([
          {
            name: 'hashtag 1',
            history: [{ accounts: [] }],
          },
          {
            name: 'hashtag 2',
            history: [{ accounts: [] }],
          },
        ]),
      }),
    };

    render(<TrendsPanel limit={3} />, null, store);
    expect(screen.queryAllByTestId('hashtag')).toHaveLength(2);
  });

  it('respects the limit prop', () => {
    const store = {
      trends: ImmutableMap({
        items: fromJS([
          {
            name: 'hashtag 1',
            history: [{ accounts: [] }],
          },
          {
            name: 'hashtag 2',
            history: [{ accounts: [] }],
          },
        ]),
      }),
    };

    render(<TrendsPanel limit={1} />, null, store);
    expect(screen.queryAllByTestId('hashtag')).toHaveLength(1);
  });

  it('renders empty', () => {
    const store = {
      trends: ImmutableMap({
        items: fromJS([]),
      }),
    };

    render(<TrendsPanel limit={1} />, null, store);
    expect(screen.queryAllByTestId('hashtag')).toHaveLength(0);
  });
});
