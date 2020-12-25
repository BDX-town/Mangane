import React from 'react';
import { createComponent } from 'soapbox/test_helpers';
import EmojiSelector from '../emoji_selector';

describe('<EmojiSelector />', () => {
  it('renders correctly', () => {
    const component = createComponent(<EmojiSelector />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
