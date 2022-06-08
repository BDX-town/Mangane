import React from 'react';

import { render, screen, rootState } from '../../jest/test-helpers';
import { normalizeStatus, normalizeAccount } from '../../normalizers';
import QuotedStatus from '../quoted-status';

describe('<QuotedStatus />', () => {
  it('renders content', () => {
    const account = normalizeAccount({
      id: '1',
      acct: 'alex',
    });

    const status = normalizeStatus({
      id: '1',
      account,
      content: 'hello world',
      contentHtml: 'hello world',
    });

    const state = rootState.setIn(['accounts', '1', account]);

    render(<QuotedStatus status={status} />, null, state);
    screen.getByText(/hello world/i);
    expect(screen.getByTestId('quoted-status')).toHaveTextContent(/hello world/i);
  });
});
