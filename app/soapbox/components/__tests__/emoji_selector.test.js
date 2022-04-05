import React from 'react';

import { render, screen } from '../../jest/test-helpers';
import EmojiSelector from '../emoji_selector';

describe('<EmojiSelector />', () => {
  it('renders correctly', () => {
    const children = <EmojiSelector />;
    children.__proto__.addEventListener = () => {};

    render(children);

    expect(screen.queryAllByRole('button')).toHaveLength(6);
  });
});
