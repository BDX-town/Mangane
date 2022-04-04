import React from 'react';

import { normalizeAccount } from 'soapbox/normalizers';

import { render, screen } from '../../jest/test-helpers';
import DisplayName from '../display_name';

describe('<DisplayName />', () => {
  it('renders display name + account name', () => {
    const account = normalizeAccount({ acct: 'bar@baz' });
    render(<DisplayName account={account} />);

    expect(screen.getByTestId('display-name')).toHaveTextContent('bar@baz');
  });
});
