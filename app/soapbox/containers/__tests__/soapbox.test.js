import React from 'react';

import { __stub as stub } from 'soapbox/api';
import { render, screen, waitFor } from 'soapbox/jest/test-helpers';

import Soapbox from '../soapbox';

describe('<Soapbox />', () => {
  describe('without a user or instance', () => {
    beforeEach(() => {
      stub(mock => {
        mock.onGet('/api/v1/instance').reply(404, '');
      });
    });

    it('renders external login', async() => {
      render(<Soapbox />);

      await waitFor(() => {
        expect(location.href.endsWith('/login/external')).toBeTruthy();
        expect(screen.getByTestId('external-login')).toBeInTheDocument();
      });

    });
  });

  describe('without a user', () => {
    beforeEach(() => {
      stub(mock => {
        mock.onGet('/api/v1/instance')
          .reply(200, require('soapbox/__fixtures__/pleroma-instance.json'));
      });
    });

    it('renders the homepage', async() => {
      render(<Soapbox />);

      waitFor(() => {
        expect(screen.getByTestId('homepage')).toBeInTheDocument();
        expect(screen.getByText('Gleasonator')).toBeInTheDocument();
        expect(screen.getByText('Speak freely.')).toBeInTheDocument();
      });
    });
  });
});
