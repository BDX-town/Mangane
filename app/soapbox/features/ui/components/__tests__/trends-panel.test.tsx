import { List as ImmutableList, Record as ImmutableRecord } from 'immutable';
import React from 'react';

import { render, screen } from '../../../../jest/test-helpers';
import { normalizeTag } from '../../../../normalizers';
import TrendsPanel from '../trends-panel';

describe('<TrendsPanel />', () => {
  it('renders trending hashtags', () => {
    const store = {
      trends: ImmutableRecord({
        items: ImmutableList([
          normalizeTag({
            name: 'hashtag 1',
            history: [{
              day: '1652745600',
              uses: '294',
              accounts: '180',
            }],
          }),
        ]),
        isLoading: false,
      })(),
    };

    render(<TrendsPanel limit={1} />, undefined, store);
    expect(screen.getByTestId('hashtag')).toHaveTextContent(/hashtag 1/i);
    expect(screen.getByTestId('hashtag')).toHaveTextContent(/180 people talking/i);
    expect(screen.getByTestId('sparklines')).toBeInTheDocument();
  });

  it('renders multiple trends', () => {
    const store = {
      trends: ImmutableRecord({
        items: ImmutableList([
          normalizeTag({
            name: 'hashtag 1',
            history: ImmutableList([{ accounts: [] }]),
          }),
          normalizeTag({
            name: 'hashtag 2',
            history: ImmutableList([{ accounts: [] }]),
          }),
        ]),
        isLoading: false,
      })(),
    };

    render(<TrendsPanel limit={3} />, undefined, store);
    expect(screen.queryAllByTestId('hashtag')).toHaveLength(2);
  });

  it('respects the limit prop', () => {
    const store = {
      trends: ImmutableRecord({
        items: ImmutableList([
          normalizeTag({
            name: 'hashtag 1',
            history: [{ accounts: [] }],
          }),
          normalizeTag({
            name: 'hashtag 2',
            history: [{ accounts: [] }],
          }),
        ]),
        isLoading: false,
      })(),
    };

    render(<TrendsPanel limit={1} />, undefined, store);
    expect(screen.queryAllByTestId('hashtag')).toHaveLength(1);
  });

  it('renders empty', () => {
    const store = {
      trends: ImmutableRecord({
        items: ImmutableList([]),
        isLoading: false,
      })(),
    };

    render(<TrendsPanel limit={1} />, undefined, store);
    expect(screen.queryAllByTestId('hashtag')).toHaveLength(0);
  });
});
