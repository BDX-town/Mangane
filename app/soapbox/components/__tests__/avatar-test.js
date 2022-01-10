import { fromJS } from 'immutable';
import React from 'react';

import { createComponent } from 'soapbox/test_helpers';

import Avatar from '../avatar';

describe('<Avatar />', () => {
  const account = fromJS({
    username: 'alice',
    acct: 'alice',
    display_name: 'Alice',
    avatar: '/animated/alice.gif',
    avatar_static: '/static/alice.jpg',
  });

  const size = 100;

  describe('Autoplay', () => {
    it('renders an animated avatar', () => {
      const component = createComponent(<Avatar account={account} animate size={size} />);
      const tree      = component.toJSON();

      expect(tree).toMatchSnapshot();
    });
  });

  describe('Still', () => {
    it('renders a still avatar', () => {
      const component = createComponent(<Avatar account={account} size={size} />);
      const tree      = component.toJSON();

      expect(tree).toMatchSnapshot();
    });
  });

  // TODO add autoplay test if possible
});
