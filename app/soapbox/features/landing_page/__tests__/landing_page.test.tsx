import * as React from 'react';

import LandingPage from '..';
import { rememberInstance } from '../../../actions/instance';
import { SOAPBOX_CONFIG_REMEMBER_SUCCESS } from '../../../actions/soapbox';
import { PEPE_FETCH_INSTANCE_SUCCESS } from '../../../actions/verification';
import { render, screen, rootReducer, applyActions } from '../../../jest/test-helpers';

describe('<LandingPage />', () => {
  it('renders a RegistrationForm for an open Pleroma instance', () => {

    const state = rootReducer(undefined, {
      type: rememberInstance.fulfilled.type,
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
      type: rememberInstance.fulfilled.type,
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

  it('renders Pepe flow if Pepe extension is enabled', () => {

    const state = applyActions(undefined, [{
      type: SOAPBOX_CONFIG_REMEMBER_SUCCESS,
      soapboxConfig: {
        extensions: {
          pepe: {
            enabled: true,
          },
        },
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
      type: rememberInstance.fulfilled.type,
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
