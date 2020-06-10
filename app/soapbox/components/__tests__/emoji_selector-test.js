import React from 'react';
import renderer from 'react-test-renderer';
import EmojiSelector from '../emoji_selector';

describe('<EmojiSelector />', () => {
  it('renders correctly', () => {
    const component = renderer.create(<EmojiSelector />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
