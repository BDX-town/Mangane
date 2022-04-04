import { Map as ImmutableMap } from 'immutable';
import React from 'react';

import { render, screen } from '../../../../jest/test-helpers';
import LoginForm from '../login_form';

describe('<LoginForm />', () => {
  it('renders for Pleroma', () => {
    const store = {
      instance: ImmutableMap({
        version: '2.7.2 (compatible; Pleroma 2.3.0)',
      }),
    };

    render(<LoginForm />, null, store);

    expect(screen.getByRole('heading')).toHaveTextContent('Sign In');
  });

  it('renders for Mastodon', () => {
    const store = {
      instance: ImmutableMap({
        version: '3.0.0',
      }),
    };

    render(<LoginForm />, null, store);

    expect(screen.getByRole('heading')).toHaveTextContent('Sign In');
  });
});
