import * as React from 'react';

import LandingPage from '..';
import { rememberInstance } from '../../../actions/instance';
import { PEPE_FETCH_INSTANCE_SUCCESS } from '../../../actions/verification';
import { render, screen, rootReducer, applyActions } from '../../../jest/test-helpers';

describe('<LandingPage />', () => {
  it('renders a RegistrationForm for an open Pleroma instance', () => {

    const state = rootReducer(undefined, {
      type: rememberInstance.fulfilled.toString(),
      payload: {
        version: '2.7.2 (compatible; Pleroma 2.3.0)',
        registrations: true,
      },
    });

    render(<LandingPage />, null, state);

    expect(screen.queryByTestId('registrations-open')).toBeInTheDocument();
    expect(screen.queryByTestId('registrations-closed')).not.toBeInTheDocument();
    expect(screen.queryByTestId('registrations-pepe')).not.toBeInTheDocument();
  });

  it('renders "closed" message for a closed Pleroma instance', () => {

    const state = rootReducer(undefined, {
      type: rememberInstance.fulfilled.toString(),
      payload: {
        version: '2.7.2 (compatible; Pleroma 2.3.0)',
        registrations: false,
      },
    });

    render(<LandingPage />, null, state);

    expect(screen.queryByTestId('registrations-closed')).toBeInTheDocument();
    expect(screen.queryByTestId('registrations-open')).not.toBeInTheDocument();
    expect(screen.queryByTestId('registrations-pepe')).not.toBeInTheDocument();
  });

  it('renders Pepe flow for an open Truth Social instance', () => {

    const state = applyActions(undefined, [{
      type: rememberInstance.fulfilled.toString(),
      payload: {
        version: '3.4.1 (compatible; TruthSocial 1.0.0)',
        registrations: false,
      },
    }, {
      type: PEPE_FETCH_INSTANCE_SUCCESS,
      instance: {
        registrations: true,
      },
    }], rootReducer);

    render(<LandingPage />, null, state);

    expect(screen.queryByTestId('registrations-pepe')).toBeInTheDocument();
    expect(screen.queryByTestId('registrations-open')).not.toBeInTheDocument();
    expect(screen.queryByTestId('registrations-closed')).not.toBeInTheDocument();
  });

  it('renders "closed" message for a Truth Social instance with Pepe closed', () => {

    const state = applyActions(undefined, [{
      type: rememberInstance.fulfilled.toString(),
      payload: {
        version: '3.4.1 (compatible; TruthSocial 1.0.0)',
        registrations: false,
      },
    }, {
      type: PEPE_FETCH_INSTANCE_SUCCESS,
      instance: {
        registrations: false,
      },
    }], rootReducer);

    render(<LandingPage />, null, state);

    expect(screen.queryByTestId('registrations-closed')).toBeInTheDocument();
    expect(screen.queryByTestId('registrations-pepe')).not.toBeInTheDocument();
    expect(screen.queryByTestId('registrations-open')).not.toBeInTheDocument();
  });
});
