import React from 'react';

import { normalizeInstance } from 'soapbox/normalizers';

import { fireEvent, render, screen } from '../../../../jest/test-helpers';
import LoginForm from '../login_form';

describe('<LoginForm />', () => {
  it('renders for Pleroma', () => {
    const mockFn = jest.fn();
    const store = {
      instance: normalizeInstance({
        version: '2.7.2 (compatible; Pleroma 2.3.0)',
      }),
    };

    render(<LoginForm handleSubmit={mockFn} isLoading={false} />, undefined, store);

    expect(screen.getByRole('heading')).toHaveTextContent(/sign in/i);
  });

  it('renders for Mastodon', () => {
    const mockFn = jest.fn();
    const store = {
      instance: normalizeInstance({
        version: '3.0.0',
      }),
    };

    render(<LoginForm handleSubmit={mockFn} isLoading={false} />, undefined, store);

    expect(screen.getByRole('heading')).toHaveTextContent(/sign in/i);
  });

  it('responds to the handleSubmit prop', () => {
    const mockFn = jest.fn();
    render(<LoginForm handleSubmit={mockFn} isLoading={false} />);
    fireEvent.submit(screen.getByTestId(/button/i));

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('exposes labeled required fields and a keyboard-reachable password visibility control', () => {
    const mockFn = jest.fn();
    render(<LoginForm handleSubmit={mockFn} isLoading={false} />);

    const username = screen.getByRole('textbox', { name: 'Email or username' });
    const password = screen.getByPlaceholderText('Password');
    const visibility = screen.getByRole('button', { name: 'Show password' });

    expect(username).toBeRequired();
    expect(password).toBeRequired();
    expect(password).toHaveAttribute('type', 'password');
    expect(visibility).not.toHaveAttribute('tabindex', '-1');

    fireEvent.click(visibility);

    expect(password).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: 'Hide password' })).toBeInTheDocument();
  });
});
