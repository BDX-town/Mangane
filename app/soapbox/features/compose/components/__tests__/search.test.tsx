import userEvent from '@testing-library/user-event';
import React from 'react';

import { __stub } from 'soapbox/api';

import { render, screen } from '../../../../jest/test-helpers';
import Search from '../search';

describe('<Search />', () => {
  it('successfully renders', async() => {
    render(<Search autosuggest />);
    expect(screen.getByLabelText('Search')).toBeInTheDocument();
  });

  it('handles onChange', async() => {
    __stub(mock => {
      mock.onGet('/api/v1/accounts/search').reply(200, [{ id: 1 }]);
    });
    const user = userEvent.setup();

    render(<Search autosuggest />);

    await user.type(screen.getByLabelText('Search'), '@jus');

    expect(screen.getByLabelText('Search')).toHaveValue('@jus');
    expect(screen.getByTestId('account')).toBeInTheDocument();
  });
});
