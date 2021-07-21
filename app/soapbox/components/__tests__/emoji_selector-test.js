import React from 'react';
import { createComponent } from 'soapbox/test_helpers';
import EmojiSelector from '../emoji_selector';

describe('<EmojiSelector />', () => {
  it('renders correctly', () => {
    const children = <EmojiSelector />;
    children.__proto__.addEventListener = () => {};

    const component = createComponent(children, {}, true);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
