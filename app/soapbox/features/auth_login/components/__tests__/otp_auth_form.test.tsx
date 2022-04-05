import React from 'react';

import { render, screen } from '../../../../jest/test-helpers';
import OtpAuthForm from '../otp_auth_form';

describe('<OtpAuthForm />', () => {
  it('renders correctly', () => {
    render(<OtpAuthForm mfa_token={'12345'} />);

    expect(screen.getByRole('heading')).toHaveTextContent('OTP Login');
    expect(screen.getByTestId('form')).toBeInTheDocument();
  });
});
