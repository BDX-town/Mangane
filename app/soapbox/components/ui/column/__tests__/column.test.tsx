import React from 'react';

import { render, screen } from '../../../../jest/test-helpers';
import Column from '../column';

describe('<Column />', () => {
  it('renders correctly with minimal props', () => {
    render(<Column />);

    expect(screen.getByRole('button')).toHaveTextContent('Back');
  });
});
