import React from 'react';

import { render, screen } from '../../../../jest/test-helpers';
import Emoji from '../emoji';

describe('<Emoji />', () => {
  it('renders the given text', () => {
    render(<Emoji emoji='smile' />);

    expect(screen.getByRole('img').getAttribute('alt')).toBe('smile');
  });
});
