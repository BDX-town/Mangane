import React from 'react';

import { render, screen } from '../../jest/test-helpers';
import ColumnBackButton from '../column_back_button';

describe('<ColumnBackButton />', () => {
  it('renders correctly', () => {
    render(<ColumnBackButton />);

    expect(screen.getByRole('button')).toHaveTextContent('Back');
  });
});
