import React from 'react';

import { __stub } from 'soapbox/api';

import { fireEvent, render, screen, waitFor } from '../../../jest/test-helpers';
import Registration from '../registration';

describe('<Registration />', () => {
  it('renders', () => {
    render(<Registration />);

    expect(screen.getByRole('heading')).toHaveTextContent(/register your account/i);
  });

  describe('with valid data', () => {
    beforeEach(() => {
      __stub(mock => {
        mock.onPost('/api/v1/pepe/accounts').reply(200, {});
        mock.onPost('/api/v1/apps').reply(200, {});
        mock.onPost('/oauth/token').reply(200, {});
        mock.onPost('/api/v1/accounts/verify_credentials').reply(200, {});
        mock.onGet('/api/v1/instance').reply(200, {});
      });
    });

    it('handles successful submission', async() => {
      render(<Registration />);

      await waitFor(() => {
        fireEvent.submit(screen.getByTestId('button'), { preventDefault: () => {} });
      });

      expect(screen.getByTestId('toast')).toHaveTextContent(/welcome to/i);
      expect(screen.queryAllByRole('heading')).toHaveLength(0);
    });
  });

  describe('with invalid data', () => {
    it('handles 422 errors', async() => {
      __stub(mock => {
        mock.onPost('/api/v1/pepe/accounts').reply(422, {});
      });

      render(<Registration />);

      await waitFor(() => {
        fireEvent.submit(screen.getByTestId('button'), { preventDefault: () => {} });
      });

      expect(screen.getByTestId('toast')).toHaveTextContent(/this username has already been taken/i);
    });

    it('handles generic errors', async() => {
      __stub(mock => {
        mock.onPost('/api/v1/pepe/accounts').reply(500, {});
      });

      render(<Registration />);

      await waitFor(() => {
        fireEvent.submit(screen.getByTestId('button'), { preventDefault: () => {} });
      });

      expect(screen.getByTestId('toast')).toHaveTextContent(/failed to register your account/i);
    });
  });
});
