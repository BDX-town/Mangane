import userEvent from '@testing-library/user-event';
import { Map as ImmutableMap } from 'immutable';
import React from 'react';

import { __stub } from 'soapbox/api';
import { fireEvent, render, screen } from 'soapbox/jest/test-helpers';

import AgeVerification from '../age-verification';

describe('<AgeVerification />', () => {
  let store: any;

  beforeEach(() => {
    store = {
      verification: ImmutableMap({
        ageMinimum: 13,
      }),
    };

    __stub(mock => {
      mock.onPost('/api/v1/pepe/verify_age/confirm')
        .reply(200, {});
    });
  });

  it('successfully renders the Birthday step', async() => {
    render(
      <AgeVerification />,
      {},
      store,
    );
    expect(screen.getByRole('heading')).toHaveTextContent('Enter your birth date');
  });

  it('selects a date', async() => {
    render(
      <AgeVerification />,
      {},
      store,
    );

    await userEvent.selectOptions(
      screen.getByTestId('datepicker-year'),
      screen.getByRole('option', { name: '2020' }),
    );

    fireEvent.submit(
      screen.getByRole('button'), {
        preventDefault: () => {},
      },
    );
  });
});
