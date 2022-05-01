import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { __stub } from 'soapbox/api';

import { fireEvent, render, screen, waitFor } from '../../../../jest/test-helpers';
import PasswordResetConfirm from '../password_reset_confirm';

const TestableComponent = () => (
  <Switch>
    <Route path='/edit' exact><PasswordResetConfirm /></Route>
    <Route path='/' exact><span data-testid='home'>Homepage</span></Route>
  </Switch>
);

describe('<PasswordResetConfirm />', () => {
  it('handles successful responses from the API', async() => {
    __stub(mock => {
      mock.onPost('/api/v1/truth/password_reset/confirm')
        .reply(200, {});
    });

    render(
      <TestableComponent />,
      {},
      null,
      { initialEntries: ['/edit'] },
    );

    fireEvent.submit(
      screen.getByTestId('form'), {
        preventDefault: () => {},
      },
    );

    await waitFor(() => {
      expect(screen.getByTestId('home')).toHaveTextContent('Homepage');
      expect(screen.queryByTestId('form-group-error')).not.toBeInTheDocument();
    });
  });

  it('handles failed responses from the API', async() => {
    __stub(mock => {
      mock.onPost('/api/v1/truth/password_reset/confirm')
        .reply(403, {});
    });

    render(
      <TestableComponent />,
      {},
      null,
      { initialEntries: ['/edit'] },
    );

    await fireEvent.submit(
      screen.getByTestId('form'), {
        preventDefault: () => {},
      },
    );

    await waitFor(() => {
      expect(screen.queryByTestId('home')).not.toBeInTheDocument();
      expect(screen.queryByTestId('form-group-error')).toBeInTheDocument();
    });
  });
});
